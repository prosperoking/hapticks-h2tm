import { Request, Response } from 'express';
import Terminal from '../db/models/terminal.model';
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
            }).populate({path: 'profile', select:'title'});

            response.json({data, count: data.length})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }

    public async create(request: Request, response: Response) {
        try {
            console.log(request.body)
            const data = await Terminal.create(request.body);

            response.json({status: true, data})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: error.message})
        }
    }
}