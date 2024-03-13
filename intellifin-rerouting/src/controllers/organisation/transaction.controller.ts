import { Request, Response } from "express";
import logger from "../../helpers/logger";
import Transactions from "../../db/models/transaction.model";

export async function index(req: Request, res: Response) {
    try{
        const query = req.query.q;
        const terminals = await Transactions.paginate({
            //@ts-ignore
            organisationId: req.user._id,
            $or: [
                {terminalId: query},
                {rrn: query},
                {stan: query}
            ],
            processor: req.query.processor || undefined,
            $and: [
                {createdAt: {$gte:  req.query.startDate || undefined}},
                {createdAt: {$lte: req.query.endDate || undefined}},
            ]
        })
        res.json(terminals)
    }catch (error){
        logger.error(error)
        res.status(400).json({message:"Something went wrong"})
    }
}

