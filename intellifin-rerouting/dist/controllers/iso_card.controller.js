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
                const result = yield (0, cardsockethelper_1.performCardSocketTranaction)(cardsockethelper_1.TransactionTypes.KEY_EXCHANGE, {
                    tid: terminal.terminalId,
                    component: componentKey1,
                    ip: isoHost,
                    ssl: String(isSSL),
                    port: isoPort
                });
                console.log("result: ", result);
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
                console.log(error);
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
                const brand = request.header('x-brand') || null;
                const deviceModel = request.header('x-device-model') || null;
                const appVersion = request.header('x-app-version') || null;
                const terminal = yield terminal_model_1.default.findOne({ serialNo: serial }).populate({ path: 'profile', select: "title isoHost isoPort isSSL" });
                if (!terminal)
                    return response.status(404).json({ message: "Terminal not found" });
                terminal.brand = brand;
                terminal.appVersion = appVersion;
                terminal.deviceModel = deviceModel;
                terminal.save();
                return response.json(terminal);
            }
            catch (error) {
                console.log("Error: %s", error.message);
                return response.status(400).json({ message: "An error Occured" });
            }
        });
    }
    processCard(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serial = request.header('x-serial-no');
                const brand = request.header('x-brand');
                const appVersion = request.header('x-app-version');
                const terminal = yield terminal_model_1.default.findOne({ serialNo: serial })
                    .populate({ path: 'profile', });
                const { body } = request;
                if (!terminal || terminal.terminalId !== body.tid)
                    return response.status(404).json({ message: "Terminal not found/ Provisioned" });
                const { componentKey1, isoHost, isoPort, isSSL } = terminal.profile;
                const messageType = IsoCardContoller.getMessageType(terminal, Number(body.field4));
                const patchedPayload = messageType === cardsockethelper_1.TransactionTypes.ISW_KIMONO ? IsoCardContoller.patchISWPayload(body, terminal.profile, terminal) : body;
                const socketResponse = yield (0, cardsockethelper_1.performCardSocketTranaction)(messageType, Object.assign(Object.assign({}, patchedPayload), { tid: terminal.terminalId, component: componentKey1, ip: isoHost, ssl: String(isSSL), port: isoPort }));
                console.log("result: ", socketResponse);
                const { data } = socketResponse;
                console.log(data);
                const responseData = data.data || data;
                const journalPayload = messageType === cardsockethelper_1.TransactionTypes.ISO_TRANSACTION ? IsoCardContoller.createNIBBSJournal(responseData, body) : IsoCardContoller.createISWJournal(responseData, body, terminal);
                vasjournals_model_1.default.create(journalPayload).catch(err => {
                    console.error("Error: %s \r\n Unable to save transaction: %s", err.message, JSON.stringify(journalPayload));
                });
                return response.json(Object.assign(Object.assign({}, socketResponse.data), Object.assign({}, ((_a = socketResponse.data) === null || _a === void 0 ? void 0 : _a.data) || {})));
            }
            catch (error) {
                console.log("Error: %s", error);
                return response.status(400).json({ message: "An error Occured" });
            }
        });
    }
    static patchISWPayload(data, profile, terminal) {
        return Object.assign(Object.assign({}, data), { destInstitutionCode: profile.iswInstitutionCode, destAccountNumber: profile.iswDestinationAccount, merchantLocation: (terminal === null || terminal === void 0 ? void 0 : terminal.parsedParams.merchantNameLocation) || "HAPTICKSDATA LTD LA LANG", tid: terminal.iswTid, mid: profile.iswMid, uniqueId: terminal.iswUniqueId, amount: data.field4 || data.amount || 0, totalamount: data.field4 || data.amount || 0 });
    }
    static getMessageType(terminal, amount) {
        var _a;
        if (!((_a = terminal === null || terminal === void 0 ? void 0 : terminal.profile) === null || _a === void 0 ? void 0 : _a.iswSwitchAmount))
            return cardsockethelper_1.TransactionTypes.ISO_TRANSACTION;
        return (amount / 100) >= (terminal === null || terminal === void 0 ? void 0 : terminal.profile.iswSwitchAmount) ?
            cardsockethelper_1.TransactionTypes.ISW_KIMONO :
            cardsockethelper_1.TransactionTypes.ISO_TRANSACTION;
    }
    static createNIBBSJournal(response, payload) {
        return {
            PAN: utils_1.default.getMaskPan(payload.field2),
            rrn: payload.field37,
            amount: Number.parseFloat(payload.field4),
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
    static createISWJournal(response, payload, terminal) {
        return {
            PAN: utils_1.default.getMaskPan(payload.pan),
            rrn: payload.rrn,
            amount: Number.parseFloat(payload.field4),
            STAN: payload.stan,
            cardExpiration: payload.expirydate,
            terminalId: terminal.iswTid,
            merchantId: terminal.iswUniqueId,
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