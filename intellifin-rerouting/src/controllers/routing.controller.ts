import { Request, Response } from 'express';
import ApiResponse from '../helpers/apiResponse';
import { apiStatusCodes } from '../helpers/constants';
import RoutingServices from '../services/routing.services';
import logger from '../helpers/logger';

class RoutingContoller {

    public async processTransaction(request: Request, response: Response) {
        try {
            logger.logWinston("Request data: ")
            logger.logWinston(request.body);

            logger.logWinston("Request URL: ")
            logger.logWinston(request.url);

            const responseData: any = await RoutingServices.processTransaction(request.headers, request.body, request.url);

            // logger.logWinston("Response Data: ")
            // console.log("responseData purchase", responseData);
            const data = responseData.data || { responseCode: 100, responseMessage: 'An error has occured' };


            if (responseData.error) return response.status(apiStatusCodes.badRequest).json(response);
            if (data.updateRecord) {
                return ApiResponse.success(response, apiStatusCodes.success, data.response);
            }
            return ApiResponse.success(response, apiStatusCodes.success, data.response);
        } catch (error) {
            return ApiResponse.error(response, apiStatusCodes.serverError, error, 'An error has occured, please check your request');
            //return  response.status(apiStatusCodes.serverError).json({responseCode: 100, responseMessage: 'An error has occured, confirm your auth token'});

        }

    }

    public async callHome(request: Request, response: Response) {

        try {

            logger.logWinston("Request URL: ")
            logger.logWinston(request.url);
            const url = "callhome_posvas"
            const responseData: any = await RoutingServices.processLookup(request.headers, request.body, url);

            // return response.status(apiStatusCodes.success).json(responseData);
            return ApiResponse.success(response, apiStatusCodes.success, responseData);
        } catch (error) {

            // return response.status(apiStatusCodes.serverError).json({responseCode: 100, responseMessage: 'An error has occured, confirm your auth token'});
            return ApiResponse.error(response, apiStatusCodes.serverError, error, 'An error has occured, please check your request');
        }

    }

    public async terminalPrep(request: Request, response: Response) {

        try {

            logger.logWinston("Request URL: ")
            logger.logWinston(request.url);
            const url = "prep_posvas"
            const responseData: any = await RoutingServices.processLookup(request.headers, request.body, url);
            return ApiResponse.success(response, apiStatusCodes.success, responseData);
        } catch (error) {
            // console.log('Error :: ', error.status)
            return ApiResponse.error(response, apiStatusCodes.serverError, error, 'An error has occured, please check your request');
            // return response.status(apiStatusCodes.serverError).json({responseCode: 100, responseMessage: 'An error has occured, confirm your auth token'});
        }

    }


}

export default RoutingContoller;