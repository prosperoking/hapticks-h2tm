import { Request, Response } from 'express';
import logger from '../helpers/logger';
import Terminal from '../db/models/terminal.model';
import { sendSocketMessage, TransactionTypes } from '../helpers/cardsockethelper';
import {pick} from "lodash"
import PTSPProfileModel from '../db/models/ptspProfile.model';
import { keyExchange } from '../queue/queue';
import TerminalID from '../db/models/terminalIds.model';
import { generateTidRange } from '../helpers/appUtils';
import Config from '../config/config';
export default class TerminalController {
    public async index(request: Request, response: Response) {
        try {

            const {q,limit,page, organisation} = request.query;
            let filter:{[key:string]: any} = {}
            if(q?.length) {
                filter = {
                    $or:[
                        { terminalId: RegExp(`^${q}`,'i') },
                        { hydrogenTID: RegExp(`^${q}`,'i') },
                        { habariTID: RegExp(`^${q}`,'i') },
                        { iswISOTID: RegExp(`^${q}`,'i') },
                        { serialNo: RegExp(`^${q}`,'i') },
                        { brand: RegExp(`^${q}`,'i') },
                        { deviceModel: RegExp(`^${q}`,'i') },
                    ]
                };
            };
            // @ts-ignore
            const orgId = !request.user.organisaitonId ? organisation : request.user.organisationId;
            if(orgId?.length) filter = {...filter, organisationId: orgId };
            const data = await Terminal.paginate(filter,{
                populate: [
                    {path: 'profile', select:'title iswSwitchAmount'},
                    {path: 'organisation', select:'name'},
                    {path: 'groupTid', select:'terminalId paramdownload parsedParams', populate:{path: 'profile', select: "title"}},
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
                "threeLineTid",
                "organisationId",
                "brand",
                "deviceModel",
                "iswISOTID",
                "hydrogenTID",
                "habariTID",
                "terminalLocation",
                "terminalGroupId"
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

            result = await sendSocketMessage(TransactionTypes.KEY_EXCHANGE, {
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

    public async export(request: Request, response: Response) {
        try {
            const {q, organisation} = request.query;
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
            if(orgId?.length) filter = {...filter, organisationId: orgId };
            response.header('Content-Type', 'text/csv; charset=utf-8')
            response.attachment(`terminals-${Date.now()}.csv`)
            Terminal.find(filter).cursor()
            .pipe(Terminal.csvTransformStream()).pipe(response);
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public async generatedTidStat(request: Request, response: Response) {
        try {
            const data = await TerminalID.aggregate([
                {
                    $group : {
                        "count":{$sum : 1},
                         _id: {
                            type: "$type",
                            linkedTo: "$linkedTo",
                         }
                    },
                },
                {
                    $group: {
                        _id: "$_id.type",
                        total:{
                            $sum: 1,
                        },
                        assigned: {
                            $sum: {
                                $cond:{
                                    if: {$ne: ["$_id.linkedTo", null]},
                                    else: 0,
                                    then: 1
                                }
                            }
                        },
                        unAssined: {
                            $sum: {
                                $cond:{
                                    if: {$eq: ["$_id.linkedTo", null]},
                                    else: 0,
                                    then: 1
                                }
                            }
                        }
                    }
                },
            ]);
            response.json({data})
        } catch (error) {
            response.status(400).json({message: error.message})
        }
    }

    public async generatedTids(request: Request, response: Response) {
        try {

            const {q,limit,page, organisation} = request.query;
            let filter:{[key:string]: any} = {}
            if(q?.length) {
                filter = {
                    $or:[
                        { tid: RegExp(`^${q}`,'i') },
                        { type: RegExp(`^${q}`,'i') },
                    ]
                };
            };
            // @ts-ignore
            const orgId = !request.user.organisaitonId ? organisation : request.user.organisationId;
            if(orgId?.length) filter = {...filter, organisationId: orgId };
            const data = await TerminalID.paginate(filter,{
                populate: [
                    {path: 'terminal', select:'serialNo brand deviceModel'},
                 ],
                limit: Number.parseInt(`${limit}`) || 30,
                page: Number.parseInt(`${page}`) || 1,
                sort:{
                    _id: -1,
                }
            });
            response.json({data, count: data.length})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public async generateTids(request: Request, response: Response) {
        try {
            let {
                start,
                end,
                // iswPrefix,
                // hydrogenPrefix
            }:{
                start: string,
                end: string,
                // iswPrefix: string,
                // hydrogenPrefix: string
            } = request.body;
            if(start?.length !== 4 || end?.length!== 4)
                return response.json({message: "Invalid start and end"})
            start = start.toUpperCase()
            end = end.toUpperCase()
            const rangeGenerated = `${start}-${end}`;
            let tids:any[] =[];
            const mapForSave = (tids:string[], type: 'isw'|'hydrogen')=>{
                return tids.map(tid=>({
                    tid,
                    type,
                    rangeGenerated,
                }))
            }
            const {processorPrefixes} =(new  Config()).configObject
            console.log(processorPrefixes)
            if(!processorPrefixes.isw?.length || !processorPrefixes.hydrogen?.length) return response.status(400).json({
                message: "Processor Prefix not configured"
            })
            tids = tids.concat(
                mapForSave( generateTidRange(start, end, processorPrefixes.isw), 'isw')
            ).concat(
                mapForSave(
                    generateTidRange(start, end, processorPrefixes.hydrogen),
                    'hydrogen'
                )
            )

            try{
                await TerminalID.insertMany(tids,{ordered: false, })
            }catch(e) {

            }


            return response.json({
                data:{
                    totalGenerated: tids.length,
                },
            });
        } catch (error) {
            response.status(400).json({message: error.message})
        }
    }
}