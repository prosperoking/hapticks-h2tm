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
const routing_services_1 = __importDefault(require("./routing.services"));
class VasServices {
    constructor() {
        this.dbServices = new db_services_1.default();
        this.notifcationUrl = process.env.NOTIFICATION_URL;
    }
    processLookup(headers, payload, requestUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let endpointUrl = this.prepareGeneralEndpoint(requestUrl);
            let vasLookupUrl = utils_1.default.getVasLookUp(endpointUrl, payload);
            let reguestUrl = `${process.env.BAXI_URL}${vasLookupUrl['url']}`;
            let requetMethod = vasLookupUrl['method'];
            console.log("baxi url ", JSON.stringify(vasLookupUrl));
            const headerRequest = {
                'x-api-key': `${process.env.BAXI_TOKEN}`
            };
            let response;
            try {
                response = yield web_services_1.default.lookupVasRequest(headerRequest, payload, reguestUrl, requetMethod);
            }
            catch (error) {
                console.log("response error : ", error === null || error === void 0 ? void 0 : error.data);
                response = error === null || error === void 0 ? void 0 : error.data.message;
            }
            return response;
        });
    }
    processTransaction(headers, payload, requestUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchaseUrl = 'transaction/purchase';
            let endpointUrl = this.prepareVasEndpoint(requestUrl);
            const dataForRequest = JSON.stringify(payload);
            const refrenceId = this.randomStr(20, '1234567890bvsfdabcde');
            let vasProduct = utils_1.default.getVasProduct(endpointUrl, JSON.parse(dataForRequest), refrenceId);
            if (!vasProduct)
                return { error: true, data: null };
            // save initial record
            // call purchase first for transaction flow
            let proccessPurchase;
            try {
                proccessPurchase = yield routing_services_1.default.processTransaction(headers, payload, purchaseUrl);
            }
            catch (error) {
                proccessPurchase = error;
            }
            console.log(":: proccessPurchase :: ", proccessPurchase);
            let purchaseresponse = proccessPurchase === null || proccessPurchase === void 0 ? void 0 : proccessPurchase.data.response;
            // proccess the vas transaction if purchase transaction is successful    
            if ((purchaseresponse === null || purchaseresponse === void 0 ? void 0 : purchaseresponse.responseCode) == '00') {
                const payloadData = JSON.parse(dataForRequest) || {};
                //mapper for url builder
                const vasUrl = `${process.env.BAXI_URL}${vasProduct['url']}`;
                let requestBody = {};
                const headerRequest = {
                    'x-api-key': `${process.env.BAXI_TOKEN}`
                };
                let vasResponse = {};
                try {
                    // console.log("vas URL :: ", vasUrl);
                    let response;
                    if (vasProduct.body) {
                        requestBody = vasProduct.body;
                    }
                    try {
                        response = yield web_services_1.default.rerouteVasRequest(headerRequest, requestBody, vasUrl);
                    }
                    catch (error) {
                        response = error.data;
                    }
                    console.log("vas response", response);
                    vasResponse = response;
                    if (vasResponse.status == "error" || vasResponse.status == "pending") {
                        // console.log("error found got here");
                        response["statusCode"] = "99";
                    }
                    return { error: false, data: { purchaseresponse, vasResponse } };
                }
                catch (error) {
                    console.log("Error from server :: ", error);
                    vasResponse = error === null || error === void 0 ? void 0 : error.data.errors;
                    error["statusCode"] = "99";
                    //implement reversal
                    //todo
                    return { error: true, data: { purchaseresponse, error } };
                }
            }
            else {
                return { error: true, data: { purchaseresponse } };
            }
        });
    }
    prepareVasEndpoint(requestUrl) {
        console.log("original Url :: ", requestUrl);
        let urlPath = requestUrl.split("vas");
        // console.log("urlPath :: ", urlPath);
        return `${process.env.BASEURL}${urlPath}`;
    }
    prepareGeneralEndpoint(requestUrl) {
        let urlPath = requestUrl.split("lookup/vas/");
        return urlPath;
    }
    randomStr(len, arr) {
        var ans = '';
        for (var i = len; i > 0; i--) {
            ans +=
                arr[Math.floor(Math.random() * arr.length)];
        }
        return ans;
    }
}
exports.default = new VasServices();
//# sourceMappingURL=vas.services.js.map