import { Request, Response } from 'express';
import PTSPProfileModel from '../db/models/ptspProfile.model';
import {pick,} from "lodash"
import { sendSocketMessage, TransactionTypes } from '../helpers/cardsockethelper';
export default class ProfileController {
    public async create(request: Request, response: Response) {
        try {
            console.log(request.body)
            const data = await PTSPProfileModel.create(request.body);
            response.json({status: true, data})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public async index(request: Request, response: Response) {
        try {
            const {q,limit,page} = request.query;
            let filter = {}
            if(q?.length) {
                filter = {
                    $or:[
                        { title: RegExp(`^${q}`,'i') },
                        { isoHost: RegExp(`^${q}`,'i') },
                        { type: RegExp(`^${q}`,'i') },
                    ]
                };
            };
            const data = await PTSPProfileModel.paginate(filter,{
                limit: Number.parseInt(`${limit}`) || 30,
                page: Number.parseInt(`${page}`) || 1,
                populate:[
                    {path: 'terminals_count'},
                    {path: 'organisation', select: 'name'},
                    {path: 'webhook', select: 'name'},
                ],
            });
            response.json(data)
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public async edit(request: Request, response: Response) {
        try {
            const profile = await PTSPProfileModel.findById(request.params?.id);

            if(!profile) return response.status(404).json({message: "Profile not found"});
            const data = await profile.update(pick(request.body,[
                "title",
                "isoHost",
                "isoPort",
                "isSSL",
                "type",
                "componentKey1",
                "componentKey2",
                "iswSwitchAmount",
                "terminals_count",
                "iswMid",
                "iswInstitutionCode",
                "allowProcessorOverride",
                "iswDestinationAccount",
                "organisationId",
                "threeLineKey",
                "threeLineHost",
                "threeLinePort",
                "threeLineHostSSL",
                "hasthreelineSupport",
                "webhookId",
                "blueSaltTID",
                "blueSaltKey",
                "blueSaltEnv",
                "processorSettings",
                "iswISOConfig",
                "hydrogenConfig",
            ]));


            response.json({status: true, data})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public async delete(request: Request, response: Response) {
        try {
            const profile = await PTSPProfileModel.findById(request.params?.id);

            if(!profile) return response.status(404).json({message: "Profile not found"});

            response.json({status: true,data: {_id: profile.id}, message: "Profile deleted successfully"})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public async rotateZpk(request: Request, response: Response){
        try {
            const profile = await PTSPProfileModel.findById(request.params?.id);

            if(!profile) return response.status(404).json({message: "Profile not found"});

            const type = request.body.type;

            const details:[TransactionTypes, object] = {
                isw: [TransactionTypes.ISW_KEY_EXCHANGE, {
                    host: profile.iswISOConfig.host,
                    port: profile.iswISOConfig.port,
                    ssl: profile.iswISOConfig.ssl,
                    zmk: profile.iswISOConfig.zmk
                }],
                hydrogen: [TransactionTypes.HYDROGEN_KEY_EXCHANGE ,{
                    host: profile.hydrogenConfig.host,
                    port: profile.hydrogenConfig.port,
                    ssl: profile.hydrogenConfig.ssl,
                    zmk: profile.hydrogenConfig.zmk
                },]
            }[type]


            const result = await sendSocketMessage(...details)

            if(!result.status){
                return response.status(400).json(result.data)
            }

            profile[type == 'isw'?'iswISOConfig':'hydrogenConfig'].zpk = result.data.clearZPK
            profile[type == 'isw'?'iswISOConfig':'hydrogenConfig'].lastRotate = new Date()
            profile[type == 'isw'?'iswISOConfig':'hydrogenConfig'].kcv = result.data.kcv
            profile.save()

            return response.json({
                status: true,
                message: "Key exchange successfull"
            })

        } catch (error) {
            console.trace(error)
            response.status(400).json({
                message: "Something went wong"
            })
        }
    }

}