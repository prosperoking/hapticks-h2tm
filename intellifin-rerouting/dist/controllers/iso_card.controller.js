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
const transaction_model_1 = __importDefault(require("../db/models/transaction.model"));
const utils_1 = __importDefault(require("../helpers/utils"));
const queue_1 = require("../queue/queue");
const inteliffin_1 = __importDefault(require("../services/inteliffin"));
const inteliffin_2 = require("../services/inteliffin");
const cardTransactionLog_model_1 = __importDefault(require("../db/models/cardTransactionLog.model"));
class IsoCardContoller {
    performKeyExchange(request, response) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appVersion = request.header("x-app-version");
                const terminal = yield terminal_model_1.default.findOne({
                    serialNo: request.header("x-serial-no"),
                    deviceModel: ((_a = request.header("x-device-model")) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || null,
                    brand: ((_b = request.header("x-brand")) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || null,
                }).populate({
                    path: "profile",
                });
                if (!terminal) {
                    return response.status(400).json({
                        status: false,
                        message: "Unknown terminal",
                    });
                }
                terminal.appVersion = appVersion; // update app version
                const { componentKey1, isoHost, isoPort, isSSL, type, hasthreelineSupport } = terminal.profile;
                if (hasthreelineSupport && ((_c = terminal.threeLineTid) === null || _c === void 0 ? void 0 : _c.length)) {
                    (0, cardsockethelper_1.performCardSocketTranaction)(cardsockethelper_1.TransactionTypes.THREELINE_KEY_EXCHANGE, {
                        tid: terminal.threeLineTid,
                        component: terminal.profile.threeLineKey,
                        ip: terminal.profile.threeLineHost,
                        ssl: String(terminal.profile.threeLineHostSSL),
                        port: terminal.profile.threeLinePort,
                    }).then((threeResult) => {
                        if (threeResult.status) {
                            terminal.threeLineParams = threeResult.data;
                            terminal.save();
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }
                if (type === "intelliffin")
                    return IsoCardContoller.handleIntelifinKeyExchange(terminal, response);
                const result = yield (0, cardsockethelper_1.performCardSocketTranaction)(cardsockethelper_1.TransactionTypes.KEY_EXCHANGE, {
                    tid: terminal.terminalId,
                    component: componentKey1,
                    ip: isoHost,
                    ssl: String(isSSL),
                    port: isoPort,
                });
                if (!result.status) {
                    return response.status(400).json(result);
                }
                const { data } = result;
                terminal.encmasterkey = data.encmasterkey;
                terminal.encpinkey = data.encpinkey;
                terminal.encsesskey = data.encsesskey;
                terminal.clrmasterkey = data.clrmasterkey;
                terminal.clrsesskey = data.clrsesskey;
                terminal.clrpinkey = data.clrpinkey;
                terminal.paramdownload = data.paramdownload;
                yield terminal.save();
                return response.json(data);
            }
            catch (error) {
                console.log(error);
                return response.status(400).json({
                    status: false,
                    message: "An error occurred",
                });
            }
        });
    }
    static handleIntelifinKeyExchange(terminal, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { isoHost, isoPort, isSSL } = terminal.profile;
            try {
                const data = yield inteliffin_1.default.getPrepInfo({
                    terminalid: terminal.terminalId,
                    serialno: terminal.serialNo,
                });
                if (data.response !== "00") {
                    return response.status(400).json({
                        status: false,
                        message: "Unable to Perform Key Exchange",
                    });
                }
                const { pin_key, callhome, country_code, currency_code, datetime, merchant_address, merchant_category_code, merchantid, timeout, terminalid, } = data;
                const padLeadingZeros = (num) => num.toString().padStart(2, "0");
                terminal.encmasterkey = pin_key;
                terminal.encpinkey = data.pin_key;
                terminal.encsesskey = data.pin_key;
                terminal.clrmasterkey = data.pin_key;
                terminal.clrsesskey = data.pin_key;
                terminal.clrpinkey = data.pin_key;
                terminal.paramdownload = [
                    ["020", padLeadingZeros(datetime.length), datetime],
                    ["030", padLeadingZeros(merchantid.length), merchantid],
                    ["040", padLeadingZeros(timeout.length), timeout],
                    ["050", padLeadingZeros(currency_code.length), currency_code],
                    ["060", padLeadingZeros(country_code.length), country_code],
                    ["070", padLeadingZeros(callhome.length), callhome],
                    [
                        "080",
                        padLeadingZeros(merchant_category_code.length),
                        merchant_category_code,
                    ],
                    ["520", padLeadingZeros(merchant_address.length), merchant_address],
                ]
                    .map((a) => a.join(""))
                    .join("");
                yield terminal.save();
                return response.json({
                    encpinkey: pin_key,
                    encsesskey: pin_key,
                    clrpinkey: pin_key,
                    clrsesskey: pin_key,
                    encmasterkey: pin_key,
                    paramdownload: terminal.paramdownload,
                    tid: terminal.terminalId,
                    clrmasterkey: pin_key,
                });
            }
            catch (error) {
                if (error.isAxiosError) {
                    return response.status(400).json({
                        status: false,
                        message: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data.message,
                    });
                }
                return response.status(400).json({
                    status: false,
                    message: "An error occurred",
                });
            }
        });
    }
    getTerminalInfo(request, response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serial = request.header("x-serial-no");
                const brand = request.header("x-brand") || "";
                const deviceModel = request.header("x-device-model") || "";
                const appVersion = request.header("x-app-version") || null;
                const terminal = yield terminal_model_1.default.findOne({
                    serialNo: serial,
                    deviceModel: ((_a = request.header("x-device-model")) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || null,
                    brand: ((_b = request.header("x-brand")) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || null,
                }).populate({ path: "profile", select: "title isoHost isoPort isSSL" });
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
                const serial = request.header("x-serial-no");
                const brand = request.header("x-brand");
                const deviceModel = request.header("x-device-model") || "";
                const appVersion = request.header("x-app-version");
                const terminal = yield terminal_model_1.default.findOne({
                    serialNo: serial,
                    deviceModel: (deviceModel === null || deviceModel === void 0 ? void 0 : deviceModel.toUpperCase()) || null,
                    brand: (brand === null || brand === void 0 ? void 0 : brand.toUpperCase()) || null,
                }).populate({ path: "profile" });
                const { body } = request;
                let processor = String(body.processor).toUpperCase();
                processor = processor === "NIBSS" ? "ISO" : processor;
                if (!terminal || terminal.terminalId !== body.tid)
                    return response
                        .status(404)
                        .json({ message: "Terminal not found/ Provisioned" });
                const { componentKey1, isoHost, isoPort, isSSL, type } = terminal.profile;
                const transLog = yield cardTransactionLog_model_1.default.create({
                    tid: terminal.terminalId,
                    amount: body.field4,
                    maskedPan: utils_1.default.getMaskPan(body.field2),
                    rrn: body.field37,
                    stan: body.field11,
                });
                const messageType = terminal.profile.allowProcessorOverride &&
                    ["KIMONO", "NIBSS", "BLUESALT", "ISO", "3LINE"].includes(processor)
                    ? processor
                    : IsoCardContoller.getMessageType(terminal, Number(body.field4));
                const patchedPayload = IsoCardContoller.getPayload(messageType, body, terminal);
                const socketResponse = messageType === cardsockethelper_1.TransactionTypes.ISO_TRANSACTION &&
                    terminal.profile.isInteliffin
                    ? yield IsoCardContoller.hanldeIntellifin(messageType, patchedPayload, terminal)
                    : yield (0, cardsockethelper_1.performCardSocketTranaction)(messageType, patchedPayload);
                const { data } = socketResponse;
                const responseData = data.data || data;
                const journalPayload = IsoCardContoller.resolveJournal(messageType, type, body, responseData, patchedPayload, terminal);
                terminal.appVersion = appVersion;
                terminal.save();
                transaction_model_1.default
                    .create(Object.assign(Object.assign({}, journalPayload), { organisationId: terminal.organisationId }))
                    .then((data) => {
                    transLog.journalId = data._id;
                    transLog.save();
                    return IsoCardContoller.processWebHook(data, terminal);
                })
                    .catch((err) => {
                    console.error("Error: %s \r\n Unable to save transaction: %s", err.message, JSON.stringify(journalPayload));
                });
                return response.json(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, socketResponse), Object.assign(Object.assign({}, (((_a = socketResponse.data) === null || _a === void 0 ? void 0 : _a.data) || {})), { processor: journalPayload.processor })), { data: responseData }), responseData), { processor: journalPayload.processor }));
            }
            catch (error) {
                console.log("Error: %s", error);
                return response
                    .status(400)
                    .json({ status: false, data: null, message: "An error Occured" });
            }
        });
    }
    static resolveJournal(messageType, type, body, responseData, patchedPayload, terminal) {
        switch (messageType) {
            case cardsockethelper_1.TransactionTypes.ISO_TRANSACTION:
                return IsoCardContoller.createNIBBSJournal(responseData, patchedPayload, IsoCardContoller.getISOProcessor(type));
            case cardsockethelper_1.TransactionTypes.BLUESALT:
                return IsoCardContoller.createNIBBSJournal(responseData, patchedPayload, cardsockethelper_1.TransactionTypes.BLUESALT);
            case cardsockethelper_1.TransactionTypes.THREELINE:
                return IsoCardContoller.createNIBBSJournal(responseData, patchedPayload, cardsockethelper_1.TransactionTypes.THREELINE);
            case cardsockethelper_1.TransactionTypes.ISW_KIMONO:
                return IsoCardContoller.createISWJournal(responseData, body, terminal, IsoCardContoller.getISOProcessor(type));
            default:
                return IsoCardContoller.createNIBBSJournal(responseData, patchedPayload, IsoCardContoller.getISOProcessor(type));
        }
    }
    static getPayload(messageType, body, terminal) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const { componentKey1, isoHost, isoPort, isSSL, type, blueSaltTID, blueSaltKey, } = terminal.profile;
        switch (messageType) {
            case cardsockethelper_1.TransactionTypes.ISO_TRANSACTION:
                return Object.assign(Object.assign({}, body), { component: componentKey1, ip: isoHost, ssl: String(isSSL), iso_flavour: type, port: isoPort, clrsesskey: terminal.clrsesskey, clrpin: terminal.clrpinkey, field43: (_a = terminal.parsedParams) === null || _a === void 0 ? void 0 : _a.merchantNameLocation, field42: (_b = terminal.parsedParams) === null || _b === void 0 ? void 0 : _b.mid });
            case cardsockethelper_1.TransactionTypes.THREELINE:
                return Object.assign(Object.assign({}, body), { component: (_c = terminal.profile) === null || _c === void 0 ? void 0 : _c.threeLineKey, ip: (_d = terminal.profile) === null || _d === void 0 ? void 0 : _d.threeLineHost, ssl: String((_e = terminal.profile) === null || _e === void 0 ? void 0 : _e.threeLineHostSSL), iso_flavour: type, port: (_f = terminal.profile) === null || _f === void 0 ? void 0 : _f.threeLinePort, clrsesskey: terminal.clrsesskey, clrpin: terminal.clrpinkey, field41: terminal.threeLineTid, field43: (_g = terminal.threeLineParsedParams) === null || _g === void 0 ? void 0 : _g.merchantNameLocation, field42: (_h = terminal.threeLineParsedParams) === null || _h === void 0 ? void 0 : _h.mid, threeLineclrPinKey: terminal.threeLineParams.clrPinKey });
            case cardsockethelper_1.TransactionTypes.ISW_KIMONO:
                return IsoCardContoller.patchISWPayload(body, terminal.profile, terminal);
            case cardsockethelper_1.TransactionTypes.BLUESALT:
                return Object.assign(Object.assign({}, IsoCardContoller.patchISWPayload(body, terminal.profile, terminal)), { serial: terminal.serialNo, blueSaltTid: blueSaltTID, blueSaltKey: blueSaltKey, model: terminal.deviceModel, device: terminal.deviceModel });
            default:
                throw new Error("Invalid Message Type");
        }
    }
    static getISOProcessor(key) {
        return !["generic", "intelliffin", "bluesalt", '3line'].includes(key)
            ? key
            : undefined;
    }
    checkBalance(request, response) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serial = request.header("x-serial-no");
                const brand = request.header("x-brand");
                const deviceModel = request.header("x-device-model") || "";
                const appVersion = request.header("x-app-version");
                const terminal = yield terminal_model_1.default.findOne({
                    serialNo: serial,
                    deviceModel: (deviceModel === null || deviceModel === void 0 ? void 0 : deviceModel.toUpperCase()) || null,
                    brand: (brand === null || brand === void 0 ? void 0 : brand.toUpperCase()) || null,
                }).populate({ path: "profile" });
                const { body } = request;
                let processor = String(body.processor).toUpperCase();
                processor = processor === "NIBSS" ? "ISO" : processor;
                console.log("Processor: %s => %s", terminal.terminalId, body.tid);
                if (!terminal || terminal.terminalId !== body.tid)
                    return response
                        .status(404)
                        .json({ message: "Terminal not found/ Provisioned" });
                const { componentKey1, isoHost, isoPort, isSSL, type } = terminal.profile;
                const patchedPayload = Object.assign(Object.assign({}, body), { component: componentKey1, ip: isoHost, ssl: String(isSSL), port: isoPort, clrsesskey: terminal.clrsesskey, clrpin: terminal.clrpinkey, field0: "0100", field3: "31" + body.field3.substring(2), field43: (_a = terminal.parsedParams) === null || _a === void 0 ? void 0 : _a.merchantNameLocation, field42: (_b = terminal.parsedParams) === null || _b === void 0 ? void 0 : _b.mid });
                const socketResponse = terminal.profile.isInteliffin
                    ? yield IsoCardContoller.hanldeIntellifin(cardsockethelper_1.TransactionTypes.BALACE_CHECK, patchedPayload, terminal, 7)
                    : yield (0, cardsockethelper_1.performCardSocketTranaction)(cardsockethelper_1.TransactionTypes.BALACE_CHECK, patchedPayload);
                const { data } = socketResponse;
                const responseData = data.data || data;
                terminal.appVersion = appVersion;
                terminal.save();
                return response.json(Object.assign(Object.assign(Object.assign(Object.assign({}, socketResponse), Object.assign({}, (((_c = socketResponse.data) === null || _c === void 0 ? void 0 : _c.data) || {}))), { data: responseData }), responseData));
            }
            catch (error) {
                console.log("Error: %s", error);
                return response
                    .status(400)
                    .json({ status: false, data: null, message: "An error Occured" });
            }
        });
    }
    static hanldeIntellifin(type, payload, terminal, transType = null) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield inteliffin_1.default.performTranaction({
                    amount: payload.field4,
                    pinblock: payload.field52,
                    terminalid: payload.tid,
                    merchantid: payload.field42,
                    cashback: "0",
                    merchant_address: (_a = terminal.parsedParams) === null || _a === void 0 ? void 0 : _a.merchantNameLocation,
                    transtype: (_b = transType === null || transType === void 0 ? void 0 : transType.toString()) !== null && _b !== void 0 ? _b : (type === cardsockethelper_1.TransactionTypes.ISO_TRANSACTION
                        ? inteliffin_2.InteliffinTransTypes.PURCHASE
                        : inteliffin_2.InteliffinTransTypes.PURCHASE),
                    stan: payload.field11,
                    iccdata: payload.field55,
                    track2: payload.field35,
                    rrn: payload.field37,
                    panseqno: payload.panseqno,
                    merchant_category_code: (_c = terminal.parsedParams) === null || _c === void 0 ? void 0 : _c.mechantCategoryCode,
                    currency_code: (_d = terminal.parsedParams) === null || _d === void 0 ? void 0 : _d.currencyCode,
                });
                return {
                    status: data.response === "00",
                    message: data.description,
                    data: {
                        resp: data.response,
                        auth: data.authid,
                        meaning: data.description,
                        icc: data.iccresponse,
                        stan: data.stan,
                        rrn: data.rrn,
                        balance: data.balance,
                    },
                };
            }
            catch (error) {
                console.error(error.message, error);
                return {
                    status: false,
                    message: error.message,
                    data: {
                        resp: "06",
                        auth: null,
                        meaning: "An error occurred",
                        icc: null,
                    },
                };
            }
        });
    }
    static handleOtherTransaction(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, cardsockethelper_1.performCardSocketTranaction)(type, payload);
        });
    }
    static patchISWPayload(data, profile, terminal) {
        var _a;
        return Object.assign(Object.assign({}, data), { destInstitutionCode: profile.iswInstitutionCode, destAccountNumber: profile.iswDestinationAccount, merchantLocation: (terminal === null || terminal === void 0 ? void 0 : terminal.parsedParams.merchantNameLocation) ||
                "HAPTICKSDATA LTD LA LANG", tid: terminal.iswTid, mid: profile.iswMid, field43: ((_a = terminal.parsedParams) === null || _a === void 0 ? void 0 : _a.merchantNameLocation) || data.field43, uniqueId: terminal.iswUniqueId, amount: data.field4 || data.amount || 0, totalamount: data.field4 || data.amount || 0, clrsesskey: terminal.clrsesskey, clrpin: terminal.clrpinkey, pinblock: data.pinblock || "" });
    }
    static getMessageType(terminal, amount) {
        var _a, _b;
        const profile = terminal === null || terminal === void 0 ? void 0 : terminal.profile;
        if (!((_a = terminal === null || terminal === void 0 ? void 0 : terminal.profile) === null || _a === void 0 ? void 0 : _a.iswSwitchAmount) && !profile.processorSettings)
            return cardsockethelper_1.TransactionTypes.ISO_TRANSACTION;
        if (!profile.processorSettings)
            return amount / 100 >= (terminal === null || terminal === void 0 ? void 0 : terminal.profile.iswSwitchAmount)
                ? cardsockethelper_1.TransactionTypes.ISW_KIMONO
                : cardsockethelper_1.TransactionTypes.ISO_TRANSACTION;
        const type = (_b = profile.processorSettings.find((band) => amount / 100 >= band.minAmount && amount / 100 <= band.maxAmount)) === null || _b === void 0 ? void 0 : _b.processor;
        switch (type) {
            case "nibss":
                return cardsockethelper_1.TransactionTypes.ISO_TRANSACTION;
            case "kimono":
                return cardsockethelper_1.TransactionTypes.ISW_KIMONO;
            case "3line":
                return cardsockethelper_1.TransactionTypes.THREELINE;
            case "bluesalt":
                return cardsockethelper_1.TransactionTypes.BLUESALT;
            default:
                return cardsockethelper_1.TransactionTypes.ISO_TRANSACTION;
        }
    }
    static createNIBBSJournal(response, payload, processor) {
        return {
            PAN: utils_1.default.getMaskPan(payload.field2),
            rrn: ((response === null || response === void 0 ? void 0 : response.meta) || {})["rrn"] || response.rrn || payload.field37,
            amount: Number.parseFloat(payload.field4),
            STAN: response.stan || payload.field11,
            cardExpiration: payload.field14,
            terminalId: payload.field41,
            merchantId: payload.field42,
            responseCode: response.resp,
            responseDescription: response.meaning,
            authCode: response.auth,
            merchantAddress: payload.field43,
            merchantName: payload.field43,
            product: "CASHOUT",
            transactionTime: new Date().toUTCString(),
            handlerResponseTime: new Date().toUTCString(),
            isCompleted: true,
            processor: processor !== null && processor !== void 0 ? processor : types_1.Processor.NIBSS,
            meta: response.meta,
        };
    }
    static create3LineJournal(response, payload, processor) {
        return {
            PAN: utils_1.default.getMaskPan(payload.field2),
            rrn: ((response === null || response === void 0 ? void 0 : response.meta) || {})["rrn"] || response.rrn || payload.field37,
            amount: Number.parseFloat(payload.field4),
            STAN: response.stan || payload.field11,
            cardExpiration: payload.field14,
            terminalId: payload.field41,
            merchantId: payload.field42,
            responseCode: response.resp,
            responseDescription: response.meaning,
            authCode: response.auth,
            merchantAddress: payload.field43,
            merchantName: payload.field43,
            product: "CASHOUT",
            transactionTime: new Date().toUTCString(),
            handlerResponseTime: new Date().toUTCString(),
            isCompleted: true,
            processor: types_1.Processor.THREELINE,
            meta: response.meta,
        };
    }
    static createISWJournal(response, payload, terminal, processor) {
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
            transactionTime: new Date().toUTCString(),
            handlerResponseTime: new Date().toUTCString(),
            isCompleted: true,
            processor: processor !== null && processor !== void 0 ? processor : types_1.Processor.KIMONO,
        };
    }
    static processWebHook(transaction, terminal) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!terminal.profile.webhookId)
                return;
            queue_1.webhookQueue.add("sendNotification", {
                tranactionId: transaction._id,
                webhookId: terminal.profile.webhookId,
                organisationId: terminal.organisationId,
            });
        });
    }
}
exports.default = IsoCardContoller;
//# sourceMappingURL=iso_card.controller.js.map