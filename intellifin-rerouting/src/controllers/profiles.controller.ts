import { Request, Response } from 'express';
import PTSPProfileModel from '../db/models/ptspProfile.model';
import {pick,} from "lodash"
export default class ProfileController {
    public async create(request: Request, response: Response) {
        try {
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
                "webhookId"
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

}