import { Request, Response } from "express";
import GroupTid, {IGroupTid} from "../db/models/groupTid.model";
import { pick } from "lodash";
import { Groupkeyexchange } from '../queue/queue';
import { CardSocketResponse, sendSocketMessage } from "../helpers/cardsockethelper";
import { TransactionTypes } from '../helpers/cardsockethelper';
import PTSPProfileModel from '../db/models/ptspProfile.model';
import logger from "../helpers/logger";
import { Document, Types } from "mongoose";

export default class GroupTidController {
    public async index(req: Request, res: Response): Promise<any> {
        try {
            const {q,limit,page, organisation} = req.query;
            let filter:{[key:string]: any} = {}
            if(q?.length) {
                filter = {
                    $or:[
                        { terminalId: RegExp(`^${q}`,'i') },
                        // { hydrogenTID: RegExp(`^${q}`,'i') },
                        // { iswISOTID: RegExp(`^${q}`,'i') },
                    ]
                };
            };
            // @ts-ignore
            const orgId = !req.user.organisaitonId ? organisation : req.user.organisationId;
            if(orgId?.length) filter = {...filter, organisationId: orgId };

            const data = await GroupTid.paginate(filter,{
                populate: [
                    {path: 'profile', select:'title iswSwitchAmount'},
                    {path: 'organisation', select:'name'},
                    {path: 'terminals_count'}
                ],
                limit: Number.parseInt(`${limit}`) || 30,
                page: Number.parseInt(`${page}`) || 1,
            });
            res.json({data, count: data.length})

        } catch (error) {
            console.log(error)
            res.status(400).json({message: error.message})
        }
    }

    public async all(req: Request, res: Response): Promise<any> {
        try {
            const {q,limit,page, organisation} = req.query;
            let filter:{[key:string]: any} = {}
            if(q?.length) {
                filter = {
                    $or:[
                        { terminalId: RegExp(`^${q}`,'i') },
                        // { hydrogenTID: RegExp(`^${q}`,'i') },
                        // { iswISOTID: RegExp(`^${q}`,'i') },
                    ]
                };
            };
            // @ts-ignore


            const data = await GroupTid.find(filter).select("terminalId");
            res.json(data)

        } catch (error) {
            logger.error(error)
            res.status(400).json({message: error.message})
        }
    }

    public async create(request: Request, response: Response) {
        try {
            const data = await GroupTid.create({
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
            let groupTId = await GroupTid.findById(request.params.id);
            if(!groupTId) {
                return response.status(404).json({message: "Group Tid not found"});
            }

            console.log(request.body)

            const data = await groupTId.update(pick(request.body,[
                "profileId",
                "terminalId",
                "iswISOTID",
                "organisationId",
                "hydrogenTID",
            ]));

            try{
            //    ProfileController.performKeyExchange(request.body, request.params.id);
            // keyExchange.add('keyexchange', {_id: terminal.id});
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
            let groupTid = await GroupTid.findById(request.params.id);
            if(!groupTid) {
                return response.status(404).json({message: "Group Tid not found"});
            }

            const data = await groupTid.delete();

            response.json({status: true, data})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public async triggerKeyExchange(request: Request, response: Response) {
        try {
            let groupTid = await GroupTid.findById(request.params.id);
            if(!groupTid) {
                return response.status(404).json({message: "Group Tid not found"});
            }

            if(request.body.sync){
                await groupTid.populate('profile');
                return GroupTidController.performKeyExchange(groupTid)
            }


            try{
                await Groupkeyexchange.add('groupkeyexchange', {_id: groupTid.id});
            }catch(e){
                console.log("Unable to trigger key exchange", e)
            }

            response.json({status: true})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public static async performKeyExchange(
        groupTerminal:  Document<unknown, any, IGroupTid> & Omit<IGroupTid & {
            _id: Types.ObjectId;
        }, never>
    ) {
        const profile = groupTerminal.profile;
        let result: CardSocketResponse<any> = {status: false, data: null};
        try {

            result = await sendSocketMessage(TransactionTypes.KEY_EXCHANGE, {
                tid: groupTerminal.terminalId,
                component: profile.componentKey1,
                ip: profile.isoHost,
                ssl: String(profile.isSSL),
                port: profile.isoPort
            });
        } catch (error) {
            console.log("unable to perform auto key exchange: ", error)
        }

        if (result?.status) {
            const { data } = result;
            groupTerminal.encmasterkey = data.encmasterkey;
            groupTerminal.encpinkey = data.encpinkey;
            groupTerminal.encsesskey = data.encsesskey;
            groupTerminal.clrmasterkey = data.clrmasterkey;
            groupTerminal.clrsesskey = data.clrmasterkey;
            groupTerminal.clrpinkey = data.clrpinkey;
            groupTerminal.paramdownload = data.paramdownload;
            await groupTerminal.save();
        }

        return result;
    }

}
