import { Request, Response } from 'express';
import PTSPProfileModel from '../db/models/ptspProfile.model';
export default class ProfileController {
    async create(request: Request, response: Response) {
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
            const data = await PTSPProfileModel.find({},{componentKey1: false, componentKey2: false}).populate('terminals_count');

            response.json({data, count: data.length})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }
}