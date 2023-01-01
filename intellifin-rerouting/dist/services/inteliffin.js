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
exports.InteliffinTransTypes = void 0;
const axios_1 = __importDefault(require("axios"));
exports.InteliffinTransTypes = Object.freeze({
    PURCHASE: "1",
    CASH_ADVANCE: "45",
    REFUND: "5",
    REVERSAL: "4",
    BALANCE: "7",
    PREAUTH: "33",
    SALES_COMPLETION: "34",
});
class Inteliffin {
    static create() {
        return new Inteliffin();
    }
    static get client() {
        const axios = axios_1.default.create({
            // baseURL: `http://${this.ip}:${this.port}/nibbs`,
            baseURL: `http://nibssepms.intellifin.com.ng/nibss`,
            timeout: 62000,
        });
        if (process.env.DEBUG_AXIOS) {
            axios.interceptors.request.use((request) => {
                console.log("Request: ", {
                    method: request.method,
                    url: `${request.baseURL}${request.url}`,
                    headers: request.headers,
                    data: request.data,
                });
                return request;
            });
            axios.interceptors.response.use((response) => {
                console.log("Response:", {
                    status: response.status,
                    headers: response.headers,
                    data: response.data,
                    statusText: response.statusText,
                });
                return response;
            });
        }
        return axios;
    }
    static getPrepInfo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Inteliffin.client.post("/api/prep_posvas", options);
            return result.data;
        });
    }
    static performTranaction(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Inteliffin.client.post("/api/transaction_posvas", payload);
            return result.data;
        });
    }
}
exports.default = Inteliffin;
//# sourceMappingURL=inteliffin.js.map