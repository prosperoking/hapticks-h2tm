"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
const constants_1 = require("./constants");
class ApiResponse {
    success(res, status, data, message = "success") {
        return res.status(status).json({
            status,
            message,
            data
        });
    }
    send(res, status, message, data = null) {
        res.status(status).send({
            status,
            message,
            data,
        });
    }
    error(res, code, error = {}, message) {
        logger_1.default.log(error.message);
        if (code === parseInt('444')) {
            return this.send(res, constants_1.apiStatusCodes.badRequest, error.message);
        }
        if (code === constants_1.apiStatusCodes.badRequest) {
            return res.status(constants_1.apiStatusCodes.badRequest).json({
                status: constants_1.apiStatusCodes.badRequest,
                data: error,
                message
            });
        }
        return this.send(res, constants_1.apiStatusCodes.serverError, 'An error has occured', error);
    }
}
exports.default = new ApiResponse();
//# sourceMappingURL=apiResponse.js.map