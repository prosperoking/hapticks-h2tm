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
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const https_1 = __importDefault(require("https"));
class ZoneApi {
    static get client() {
        var _a;
        const httpsAgent = new https_1.default.Agent({
            rejectUnauthorized: false,
        });
        return axios_1.default.create({
            baseURL: (_a = process.env.ZONE_BASE_URL) !== null && _a !== void 0 ? _a : "https://ofi.zonenetwork.com",
            httpsAgent
        });
    }
    postJournal(transaction, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const paylaod = {
                    Rrn: transaction.rrn,
                    Stan: transaction.STAN,
                    AcquirerBank: options.acqID,
                    Amount: transaction.amount,
                    AccountNumber: options.accno,
                    Pan: transaction.PAN,
                    TransactionStatus: transaction.responseCode === '00' ? "APPROVED" : "FAILED",
                    CurrencyCode: "566",
                    Comment: transaction.responseDescription,
                    TerminalId: transaction.terminalId,
                    Error: transaction.responseCode === '00' ? "" : transaction.responseDescription,
                    TransactionDate: (0, moment_1.default)(new Date(transaction.createdAt)).format("DD/MM/YYYY"),
                    TransactionTime: (0, moment_1.default)(new Date(transaction.createdAt)).format("hh:mm"),
                };
                const { data } = yield ZoneApi.client.post("/pushjournal/api/push-journal", paylaod, {
                    headers: {
                        "x-api-key": options.apiKey
                    }
                });
                return data.status;
            }
            catch (e) {
                console.log(e);
                const message = e.message;
                const response = e.isAxiosError ? e.response : null;
                console.log({
                    data: (_a = response === null || response === void 0 ? void 0 : response.data) !== null && _a !== void 0 ? _a : null,
                    status: (_b = response === null || response === void 0 ? void 0 : response.status) !== null && _b !== void 0 ? _b : null,
                    statusText: (_c = response === null || response === void 0 ? void 0 : response.statusText) !== null && _c !== void 0 ? _c : null,
                    responseHeaders: response ? JSON.parse(JSON.stringify(response === null || response === void 0 ? void 0 : response.headers)) : null,
                    message
                });
                return false;
            }
        });
    }
}
exports.default = new ZoneApi;
//# sourceMappingURL=zone.js.map