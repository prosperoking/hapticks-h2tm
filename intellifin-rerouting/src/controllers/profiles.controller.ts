import { Request, Response } from 'express';
import PTSPProfileModel from '../db/models/ptspProfile.model';
import {pick,} from "lodash"
import { sendSocketMessage, TransactionTypes } from '../helpers/cardsockethelper';
import Terminal from '../db/models/terminal.model';
import logger from '../helpers/logger';
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
            let {body} = request;
            body.iswISOConfig = body.iswISOConfig === undefined?null: body.iswISOConfig
            body.hydrogenConfig = body.hydrogenConfig === undefined?null: body.hydrogenConfig
            body.habariConfig = body.habariConfig === undefined?null: body.habariConfig
            const data = await profile.update(pick(body,[
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
                "habariConfig",
                "zpk",
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

            const inUse = await Terminal.countDocuments({profileId: profile._id});

            if(inUse > 0) return response.status(400).json({message: "Profile in use."});
            profile.deleteOne()
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
            if(profile.linkedProfileId !== null) return response.status(422).json({message: "Sorry you can't rotate keys on a linked profile"})
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
                },],
                habari: [TransactionTypes.HABARI_KEY_EXCHANGE ,{
                    host: profile.habariConfig.host,
                    port: profile.habariConfig.port,
                    ssl: profile.habariConfig.ssl,
                    zmk: profile.habariConfig.zmk
                },],
            }[type]
            const getConfigKey = (type): string | undefined=>({
                isw: "iswISOConfig",
                hydrogen: "hydrogenConfig",
                habari: "habariConfig",
            })[type]
            const configKey = getConfigKey(type)
            if(!configKey?.length) {
                return response.status(400).json({
                    message: "Invalid type"
                })
            }

            const result = await sendSocketMessage(...details)

            if(!result.status){
                return response.status(400).json(result.data)
            }


            profile[configKey].zpk = result.data.clearZPK
            profile[configKey].lastRotate = new Date()
            profile[configKey].kcv = result.data.kcv
            await profile.save()
            let oProfile = profile.toJSON()
            await PTSPProfileModel.updateMany({linkedProfileId: profile._id},{$set:{
                [configKey]: oProfile[configKey],
            }});

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

    public async cloneProfile(request: Request, response: Response){
        try {
            const profile = await PTSPProfileModel.findById(request.body?.profileId);
            if(!profile) return response.status(404).json({message: "Profile not found"});
            let oldData = JSON.parse(JSON.stringify(profile));
            delete oldData._id;
            delete oldData.id;
            delete oldData.__v;
            console.log("old data: ", oldData);
            const newProfile = new PTSPProfileModel({
                ...oldData,
                title: request.body.title,
                linkedProfileId: request.body.profileId,
            });
            newProfile.save();

            return response.json({message: "Profile cloned"})
        } catch (error) {
            console.trace(error);
            response.json({
                status: false,
                message: "Something went wrong"
             })
        }
    }

    public async unlink(request: Request, response: Response){
        try {
            const profile = await PTSPProfileModel.findById(request.params?.id);
            if(!profile) return response.status(404).json({message: "Profile not found"});
            profile.linkedProfileId = null;
            await profile.save();
            return response.json({message: "Profile Unlinked"})
        } catch (error) {
            console.trace(error);
            response.json({
                status: false,
                message: "Something went wrong"
             })
        }
    }
}