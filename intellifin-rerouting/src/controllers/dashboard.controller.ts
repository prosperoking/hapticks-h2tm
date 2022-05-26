import routeLog from "../decorators/requestLogger";
import { Response, Request } from 'express';
import vasjournalsModel from "../db/models/vasjournals.model";
import logger from "../helpers/logger";
import Termninal from "../db/models/terminal.model";

export default class DashboardController {
    public async index(request: Request, response: Response){
        try {
            const totalTransactionsToday = await vasjournalsModel.where({
                $and:[
                    {
                        transactionTime:{
                            $gte: Date.now(),
                            
                        }
                    },
                    {
                        transactionTime:{
                            $lte: Date.now(),
                        }
                    },
                ]
            }).count();
            const totalFailedTransactionsToday = await vasjournalsModel.where({
                $and:[
                    {
                        transactionTime:{
                            $gte: Date.now(),
                            
                        }
                    },
                    {
                        transactionTime:{
                            $lte: Date.now(),
                        }
                    },
                ],
                responseCode: {
                    $ne: "00",
                }
            }).count();

            const lastestTransacions = await vasjournalsModel.find({
                $and:[
                    {
                        transactionTime:{
                            $gte: Date.now(),
                            
                        }
                    },
                    {
                        transactionTime:{
                            $lte: Date.now(),
                        }
                    },
                ]
            }).sort({_id: -1}).limit(50)
            const terminalCount = await Termninal.find({}).count()
            return response.json({
                totalTransactionsToday,
                totalFailedTransactionsToday,
                lastestTransacions,
                terminalCount
            })
        } catch (error) {
            logger.error(error.message);
            response.status(400).json({
                message: "An error occured"
            })
        }
    }
}