import { Request, Response } from 'express';
import PTSPProfileModel from '../db/models/ptspProfile.model';
import {pick, omit} from "lodash"
export default class ProfileController {
    public async create(request: Request, response: Response) {
        try {
            let {body} = request;

            const data = await (new  PTSPProfileModel(omit(body,['_id'])) ).save();

            response.json({status: true, data})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }


    public async index(request: Request, response: Response) {
        try {
            const data = await PTSPProfileModel.find({},).populate('terminals_count');

            response.json({data, count: data.length})
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
                "componentKey1",
                "componentKey2",
                "iswSwitchAmount",
                "terminals_count",
                "iswMid",
                "iswInstitutionCode",
                "iswDestinationAccount",
            ]));


            response.json({status: true, data})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }
}