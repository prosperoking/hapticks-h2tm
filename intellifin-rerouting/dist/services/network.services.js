"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
class ApiClient {
    sendPostRequest(data = {}, headers, url) {
        console.log("endpoint =>", url);
        console.log("headers =>", headers);
        // console.log("data =>", data);
        return new Promise((resolve, reject) => {
            axios_1.default
                .post(url, data, {
                headers,
            })
                .then((response) => { resolve(response.data); })
                .catch((err) => {
                var _a;
                reject(err.response);
                console.log('error :: ', (_a = err.response) === null || _a === void 0 ? void 0 : _a.data);
            });
        });
    }
    sendGetRequest(headers, url) {
        return new Promise((resolve, reject) => {
            axios_1.default
                .get(url, {
                headers,
            })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err));
        });
    }
}
exports.ApiClient = ApiClient;
//# sourceMappingURL=network.services.js.map