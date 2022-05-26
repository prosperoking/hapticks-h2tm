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
const web_services_1 = __importDefault(require("./web.services"));
const db_services_1 = __importDefault(require("./db.services"));
const utils_1 = __importDefault(require("../helpers/utils"));
class RoutingServices {
    constructor() {
        this.dbServices = new db_services_1.default();
        this.notifcationUrl = process.env.NOTIFICATION_URL;
    }
    processLookup(headers, payload, requestUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("endpointUrl :: ", requestUrl);
            // let endpointUrl = this.prepareGeneralEndpoint(requestUrl);
            let endpointUrl = `${process.env.BASEURL}/${requestUrl}`;
            const response = yield web_services_1.default.rerouteVasRequest(headers, payload, endpointUrl);
            return response;
        });
    }
    processNotifications(headers, payload, requestUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const payloadObject = {
                "MTI": payload['MTI'],
                "amount": (parseInt(payload['amount']) / 100),
                "terminalId": payload['terminalId'],
                "responseCode": payload['responseCode'],
                "responseDescription": payload["responseDescription"],
                "PAN": payload["PAN"] || " ",
                "STAN": payload["STAN"] || " ",
                "authCode": payload["authCode"],
                "transactionTime": payload["transactionTime"],
                "reversal": false,
                "merchantId": payload["merchantId"],
                "merchantName": payload["merchantAddress"],
                "merchantAddress": payload["merchantAddress"],
                "rrn": payload["rrn"],
            };
            console.log("Request Payload :: ", payloadObject);
            const notificationResponse = yield web_services_1.default.sendNotificationRequest(headers, payloadObject, requestUrl);
            console.log(JSON.stringify("notificationResponse", notificationResponse));
            return notificationResponse;
        });
    }
    processTransaction(headers, payload, requestUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let endpointUrl = this.prepareVasEndpoint(requestUrl);
            let vasProduct = utils_1.default.getTransProduct(endpointUrl);
            if (!vasProduct)
                return { error: true, data: null };
            // console.log("vasProduct ::", vasProduct)
            // save initial record
            const dataForRequest = JSON.stringify(payload);
            const savedRecord = yield this.dbServices.createTransactionRecord(payload, vasProduct);
            console.log(":: savedRecord ::", savedRecord);
            if (savedRecord.saved) {
                const requestBody = JSON.parse(dataForRequest) || [];
                delete requestBody['vasData'];
                requestBody['transtype'] = vasProduct;
                const url = `${process.env.BASEURL}/transaction_posvas`;
                console.log("result : ", JSON.stringify(url));
                const response = yield web_services_1.default.rerouteVasRequest(headers, requestBody, url);
                // console.log("Response from intelifin :: ", response);
                if (response) {
                    const updateRecord = yield this.dbServices.updateTransactionRecord(response, endpointUrl);
                    if (updateRecord.saved) {
                        const payloadData = updateRecord.DbrecordInstance;
                        const notificationHeader = {
                            'Authorization': 'Bearer vBCP1CGReJAqY3IDZ2Rs64Eb1uJ5rIXTO7oZceIn',
                            terminalId: payloadData['terminalId']
                        };
                        try {
                            const notificationResponse = yield this.processNotifications(notificationHeader, payloadData, this.notifcationUrl);
                            console.log(JSON.stringify("response from notification", notificationResponse));
                            yield this.dbServices.updateTransactionStatus(true, JSON.stringify(notificationResponse));
                        }
                        catch (error) {
                            console.log(JSON.stringify("response error", error.message));
                            yield this.dbServices.updateTransactionStatus(false, JSON.stringify("error"));
                        }
                        return {
                            error: false, data: { response, updateRecord }
                        };
                    }
                }
                return { error: true, data: null };
            }
            else {
                return { error: true, data: null };
            }
        });
    }
    processReversalTransaction(headers, payload, requestUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let endpointUrl = this.prepareVasEndpoint(requestUrl);
            let vasProduct = utils_1.default.getTransProduct(endpointUrl);
            if (!vasProduct)
                return { error: true, data: null };
            console.log('requestUrl', requestUrl);
            // save initial record
            const dataForRequest = JSON.stringify(payload);
            const savedRecord = yield this.dbServices.createTransactionRecord(payload, vasProduct);
            // console.log(":: savedRecord ::", savedRecord);
            if (savedRecord.saved) {
                const requestBody = JSON.parse(dataForRequest) || [];
                requestBody['transtype'] = vasProduct;
                const url = `${process.env.BASEURL}/transaction`;
                // console.log("url intelifin :: ", url);
                const response = yield web_services_1.default.rerouteVasRequest(headers, requestBody, url);
                // console.log("Response from intelifin :: ", response);
                const updateRecord = yield this.dbServices.updateTransactionRecord(response, endpointUrl);
                if (updateRecord.saved) {
                    return { error: false, data: response };
                }
            }
            return { error: true, data: null };
        });
    }
    prepareVasEndpoint(requestUrl) {
        let urlPath = requestUrl.split("transaction")[1];
        return `${process.env.BASEURL}${urlPath}`;
    }
    prepareGeneralEndpoint(requestUrl) {
        console.log(":: -> ", requestUrl);
        let urlPath = requestUrl.split("intellifin")[0];
        console.log(":end : -> ", urlPath);
        return `${process.env.BASEURL}/${requestUrl}`;
    }
}
exports.default = new RoutingServices();
//# sourceMappingURL=routing.services.js.map