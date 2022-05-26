"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiResponse_1 = __importDefault(require("../helpers/apiResponse"));
const constants_1 = require("../helpers/constants");
const routing_services_1 = __importDefault(require("../services/routing.services"));
const logger_1 = __importDefault(require("../helpers/logger"));
class RoutingContoller {
    processTransaction(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.logWinston("Request data: ");
                logger_1.default.logWinston(request.body);
                logger_1.default.logWinston("Request URL: ");
                logger_1.default.logWinston(request.url);
                const responseData = yield routing_services_1.default.processTransaction(request.headers, request.body, request.url);
                // logger.logWinston("Response Data: ")
                // console.log("responseData purchase", responseData);
                const data = responseData.data || { responseCode: 100, responseMessage: 'An error has occured' };
                if (responseData.error)
                    return response.status(constants_1.apiStatusCodes.badRequest).json(response);
                if (data.updateRecord) {
                    return apiResponse_1.default.success(response, constants_1.apiStatusCodes.success, data.response);
                }
                return apiResponse_1.default.success(response, constants_1.apiStatusCodes.success, data.response);
            }
            catch (error) {
                return apiResponse_1.default.error(response, constants_1.apiStatusCodes.serverError, error, 'An error has occured, please check your request');
                //return  response.status(apiStatusCodes.serverError).json({responseCode: 100, responseMessage: 'An error has occured, confirm your auth token'});
            }
        });
    }
    callHome(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.logWinston("Request URL: ");
                logger_1.default.logWinston(request.url);
                const url = "callhome_posvas";
                const responseData = yield routing_services_1.default.processLookup(request.headers, request.body, url);
                // return response.status(apiStatusCodes.success).json(responseData);
                return apiResponse_1.default.success(response, constants_1.apiStatusCodes.success, responseData);
            }
            catch (error) {
                // return response.status(apiStatusCodes.serverError).json({responseCode: 100, responseMessage: 'An error has occured, confirm your auth token'});
                return apiResponse_1.default.error(response, constants_1.apiStatusCodes.serverError, error, 'An error has occured, please check your request');
            }
        });
    }
    terminalPrep(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.logWinston("Request URL: ");
                logger_1.default.logWinston(request.url);
                const url = "prep_posvas";
                const responseData = yield routing_services_1.default.processLookup(request.headers, request.body, url);
                return apiResponse_1.default.success(response, constants_1.apiStatusCodes.success, responseData);
            }
            catch (error) {
                // console.log('Error :: ', error.status)
                return apiResponse_1.default.error(response, constants_1.apiStatusCodes.serverError, error, 'An error has occured, please check your request');
                // return response.status(apiStatusCodes.serverError).json({responseCode: 100, responseMessage: 'An error has occured, confirm your auth token'});
            }
        });
    }
}
exports.default = RoutingContoller;
//# sourceMappingURL=routing.controller.js.map