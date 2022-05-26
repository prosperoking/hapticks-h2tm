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
const vas_services_1 = __importDefault(require("../services/vas.services"));
const logger_1 = __importDefault(require("../helpers/logger"));
class VasContoller {
    processVasTransaction(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.logWinston("Request data: ");
                logger_1.default.logWinston(request.body);
                logger_1.default.logWinston("Request URL: ");
                logger_1.default.logWinston(request.url);
                const responseData = yield vas_services_1.default.processTransaction(request.headers, request.body, request.url);
                logger_1.default.logWinston("Response Data: ");
                console.log("responseData", responseData);
                const data = responseData.data;
                if (responseData.error) {
                    return apiResponse_1.default.send(response, constants_1.apiStatusCodes.success, (data === null || data === void 0 ? void 0 : data.description) || "Error in Trx Process", responseData);
                }
                else {
                    return apiResponse_1.default.success(response, constants_1.apiStatusCodes.success, responseData);
                }
            }
            catch (error) {
                return apiResponse_1.default.error(response, constants_1.apiStatusCodes.serverError, error, 'An error has occured, please check your request');
            }
        });
    }
    lookup(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.logWinston("Request URL: ");
                logger_1.default.logWinston(request.url);
                // return true;
                const responseData = yield vas_services_1.default.processLookup(request.headers, request.body, request.url);
                return apiResponse_1.default.success(response, constants_1.apiStatusCodes.success, responseData.data || responseData);
            }
            catch (error) {
                console.log("Formatted Response :: ", error);
                return apiResponse_1.default.error(response, constants_1.apiStatusCodes.serverError, error, 'An error has occured, please check your request');
            }
        });
    }
}
exports.default = VasContoller;
//# sourceMappingURL=vas.controller.js.map