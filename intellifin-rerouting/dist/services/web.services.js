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
Object.defineProperty(exports, "__esModule", { value: true });
const network_services_1 = require("./network.services");
class WebServices {
    constructor() {
        this._apiClient = new network_services_1.ApiClient();
        this.httpHeaders = {
            "Content-Type": 'application/json'
        };
    }
    rerouteVasRequest(headers, payload, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            this.httpHeaders = Object.assign(Object.assign({}, this.httpHeaders), headers);
            const response = yield this._apiClient.sendPostRequest(payload, headers, endpoint);
            return response;
        });
    }
    lookupVasRequest(headers, payload, endpoint, requestMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            this.httpHeaders = Object.assign(Object.assign({}, this.httpHeaders), headers);
            let response;
            if (requestMethod.toUpperCase() == 'GET') {
                response = yield this._apiClient.sendGetRequest(headers, endpoint);
            }
            else {
                response = yield this._apiClient.sendPostRequest(payload, headers, endpoint);
            }
            return response;
        });
    }
    rerouteVasRequestGet(headers, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            this.httpHeaders = Object.assign(Object.assign({}, this.httpHeaders), headers);
            const response = yield this._apiClient.sendGetRequest(headers, endpoint);
            return response;
        });
    }
    sendNotificationRequest(headers, payload, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            this.httpHeaders = Object.assign(Object.assign({}, this.httpHeaders), headers);
            // console.log('final endpoint:: ',endpoint );
            const response = yield this._apiClient.sendPostRequest(payload, headers, endpoint);
            console.log("response :: Log->", response);
            return response;
        });
    }
}
exports.default = new WebServices();
//# sourceMappingURL=web.services.js.map