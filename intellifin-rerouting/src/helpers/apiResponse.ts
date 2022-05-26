import { Response } from 'express';
import Logger from './logger';
import { apiStatusCodes } from './constants';

class ApiResponse {
    success(res: Response, status: number, data: any, message: string="success") {
        return res.status(status).json({
            status,
            message,
            data
        });
    }

    send(res: Response, status: number, message: string, data: any = null) {
        res.status(status).send({
            status,
            message,
            data,
        });
    }

    error(res: Response, code: number, error: any = {}, message: string) {
        Logger.log(error.message);
        if (code === parseInt('444')) {
            return this.send(res, apiStatusCodes.badRequest, error.message);
        }

        if (code === apiStatusCodes.badRequest) {
            return res.status(apiStatusCodes.badRequest).json({
                status: apiStatusCodes.badRequest,
                data: error,
                message
            });
        }

        
        return this.send(res, apiStatusCodes.serverError, 'An error has occured', error);
    }
}

export default new ApiResponse();