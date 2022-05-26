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
const terminal_model_1 = __importDefault(require("../db/models/terminal.model"));
const logger_1 = __importDefault(require("../helpers/logger"));
const cardsockethelper_1 = require("../helpers/cardsockethelper");
const types_1 = require("../@types/types");
const vasjournals_model_1 = __importDefault(require("../db/models/vasjournals.model"));
const utils_1 = __importDefault(require("../helpers/utils"));
class IsoCardContoller {
    performKeyExchange(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const terminal = yield terminal_model_1.default.findOne({
                    serialNo: request.header('x-serial-no'),
                }).populate({
                    path: "profile"
                });
                if (!terminal) {
                    return response.status(400).json({
                        status: false,
                        message: "Unknown terminal"
                    });
                }
                const { componentKey1, isoHost, isoPort, isSSL } = terminal.profile;
                const result = yield cardsockethelper_1.performCardSocketTranaction(cardsockethelper_1.TransactionTypes.KEY_EXCHANGE, {
                    tid: terminal.terminalId,
                    component: componentKey1,
                    ip: isoHost,
                    ssl: String(isSSL),
                    port: isoPort
                });
                if (!result.status) {
                    return response.status(400).json(result);
                }
                const { data } = result;
                terminal.encmasterkey = data.encmasterkey;
                terminal.encpinkey = data.encpinkey;
                terminal.encsesskey = data.encsesskey;
                terminal.clrmasterkey = data.clrmasterkey;
                terminal.clrsesskey = data.clrmasterkey;
                terminal.clrpinkey = data.clrpinkey;
                terminal.paramdownload = data.paramdownload;
                yield terminal.save();
                return response.json(data);
            }
            catch (error) {
                logger_1.default.log(error);
                return response.status(400).json({
                    status: false,
                    message: "An error occurred"
                });
            }
        });
    }
    getTerminalInfo(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serial = request.header('x-serial-no');
                const brand = request.header('x-brand');
                const appVersion = request.header('x-app-version');
                const terminal = yield terminal_model_1.default.findOne({ serialNo: serial }).populate('profile');
                if (!terminal)
                    return response.status(404).json({ message: "Terminal not found" });
                terminal.brand = brand;
                terminal.appVersion = appVersion;
                terminal.save();
                return response.json(terminal);
            }
            catch (error) {
            }
        });
    }
    processCard(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serial = request.header('x-serial-no');
                const brand = request.header('x-brand');
                const appVersion = request.header('x-app-version');
                const terminal = yield terminal_model_1.default.findOne({ serialNo: serial }).populate('profile');
                const { body } = request;
                if (!terminal || terminal.terminalId !== body.tid)
                    return response.status(404).json({ message: "Terminal not found/ Provisioned" });
                const messageType = body.transaction === cardsockethelper_1.TransactionTypes.ISO_TRANSACTION ? cardsockethelper_1.TransactionTypes.ISO_TRANSACTION : cardsockethelper_1.TransactionTypes.ISW_KIMONO;
                const socketResponse = yield cardsockethelper_1.performCardSocketTranaction(messageType, body);
                const { data } = socketResponse;
                const journalPayload = messageType === cardsockethelper_1.TransactionTypes.ISO_TRANSACTION ? this.createNIBBSJournal(data, body) : this.createISWJournal(data, body, terminal);
                vasjournals_model_1.default.create(journalPayload).catch(err => {
                    console.error("Error: %s \r\n Unable to save transaction: %s", err.message, JSON.stringify(journalPayload));
                });
                return response.json(socketResponse.data);
            }
            catch (error) {
            }
        });
    }
    createNIBBSJournal(response, payload) {
        return {
            PAN: utils_1.default.getMaskPan(payload.field2),
            rrn: payload.field37,
            amount: Number.parseFloat(payload.amount),
            STAN: payload.field11,
            cardExpiration: payload.field14,
            terminalId: payload.field41,
            merchantId: payload.field42,
            responseCode: response.resp,
            responseDescription: response.meaning,
            authCode: response.auth,
            merchantAddress: payload.field43,
            merchantName: payload.field43,
            product: "CASHOUT",
            transactionTime: (new Date).toUTCString(),
            handlerResponseTime: (new Date).toUTCString(),
            isCompleted: true,
        };
    }
    createISWJournal(response, payload, terminal) {
        return {
            PAN: utils_1.default.getMaskPan(payload.pan),
            rrn: payload.rrn,
            amount: Number.parseFloat(payload.totalamount),
            STAN: payload.stan,
            cardExpiration: payload.expirydate,
            terminalId: payload.tid,
            merchantId: payload.mid,
            responseCode: response.resp,
            responseDescription: response.meaning,
            authCode: response.auth,
            merchantName: terminal.parsedParams.merchantNameLocation,
            merchantCategoryCode: terminal === null || terminal === void 0 ? void 0 : terminal.parsedParams.mechantCategoryCode,
            product: "CASHOUT",
            transactionTime: (new Date).toUTCString(),
            handlerResponseTime: (new Date).toUTCString(),
            isCompleted: true,
            processor: types_1.Processor.KIMONO,
        };
    }
}
exports.default = IsoCardContoller;
//# sourceMappingURL=iso_card.controller.js.map