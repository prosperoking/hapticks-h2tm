import { Request, Response } from 'express';
import logger from '../helpers/logger';
import Terminal from '../db/models/terminal.model';
import { performCardSocketTranaction, TransactionTypes } from '../helpers/cardsockethelper';
import {pick} from "lodash"
import PTSPProfileModel from '../db/models/ptspProfile.model';
import { keyExchange } from '../queue/queue';
export default class TerminalController {
    public async index(request: Request, response: Response) {
        try {

            const {q,limit,page, organisation} = request.query;
            let filter:{[key:string]: any} = {}
            if(q?.length) {
                filter = {
                    $or:[
                        { terminalId: RegExp(`^${q}`,'i') },
                        { serialNo: RegExp(`^${q}`,'i') },
                        { brand: RegExp(`^${q}`,'i') },
                        { deviceModel: RegExp(`^${q}`,'i') },
                    ]
                };
            };
            // @ts-ignore
            const orgId = !request.user.organisaitonId ? organisation : request.user.organisationId;
            if(orgId?.length) filter.organisationId = orgId;
            console.log('filter: ', filter, orgId, organisation )
            const data = await Terminal.paginate(filter,{
                populate: [
                    {path: 'profile', select:'title iswSwitchAmount'},
                    {path: 'organisation', select:'name'}
                ],
                limit: Number.parseInt(`${limit}`) || 30,
                page: Number.parseInt(`${page}`) || 1,
            });  

            response.json({data, count: data.length})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public async create(request: Request, response: Response) {
        try {
            const data = await Terminal.create({
                ...request.body, 
            });

            response.json({status: true, data})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }


    
    public async update(request: Request, response: Response) {
        try {
            let terminal = await Terminal.findById(request.params.id);
            if(!terminal) {
                return response.status(404).json({message: "Terminal not found"});
            }

            const data = await terminal.update(pick(request.body,[
                "serialNo",
                "terminalId",
                "profileId",
                "iswTid",
                "iswUniqueId",
                "organisationId",
                "brand",
                "deviceModel"
            ]));

            try{
            //    ProfileController.performKeyExchange(request.body, request.params.id);
            keyExchange.add('keyexchange', {_id: terminal.id});
            }catch(e){
                console.log("Unable to trigger key exchange", e)
            }
            
            response.json({status: true, data})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public async destroy(request: Request, response: Response) {
        try {
            let terminal = await Terminal.findById(request.params.id);
            if(!terminal) {
                return response.status(404).json({message: "Terminal not found"});
            }

            const data = await terminal.delete();
            
            response.json({status: true, data})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public async bulkUpload(request: Request, response: Response) {
        try {
            let {terminals, profileId, organisationId} = request.body;
            let data = await Terminal.insertMany(terminals.map(terminal=>({
                ...terminal,
                profileId,
                organisationId,
            })))
            return response.json({
                data
            })
        } catch (error) {
            logger.error(error)
            response.status(400).json({message: "Import failed"})
        }
    }

    public async triggerKeyExchange(request: Request, response: Response) {
        try {
            let terminal = await Terminal.findById(request.params.id);
            if(!terminal) {
                return response.status(404).json({message: "Terminal not found"});
            }

            try{
            // await   TerminalController.performKeyExchange(request.body, request.params.id);
            await keyExchange.add('keyexchange', {_id: terminal.id});
            }catch(e){
                console.log("Unable to trigger key exchange", e)
            }
            
            response.json({status: true})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public static async performKeyExchange(data, terminalId) {
        const profile = await PTSPProfileModel.findById(data.profileId);
        if(!profile) return

        const terminal = await Terminal.findById(terminalId);
        let result;
        try {

            result = await performCardSocketTranaction(TransactionTypes.KEY_EXCHANGE, {
                tid: terminal.terminalId,
                component: profile.componentKey1,
                ip: profile.isoHost,
                ssl: String(profile.isSSL),
                port: profile.isoPort
            });
        } catch (error) {
            console.log("unable to perform auto key exchange: ", error)
            return;
        }

        if (result?.status) {
            const { data } = result;
            terminal.encmasterkey = data.encmasterkey;
            terminal.encpinkey = data.encpinkey;
            terminal.encsesskey = data.encsesskey;
            terminal.clrmasterkey = data.clrmasterkey;
            terminal.clrsesskey = data.clrmasterkey;
            terminal.clrpinkey = data.clrpinkey;
            terminal.paramdownload = data.paramdownload;

            await terminal.save();
        }
            
    }
}