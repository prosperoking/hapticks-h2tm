import { Request, Response } from 'express';
import logger from '../helpers/logger';
import Terminal from '../db/models/terminal.model';
import { performCardSocketTranaction, TransactionTypes } from '../helpers/cardsockethelper';
import {pick} from "lodash"
import PTSPProfileModel from '../db/models/ptspProfile.model';
export default class ProfileController {
    public async index(request: Request, response: Response) {
        try {
            const data = await Terminal.find({},{
                clrmasterkey: false,
                encmasterkey: false,
                encsesskey: false,
                clrsesskey: false,
                encpinkey: false,
                clrpinkey: false,
            }).populate({path: 'profile', select:'title iswSwitchAmount'});

            response.json({data, count: data.length})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public async create(request: Request, response: Response) {
        try {
            const data = await Terminal.create(request.body);

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
            ]));

            try{
                ProfileController.performKeyExchange(request.body, request.params.id);
            }catch(e){
                console.log("Unable to trigger key exchange", e)
            }
            
            response.json({status: true, data})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public async bulkUpload(request: Request, response: Response) {
        try {
            
        } catch (error) {

            logger.error(error)
            response.status(400).json({message: "Import failed"})
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