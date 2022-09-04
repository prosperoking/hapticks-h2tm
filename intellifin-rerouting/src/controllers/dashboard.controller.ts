import routeLog from "../decorators/requestLogger";
import { Response, Request } from 'express';
import vasjournalsModel from "../db/models/transaction.model";
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

    public async transactions(request: Request, response: Response) {
        try {
            const date = moment().format("YYYY-MM-DD")
            const transactions = await vasjournalsModel.paginate({
                ...DashboardController.filterGen(request.query),
                // @ts-ignore
                organisationId: request.user?.organisation_id ?? null,
            },{
                sort: {_id: -1},
                limit: Number(request.query.limit || 50),
                page: Number(request.query.page || 1),
                populate: [
                    {path: 'organisation' },
                ]
            });

            return response.json(transactions)
        } catch (error) {
            logger.error(error.message);
            response.status(400).json({
                message: "An error occured"
            })
        }
    }

    private static filterGen({q, organisation, startDate, endDate}: any) {
        let query = {};
        if(q !== undefined) {
            query = {
                ...query,
                $or: [
                    {
                        terminalId: RegExp(`^${q}`,'i'),
                    },
                    {
                      rrn: RegExp(`^${q}`,'i'),  
                    },
                    {
                        merchantName: {$regex: `${q}`},
                    }
                ]
            }
        }

        if(organisation !== undefined) {
            query = {...query, organisationId: organisation}
        }

        if(Boolean(startDate)) {
            query = {
                ...query, 
                $and:[
                    {
                        transactionTime:  {
                            $gte: moment(startDate).toDate(),
                        }
                    },
                ]
            }
        }
        if(Boolean(endDate)) {
            query = {
                ...query, 
                $and:[
                    ... query['$and'] || [],
                    {
                        transactionTime:  {
                            $lte:  moment(endDate).toDate(),
                        }
                    },
                ]
            }
        }

        return query
    }
}