import {Request, Response} from "express"
import { IUserData } from "../db/models/user.model"
import Bank from "../db/models/bank.model"


declare module"express" {
    interface Request {
        user?: IUserData | any
    }
}

export async function  getBanks(req: Request, res: Response){
    const banks = await Bank.find({},{_id: 1, name: 1});

    return res.json(banks)
}

export async function getBins(req: Request, res: Response){}

export async function addBin(req: Request, res: Response){}

export async function updateBin(req: Request, res: Response){}

export async function deleteBin(req: Request, res: Response){}