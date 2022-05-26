import { Request, Response } from 'express';
import ApiResponse from '../helpers/apiResponse';
import { apiStatusCodes } from '../helpers/constants';
import VasServices from '../services/vas.services';
import logger from '../helpers/logger';
import vasServices from '../services/vas.services';
import routingServices from '../services/routing.services';
import Utils from '../helpers/utils';

class VasContoller {

    public async processVasTransaction(request: Request, response: Response) {
        try {
            logger.logWinston("Request data: ")
            logger.logWinston(request.body);

            logger.logWinston("Request URL: ")
            logger.logWinston(request.url);

            const responseData: any = await VasServices.processTransaction(request.headers, request.body, request.url);

            logger.logWinston("Response Data: ")
            console.log("responseData", responseData);

            const data = responseData.data;

            if (responseData.error) {
                return ApiResponse.send(response, apiStatusCodes.success, data?.description || "Error in Trx Process", responseData);
            } else {
                return ApiResponse.success(response, apiStatusCodes.success, responseData);
            }

        } catch (error) {
            return ApiResponse.error(response, apiStatusCodes.serverError, error, 'An error has occured, please check your request');
        }

    }

    public async lookup(request: Request, response: Response) {

        try {

            logger.logWinston("Request URL: ")
            logger.logWinston(request.url);
            // return true;
            const responseData: any = await VasServices.processLookup(request.headers, request.body, request.url);
            return ApiResponse.success(response, apiStatusCodes.success, responseData.data || responseData);

        } catch (error) {
            console.log("Formatted Response :: ", error)
            return ApiResponse.error(response, apiStatusCodes.serverError, error, 'An error has occured, please check your request');
        }

    }
}

export default VasContoller;