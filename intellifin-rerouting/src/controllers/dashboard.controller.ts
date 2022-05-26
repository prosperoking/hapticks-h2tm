import routeLog from "../decorators/requestLogger";
import { Response, Request } from 'express';
import vasjournalsModel from "../db/models/vasjournals.model";
import logger from "../helpers/logger";
import Termninal from "../db/models/terminal.model";
import moment from "moment"
export default class DashboardController {
    public async index(request: Request, response: Response){
        try {
            const date = moment().format("YYYY-MM-DD")
            const totalTransactionsToday = await vasjournalsModel.where({
                transactionTime:{
                    $gte: new Date(date),
                }
            }).count();
            const totalFailedTransactionsToday = await vasjournalsModel.where({
                transactionTime:{
                    $gte: new Date(date),
                },
                responseCode: {
                    $ne: "00",
                }
            }).count();

            const lastestTransacions = await vasjournalsModel.find({
                transactionTime:{
                    $gte: new Date(date),
                }
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