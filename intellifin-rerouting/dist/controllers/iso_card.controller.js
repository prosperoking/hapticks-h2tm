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
const transaction_model_1 = __importDefault(require("../db/models/transaction.model"));
const utils_1 = __importDefault(require("../helpers/utils"));
const queue_1 = require("../queue/queue");
const inteliffin_1 = __importDefault(require("../services/inteliffin"));
const inteliffin_2 = require("../services/inteliffin");
const cardTransactionLog_model_1 = __importDefault(require("../db/models/cardTransactionLog.model"));
const appUtils_1 = require("../helpers/appUtils");
const moment_1 = __importDefault(require("moment"));
const cardBins_1 = require("../helpers/cardBins");
const webhook_model_1 = __importDefault(require("../db/models/webhook.model"));
class IsoCardContoller {
    performKeyExchange(request, response) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appVersion = request.header("x-app-version");
                const terminal = yield terminal_model_1.default.findOne({
                    serialNo: request.header("x-serial-no"),
                    deviceModel: ((_a = request.header("x-device-model")) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || null,
                    brand: ((_b = request.header("x-brand")) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || null,
                })
                    .populate({
                    path: "profile",
                })
                    .populate("groupTid");
                if (!terminal) {
                    return response.status(400).json({
                        status: false,
                        message: "Unknown terminal",
                    });
                }
                terminal.appVersion = appVersion; // update app version
                const padLeadingZeros = (num) => num.toString().padStart(2, "0");
                const { componentKey1, isoHost, isoPort, isSSL, type, hasthreelineSupport, } = terminal.profile;
                let threeResult;
                if (hasthreelineSupport && ((_c = terminal.threeLineTid) === null || _c === void 0 ? void 0 : _c.length)) {
                    threeResult = yield (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_1.TransactionTypes.THREELINE_KEY_EXCHANGE, {
                        tid: terminal.threeLineTid,
                        component: terminal.profile.threeLineKey,
                        ip: terminal.profile.threeLineHost,
                        ssl: String(terminal.profile.threeLineHostSSL),
                        port: terminal.profile.threeLinePort,
                    });
                    if (threeResult.status) {
                        terminal.threeLineParams = threeResult.data;
                        yield terminal.save();
                    }
                }
                if (terminal.usingGroupedTid) {
                    const { encmasterkey, encpinkey, encsesskey, clrmasterkey, clrsesskey, clrpinkey, paramdownload, parsedParams, terminalId, } = terminal.groupTid;
                    return response.json({
                        encmasterkey,
                        encpinkey,
                        encsesskey,
                        clrmasterkey,
                        clrsesskey,
                        clrpinkey,
                        paramdownload,
                        parsedParams,
                        tid: terminalId,
                        terminalId,
                        customerAddress: terminal.customerAddress,
                        iswISOTID: terminal.iswISOTID,
                        hydrogenTID: terminal.hydrogenTID,
                        profileId: (_d = terminal.profile) === null || _d === void 0 ? void 0 : _d._id,
                        iswTid: terminal.iswTid,
                        threeLineTid: terminal.threeLineTid,
                        kimonoTid: terminal.iswTid,
                        organisationId: (_e = terminal.organisation) === null || _e === void 0 ? void 0 : _e._id,
                    });
                }
                const newKey = (0, appUtils_1.generateTDESKey)();
                terminal.encmasterkey = newKey;
                terminal.encpinkey = newKey;
                terminal.encsesskey = newKey;
                terminal.clrmasterkey = newKey;
                terminal.clrsesskey = newKey;
                terminal.clrpinkey = newKey;
                if (!((_f = terminal.terminalId) === null || _f === void 0 ? void 0 : _f.length)) {
                    const datetime = (0, moment_1.default)().format('YYYYMMDDHHmmss');
                    const merchantid = "2302BAXXXXXX9611";
                    const timeout = "60";
                    const currency_code = "566";
                    const country_code = "566";
                    const callhome = "60";
                    const merchant_category_code = "5411";
                    const merchant_address = (_g = terminal.customerAddress) !== null && _g !== void 0 ? _g : "DEVICE NEEDS SETUP";
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
                    const { encmasterkey, encpinkey, encsesskey, clrmasterkey, clrsesskey, clrpinkey, paramdownload, parsedParams, terminalId, } = terminal;
                    return response.json({
                        encmasterkey,
                        encpinkey,
                        encsesskey,
                        clrmasterkey,
                        clrsesskey,
                        clrpinkey,
                        paramdownload,
                        terminalId,
                        tid: terminalId,
                        parsedParams,
                        customerAddress: terminal.customerAddress,
                        iswISOTID: terminal.iswISOTID,
                        hydrogenTID: terminal.hydrogenTID,
                        profileId: (_h = terminal.profile) === null || _h === void 0 ? void 0 : _h._id,
                        iswTid: terminal.iswTid,
                        kimonoTid: terminal.iswTid,
                        threeLineTid: terminal.threeLineTid,
                        organisationId: (_j = terminal.organisation) === null || _j === void 0 ? void 0 : _j._id,
                    });
                }
                if (type === "intelliffin")
                    return IsoCardContoller.handleIntelifinKeyExchange(terminal, response);
                const result = type === "3line" &&
                    terminal.threeLineTid === terminal.terminalId &&
                    (threeResult === null || threeResult === void 0 ? void 0 : threeResult.status)
                    ? threeResult
                    : yield (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_1.TransactionTypes.KEY_EXCHANGE, {
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
                terminal.nibssParams = {
                    encmasterkey: data.encmasterkey,
                    encPinKey: data.encpinkey,
                    encSessionKey: data.encsesskey,
                    clrMasterKey: data.clrmasterkey,
                    clrSessionKey: data.clrsesskey,
                    clrpinkey: data.clrpinkey,
                    paramdownload: data.paramdownload,
                };
                terminal.paramdownload = data.paramdownload;
                yield terminal.save();
                const { encmasterkey, encpinkey, encsesskey, clrmasterkey, clrsesskey, clrpinkey, paramdownload, parsedParams, terminalId, } = terminal;
                return response.json({
                    encmasterkey,
                    encpinkey,
                    encsesskey,
                    clrmasterkey,
                    clrsesskey,
                    clrpinkey,
                    paramdownload,
                    terminalId,
                    tid: terminalId,
                    parsedParams,
                    customerAddress: terminal.customerAddress,
                    iswISOTID: terminal.iswISOTID,
                    hydrogenTID: terminal.hydrogenTID,
                    profileId: (_k = terminal.profile) === null || _k === void 0 ? void 0 : _k._id,
                    iswTid: terminal.iswTid,
                    kimonoTid: terminal.iswTid,
                    threeLineTid: terminal.threeLineTid,
                    organisationId: (_l = terminal.organisation) === null || _l === void 0 ? void 0 : _l._id,
                });
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
    requeryTransaction(request, response) {
        var _a, _b;
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
                const { rrn } = request.body;
                const data = yield transaction_model_1.default
                    .find({
                    rrn,
                })
                    .exec();
                return response.json({
                    status: data.length > 0,
                    data: data.map((item) => ({
                        rrn: item.rrn,
                        stan: item.STAN,
                        amount: item.amount,
                        responseCode: item.responseCode,
                        responseDescription: item.responseDescription,
                        PAN: item.PAN,
                        authCode: item.authCode,
                        processor: item.processor,
                    })),
                });
            }
            catch (error) {
                logger_1.default.error(error);
                return response.status(500).json({ message: "An error occurred" });
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
                const internalKey = (0, appUtils_1.generateTDESKey)();
                terminal.encmasterkey = internalKey;
                terminal.encpinkey = internalKey;
                terminal.encsesskey = internalKey;
                terminal.clrmasterkey = internalKey;
                terminal.clrsesskey = internalKey;
                terminal.clrpinkey = internalKey;
                // terminal.paramdownload = [
                //   ["020", padLeadingZeros(datetime.length), datetime],
                //   ["030", padLeadingZeros(merchantid.length), merchantid],
                //   ["040", padLeadingZeros(timeout.length), timeout],
                //   ["050", padLeadingZeros(currency_code.length), currency_code],
                //   ["060", padLeadingZeros(country_code.length), country_code],
                //   ["070", padLeadingZeros(callhome.length), callhome],
                //   [
                //     "080",
                //     padLeadingZeros(merchant_category_code.length),
                //     merchant_category_code,
                //   ],
                //   ["520", padLeadingZeros(merchant_address.length), merchant_address],
                // ]
                //   .map((a) => a.join(""))
                // .join("");
                terminal.nibssParams = {
                    encmasterkey: pin_key,
                    encPinKey: data.pin_key,
                    encSessionKey: data.pin_key,
                    clrMasterKey: data.pin_key,
                    clrSessionKey: data.pin_key,
                    clrpinkey: data.pin_key,
                    paramdownload: [
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
                        .join(""),
                };
                terminal.paramdownload = terminal.nibssParams.paramdownload;
                yield terminal.save();
                return response.json({
                    encpinkey: internalKey,
                    encsesskey: internalKey,
                    clrpinkey: internalKey,
                    clrsesskey: internalKey,
                    encmasterkey: internalKey,
                    paramdownload: terminal.paramdownload,
                    tid: terminal.terminalId,
                    clrmasterkey: internalKey,
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
        var _a, _b, _c, _d;
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
                })
                    .populate({ path: "profile", select: "title isoHost isoPort isSSL" })
                    .populate({ path: "groupTid" });
                if (!terminal)
                    return response.status(404).json({ message: "Terminal not found" });
                terminal.brand = brand;
                terminal.appVersion = appVersion;
                terminal.deviceModel = deviceModel;
                terminal.save();
                const { encmasterkey, encpinkey, encsesskey, clrmasterkey, clrsesskey, clrpinkey, paramdownload, parsedParams, terminalId, } = !terminal.usingGroupedTid ? terminal : terminal.groupTid;
                return response.json({
                    encmasterkey,
                    encpinkey,
                    encsesskey,
                    clrmasterkey,
                    clrsesskey,
                    clrpinkey,
                    paramdownload,
                    parsedParams,
                    tid: terminalId,
                    terminalId,
                    customerAddress: terminal.customerAddress,
                    iswISOTID: terminal.iswISOTID,
                    hydrogenTID: terminal.hydrogenTID,
                    profileId: (_c = terminal.profile) === null || _c === void 0 ? void 0 : _c._id,
                    iswTid: terminal.iswTid,
                    kimonoTid: terminal.iswTid,
                    threeLineTid: terminal.threeLineTid,
                    organisationId: (_d = terminal.organisation) === null || _d === void 0 ? void 0 : _d._id,
                });
            }
            catch (error) {
                console.log("Error: %s", error.message);
                return response.status(400).json({ message: "An error Occured" });
            }
        });
    }
    static patchTerminalWithGroupValues(terminal) {
        const { encmasterkey, encpinkey, encsesskey, clrmasterkey, clrsesskey, clrpinkey, paramdownload, terminalId, } = terminal.groupTid;
        terminal.encmasterkey = encmasterkey;
        terminal.encpinkey = encpinkey;
        terminal.encsesskey = encsesskey;
        terminal.clrmasterkey = clrmasterkey;
        terminal.clrsesskey = clrsesskey;
        terminal.clrpinkey = clrpinkey;
        terminal.paramdownload = paramdownload;
        terminal.terminalId = terminalId;
        return terminal;
    }
    processCard(request, response) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const startOfTransaction = performance.now();
            const serial = request.header("x-serial-no");
            const brand = request.header("x-brand");
            const deviceModel = request.header("x-device-model") || "";
            const appVersion = request.header("x-app-version");
            const { body } = request;
            let patchedPayload, terminal, processor, transLog, transactingTid, transactingMid, messageType;
            try {
                // @ts-ignore
                terminal = request.terminal || (yield terminal_model_1.default.findOne({
                    serialNo: serial,
                    deviceModel: (deviceModel === null || deviceModel === void 0 ? void 0 : deviceModel.toUpperCase()) || null,
                    brand: (brand === null || brand === void 0 ? void 0 : brand.toUpperCase()) || null,
                })
                    .populate({ path: "profile" })
                    .populate({ path: "groupTid" }));
                processor = String(body.processor).toUpperCase();
                processor =
                    processor === "NIBSS"
                        ? terminal.profile.type === "3line"
                            ? "3LINE"
                            : "ISO"
                        : processor;
                if (!terminal ||
                    ![terminal.terminalId, (_a = terminal.groupTid) === null || _a === void 0 ? void 0 : _a.terminalId].includes(body.tid) ||
                    body.tid == null)
                    return response
                        .status(404)
                        .json({ message: "Terminal not found/ Provisioned" });
                const { type } = terminal.profile;
                // patch terminal values for the transaction
                if (terminal.usingGroupedTid) {
                    IsoCardContoller.patchTerminalWithGroupValues(terminal);
                }
                if (((_b = body.clrpinkey) === null || _b === void 0 ? void 0 : _b.length) && terminal.clrpinkey !== body.clrpinkey) {
                    return response.status(412).json({ message: "Expired Keys" });
                }
                transLog = yield cardTransactionLog_model_1.default.create({
                    tid: terminal.terminalId,
                    amount: body.field4,
                    maskedPan: utils_1.default.getMaskPan(body.field2),
                    rrn: body.field37,
                    stan: body.field11,
                });
                messageType =
                    terminal.profile.allowProcessorOverride &&
                        [
                            "KIMONO",
                            "NIBSS",
                            "BLUESALT",
                            "ISO",
                            "3LINE",
                            "ISW",
                            "HYDROGEN",
                            "HABARI",
                        ].includes(processor)
                        ? IsoCardContoller.resolveProcessorTransType(processor.toLowerCase())
                        : IsoCardContoller.getMessageType(terminal, Number(body.field4));
                patchedPayload = IsoCardContoller.getPayload(messageType, body, terminal);
                transactingTid = patchedPayload.tid;
                transactingMid = patchedPayload.mid;
                const isDuplicate = yield IsoCardContoller.checkIfDuplication(patchedPayload.tid, patchedPayload.rrn, patchedPayload.stan, utils_1.default.getMaskPan(body.field2), messageType);
                if (isDuplicate) {
                    return response.json({
                        status: false,
                        resp: 26,
                        transactingTid,
                        transactingMid,
                        processor: "",
                        meaning: "Duplicate Transaction",
                        data: {
                            resp: 26,
                            transactingTid,
                            transactingMid,
                            meaning: "Duplicate Transaction",
                        },
                    });
                }
                const socketResponse = messageType === cardsockethelper_1.TransactionTypes.ISO_TRANSACTION &&
                    terminal.profile.isInteliffin
                    ? yield IsoCardContoller.hanldeIntellifin(messageType, patchedPayload, terminal)
                    : yield (0, cardsockethelper_1.sendSocketMessage)(messageType, patchedPayload);
                const totalTransTime = performance.now() - startOfTransaction;
                const { data } = socketResponse;
                const responseData = (data === null || data === void 0 ? void 0 : data.data) || data;
                responseData.transactingTid = transactingTid;
                responseData.transactingMid = transactingMid;
                body.totalTransTime = totalTransTime;
                const journalPayload = IsoCardContoller.saveTransaction(messageType, type, body, responseData, patchedPayload, terminal, appVersion, transLog);
                return response.json(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, socketResponse), Object.assign(Object.assign({}, (((_c = socketResponse.data) === null || _c === void 0 ? void 0 : _c.data) || {})), { processor: journalPayload.processor })), { data: responseData }), responseData), { processor: journalPayload.processor, issuer: (0, cardBins_1.getBinDetails)(journalPayload.PAN), totalTransTime }));
            }
            catch (error) {
                console.log("Error: %s", error);
                const responseData = error.data || error;
                responseData.transactingTid = transactingTid;
                responseData.transactingMid = transactingMid;
                const totalTransTime = performance.now() - startOfTransaction;
                body.totalTransTime = totalTransTime;
                IsoCardContoller.saveTransaction(messageType, terminal.profile.type, body, responseData, patchedPayload, terminal, appVersion, transLog);
                if (error.payload) {
                    console.log("Payload: %s", JSON.stringify(error.payload));
                }
                return response.json({
                    status: false,
                    data: null,
                    message: "An error Occured",
                    processor,
                    issuer: (0, cardBins_1.getBinDetails)(patchedPayload.field2),
                });
            }
        });
    }
    static saveTransaction(messageType, type, body, responseData, patchedPayload, terminal, appVersion, transLog) {
        const journalPayload = IsoCardContoller.resolveJournal(messageType, type, body, responseData, patchedPayload, terminal);
        terminal_model_1.default.findOneAndUpdate({ _id: terminal._id }, { appVersion }, { new: true });
        transaction_model_1.default
            .create(Object.assign(Object.assign({}, journalPayload), { organisationId: terminal.organisationId, webhookData: body.webhookData, totalTransTime: body.totalTransTime, issuer: (0, cardBins_1.getBinDetails)(journalPayload.PAN).code, deviceInfo: {
                serial: terminal.serialNo,
                model: terminal.deviceModel,
                brand: terminal.brand
            } }))
            .then((data) => {
            transLog.journalId = data._id;
            transLog.save();
            return IsoCardContoller.processWebHook(data, terminal);
        })
            .catch((err) => {
            console.error("Error: %s \r\n Unable to save transaction: %s", err.message, JSON.stringify(journalPayload));
        });
        return journalPayload;
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
            case cardsockethelper_1.TransactionTypes.ISW_PURCHASE:
                return IsoCardContoller.createISWISOJournal(responseData, patchedPayload, terminal, IsoCardContoller.getISOProcessor(type));
            case cardsockethelper_1.TransactionTypes.HYDROGEN_PURCHASE:
                return IsoCardContoller.createHydrogenJournal(responseData, patchedPayload, terminal, IsoCardContoller.getISOProcessor(type));
            case cardsockethelper_1.TransactionTypes.HABARI_PURCHASE:
                return IsoCardContoller.createHabariJournal(responseData, patchedPayload, terminal, IsoCardContoller.getISOProcessor(type));
            default:
                return IsoCardContoller.createNIBBSJournal(responseData, patchedPayload, IsoCardContoller.getISOProcessor(type));
        }
    }
    static getPayload(messageType, body, terminal) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const { componentKey1, isoHost, isoPort, isSSL, type, blueSaltTID, blueSaltKey, } = terminal.profile;
        switch (messageType) {
            case cardsockethelper_1.TransactionTypes.ISO_TRANSACTION:
                return Object.assign(Object.assign({}, body), { component: componentKey1, ip: isoHost, host: isoHost, ssl: String(isSSL), iso_flavour: type, port: isoPort, clrsesskey: (_b = (_a = terminal.nibssParams) === null || _a === void 0 ? void 0 : _a.clrSessionKey) !== null && _b !== void 0 ? _b : terminal.clrsesskey, clrpin: terminal.clrpinkey, field43: (_c = terminal.parsedParams) === null || _c === void 0 ? void 0 : _c.merchantNameLocation, field42: (_d = terminal.parsedParams) === null || _d === void 0 ? void 0 : _d.mid, nibssPinKey: (_f = (_e = terminal.nibssParams) === null || _e === void 0 ? void 0 : _e.clrpinkey) !== null && _f !== void 0 ? _f : terminal.clrpinkey });
            case cardsockethelper_1.TransactionTypes.THREELINE:
                return Object.assign(Object.assign({}, body), { component: (_g = terminal.profile) === null || _g === void 0 ? void 0 : _g.threeLineKey, ip: (_h = terminal.profile) === null || _h === void 0 ? void 0 : _h.threeLineHost, ssl: String((_j = terminal.profile) === null || _j === void 0 ? void 0 : _j.threeLineHostSSL), iso_flavour: type, port: (_k = terminal.profile) === null || _k === void 0 ? void 0 : _k.threeLinePort, clrsesskey: terminal.clrsesskey, clrpin: terminal.clrpinkey, clrPinKey: terminal.clrpinkey, field41: terminal.threeLineTid, field43: (_l = terminal.threeLineParsedParams) === null || _l === void 0 ? void 0 : _l.merchantNameLocation, field42: (_m = terminal.threeLineParsedParams) === null || _m === void 0 ? void 0 : _m.mid, threeLineclrPinKey: terminal.threeLineParams.clrPinKey, threeLinePinKey: terminal.threeLineParams.clrpinkey, tid: terminal.threeLineTid, mid: (_o = terminal.threeLineParsedParams) === null || _o === void 0 ? void 0 : _o.mid });
            case cardsockethelper_1.TransactionTypes.ISW_KIMONO:
                return IsoCardContoller.patchISWPayload(body, terminal.profile, terminal);
            case cardsockethelper_1.TransactionTypes.BLUESALT:
                return Object.assign(Object.assign({}, IsoCardContoller.patchISWPayload(body, terminal.profile, terminal)), { serial: terminal.serialNo, blueSaltTid: blueSaltTID, blueSaltKey: blueSaltKey, model: terminal.deviceModel, device: terminal.deviceModel });
            case cardsockethelper_1.TransactionTypes.ISW_PURCHASE:
                return Object.assign({}, IsoCardContoller.patchISWISOPayload(body, terminal.profile, terminal));
            case cardsockethelper_1.TransactionTypes.HYDROGEN_PURCHASE:
                return Object.assign({}, IsoCardContoller.patchHydrogenPayload(body, terminal.profile, terminal));
            case cardsockethelper_1.TransactionTypes.HABARI_PURCHASE:
                return Object.assign({}, IsoCardContoller.patchHabariPayload(body, terminal.profile, terminal));
            default:
                throw new Error("Invalid Message Type");
        }
    }
    static getISOProcessor(key) {
        return !["generic", "intelliffin", "bluesalt", "3line"].includes(key)
            ? key
            : undefined;
    }
    checkBalance(request, response) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serial = request.header("x-serial-no");
                const brand = request.header("x-brand");
                const deviceModel = request.header("x-device-model") || "";
                const appVersion = request.header("x-app-version");
                let terminal = yield terminal_model_1.default.findOne({
                    serialNo: serial,
                    deviceModel: (deviceModel === null || deviceModel === void 0 ? void 0 : deviceModel.toUpperCase()) || null,
                    brand: (brand === null || brand === void 0 ? void 0 : brand.toUpperCase()) || null,
                })
                    .populate({ path: "profile" })
                    .populate("groupTid");
                const { body } = request;
                let processor = String(body.processor).toUpperCase();
                processor = processor === "NIBSS" ? "ISO" : processor;
                console.log("Processor: %s => %s", terminal.terminalId, body.tid);
                if (!terminal ||
                    ![terminal.terminalId, (_a = terminal.groupTid) === null || _a === void 0 ? void 0 : _a.terminalId].includes(body.tid) ||
                    body.tid == null)
                    return response
                        .status(404)
                        .json({ message: "Terminal not found/ Provisioned" });
                terminal.appVersion = appVersion;
                yield terminal.save().catch(console.log);
                const { componentKey1, isoHost, isoPort, isSSL, type } = terminal.profile;
                if (terminal.usingGroupedTid) {
                    terminal = IsoCardContoller.patchTerminalWithGroupValues(terminal);
                }
                const patchedPayload = Object.assign(Object.assign({}, body), { component: componentKey1, ip: isoHost, host: isoHost, ssl: String(isSSL), port: isoPort, clrsesskey: (_c = (_b = terminal.nibssParams) === null || _b === void 0 ? void 0 : _b.clrSessionKey) !== null && _c !== void 0 ? _c : terminal.clrsesskey, nibssPinKey: (_e = (_d = terminal.nibssParams) === null || _d === void 0 ? void 0 : _d.clrpinkey) !== null && _e !== void 0 ? _e : terminal.clrpinkey, clrpin: terminal.clrpinkey, field0: "0100", field3: "31" + body.field3.substring(2), field43: (_f = terminal.parsedParams) === null || _f === void 0 ? void 0 : _f.merchantNameLocation, field42: (_g = terminal.parsedParams) === null || _g === void 0 ? void 0 : _g.mid });
                const socketResponse = terminal.profile.isInteliffin
                    ? yield IsoCardContoller.hanldeIntellifin(cardsockethelper_1.TransactionTypes.BALACE_CHECK, patchedPayload, terminal, 7)
                    : yield (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_1.TransactionTypes.BALACE_CHECK, patchedPayload);
                const { data } = socketResponse;
                const responseData = data.data || data;
                return response.json(Object.assign(Object.assign(Object.assign(Object.assign({}, socketResponse), Object.assign({}, (((_h = socketResponse.data) === null || _h === void 0 ? void 0 : _h.data) || {}))), { data: responseData }), responseData));
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
            return yield (0, cardsockethelper_1.sendSocketMessage)(type, payload);
        });
    }
    static patchISWPayload(data, profile, terminal) {
        var _a;
        return Object.assign(Object.assign({}, data), { destInstitutionCode: profile.iswInstitutionCode, destAccountNumber: profile.iswDestinationAccount, merchantLocation: (terminal === null || terminal === void 0 ? void 0 : terminal.parsedParams.merchantNameLocation) ||
                "HAPTICKSDATA LTD LA LANG", tid: terminal.iswTid, mid: profile.iswMid, field43: ((_a = terminal.parsedParams) === null || _a === void 0 ? void 0 : _a.merchantNameLocation) || data.field43, uniqueId: terminal.iswUniqueId, amount: data.field4 || data.amount || 0, totalamount: data.field4 || data.amount || 0, clrsesskey: terminal.clrsesskey, clrpin: terminal.clrpinkey, pinblock: data.pinblock || "" });
    }
    static patchISWISOPayload(data, profile, terminal) {
        var _a, _b, _c;
        const { host, port, ssl, zpk, mid, rid, oRid, mcc, ett, settlementAccount, } = profile.iswISOConfig;
        return Object.assign(Object.assign({}, data), { destInstitutionCode: profile.iswInstitutionCode, destAccountNumber: profile.iswDestinationAccount, merchantLocation: data.terminalLocation ||
                ((_a = terminal === null || terminal === void 0 ? void 0 : terminal.terminalLocation) === null || _a === void 0 ? void 0 : _a.location) ||
                ((_b = terminal.parsedParams) === null || _b === void 0 ? void 0 : _b.merchantNameLocation), tid: terminal.iswISOTID, mid: mid, field42: mid, field18: mcc, field41: terminal.iswISOTID, field43: data.field43 || ((_c = terminal.parsedParams) === null || _c === void 0 ? void 0 : _c.merchantNameLocation), uniqueId: terminal.iswUniqueId, amount: data.field4 || data.amount || 0, totalamount: data.field4 || data.amount || 0, clrsesskey: terminal.clrsesskey, clrpin: terminal.clrpinkey, pinblock: data.pinblock || "", clearZpk: zpk, host,
            port,
            rid,
            oRid,
            ssl,
            ett,
            settlementAccount });
    }
    static patchHydrogenPayload(data, profile, terminal) {
        var _a, _b;
        const { host, port, ssl, zpk, mid, acqId, mcc } = profile.hydrogenConfig;
        return Object.assign(Object.assign({}, data), { destInstitutionCode: profile.iswInstitutionCode, destAccountNumber: profile.iswDestinationAccount, merchantLocation: data.terminalLocation ||
                ((_a = terminal === null || terminal === void 0 ? void 0 : terminal.terminalLocation) === null || _a === void 0 ? void 0 : _a.location) ||
                (terminal === null || terminal === void 0 ? void 0 : terminal.parsedParams.merchantNameLocation), tid: terminal.hydrogenTID, mid: mid, field18: mcc, field43: ((_b = terminal.parsedParams) === null || _b === void 0 ? void 0 : _b.merchantNameLocation) || data.field43, uniqueId: terminal.iswUniqueId, amount: data.field4 || data.amount || 0, totalamount: data.field4 || data.amount || 0, clrsesskey: terminal.clrsesskey, clrpin: terminal.clrpinkey, pinblock: data.pinblock || "", clearZpk: zpk, host,
            port,
            ssl,
            acqId });
    }
    static patchHabariPayload(data, profile, terminal) {
        var _a, _b;
        const { host, port, ssl, zpk, mid, acqId, mcc } = profile.habariConfig;
        return Object.assign(Object.assign({}, data), { destInstitutionCode: profile.iswInstitutionCode, destAccountNumber: profile.iswDestinationAccount, merchantLocation: data.terminalLocation ||
                ((_a = terminal === null || terminal === void 0 ? void 0 : terminal.terminalLocation) === null || _a === void 0 ? void 0 : _a.location) ||
                (terminal === null || terminal === void 0 ? void 0 : terminal.parsedParams.merchantNameLocation), tid: terminal.habariTID, mid: mid, field18: mcc, field43: ((_b = terminal.parsedParams) === null || _b === void 0 ? void 0 : _b.merchantNameLocation) || data.field43, uniqueId: terminal.iswUniqueId, amount: data.field4 || data.amount || 0, totalamount: data.field4 || data.amount || 0, clrsesskey: terminal.clrsesskey, clrpin: terminal.clrpinkey, pinblock: data.pinblock || "", clearZpk: zpk, host,
            port,
            ssl,
            acqId });
    }
    static getMessageType(terminal, amount) {
        var _a, _b, _c;
        const profile = terminal === null || terminal === void 0 ? void 0 : terminal.profile;
        if (!((_a = terminal === null || terminal === void 0 ? void 0 : terminal.profile) === null || _a === void 0 ? void 0 : _a.iswSwitchAmount) && !profile.processorSettings)
            return cardsockethelper_1.TransactionTypes.ISO_TRANSACTION;
        if (!((_b = profile.processorSettings) === null || _b === void 0 ? void 0 : _b.length))
            return amount / 100 >= (terminal === null || terminal === void 0 ? void 0 : terminal.profile.iswSwitchAmount)
                ? cardsockethelper_1.TransactionTypes.ISW_KIMONO
                : cardsockethelper_1.TransactionTypes.ISO_TRANSACTION;
        const type = (_c = profile.processorSettings.find((band) => amount / 100 >= band.minAmount && amount / 100 <= band.maxAmount)) === null || _c === void 0 ? void 0 : _c.processor;
        console.log(type);
        return IsoCardContoller.resolveProcessorTransType(type);
    }
    static resolveProcessorTransType(type) {
        switch (type) {
            case "nibss":
                return cardsockethelper_1.TransactionTypes.ISO_TRANSACTION;
            case "kimono":
                return cardsockethelper_1.TransactionTypes.ISW_KIMONO;
            case "3line":
                return cardsockethelper_1.TransactionTypes.THREELINE;
            case "bluesalt":
                return cardsockethelper_1.TransactionTypes.BLUESALT;
            case "isw":
                return cardsockethelper_1.TransactionTypes.ISW_PURCHASE;
            case "hydrogen":
                return cardsockethelper_1.TransactionTypes.HYDROGEN_PURCHASE;
            case "habari":
                return cardsockethelper_1.TransactionTypes.HABARI_PURCHASE;
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
            merchantId: payload.mid,
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
    static createISWISOJournal(response, payload, terminal, processor) {
        var _a;
        return {
            PAN: utils_1.default.getMaskPan(payload.pan),
            rrn: payload.rrn,
            amount: Number.parseFloat(payload.field4),
            STAN: payload.stan,
            cardExpiration: payload.expirydate,
            terminalId: terminal.iswISOTID,
            merchantId: payload.mid,
            responseCode: response.resp,
            responseDescription: response.meaning,
            authCode: response.auth,
            merchantName: (_a = payload.merchantLocation) !== null && _a !== void 0 ? _a : terminal.parsedParams.merchantNameLocation,
            merchantCategoryCode: terminal === null || terminal === void 0 ? void 0 : terminal.parsedParams.mechantCategoryCode,
            product: "CASHOUT",
            transactionTime: new Date().toUTCString(),
            handlerResponseTime: new Date().toUTCString(),
            isCompleted: true,
            processor: processor !== null && processor !== void 0 ? processor : types_1.Processor.ISW,
            reversal: Boolean(response.reversal),
            reversalData: response.reversal,
        };
    }
    static createHydrogenJournal(response, payload, terminal, processor) {
        var _a;
        return {
            PAN: utils_1.default.getMaskPan(payload.pan),
            rrn: payload.rrn,
            amount: Number.parseFloat(payload.field4),
            STAN: payload.stan,
            cardExpiration: payload.expirydate,
            terminalId: terminal.hydrogenTID,
            merchantId: payload.mid,
            responseCode: response.resp,
            responseDescription: response.meaning,
            authCode: response.auth,
            merchantName: (_a = payload.merchantLocation) !== null && _a !== void 0 ? _a : payload.field43,
            merchantCategoryCode: payload.mcc,
            product: "CASHOUT",
            transactionTime: new Date().toUTCString(),
            handlerResponseTime: new Date().toUTCString(),
            isCompleted: true,
            processor: processor !== null && processor !== void 0 ? processor : types_1.Processor.HYDROGEN,
            reversal: Boolean(response.reversal),
            reversalData: response.reversal,
        };
    }
    static createHabariJournal(response, payload, terminal, processor) {
        var _a;
        return {
            PAN: utils_1.default.getMaskPan(payload.pan),
            rrn: payload.rrn,
            amount: Number.parseFloat(payload.field4),
            STAN: payload.stan,
            cardExpiration: payload.expirydate,
            terminalId: terminal.habariTID,
            merchantId: payload.mid,
            responseCode: response.resp,
            responseDescription: response.meaning,
            authCode: response.auth,
            merchantName: (_a = payload.merchantLocation) !== null && _a !== void 0 ? _a : payload.field43,
            merchantCategoryCode: payload.mcc,
            product: "CASHOUT",
            transactionTime: new Date().toUTCString(),
            handlerResponseTime: new Date().toUTCString(),
            isCompleted: true,
            processor: processor !== null && processor !== void 0 ? processor : types_1.Processor.HABARI,
            reversal: Boolean(response.reversal),
            reversalData: response.reversal,
        };
    }
    static processWebHook(transaction, terminal) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!terminal.profile.webhookId)
                return;
            const webhook = yield webhook_model_1.default.findById(terminal.profile.webhookId);
            webhook.dest_urls.forEach((url) => {
                console.log("Firing for url: ", url);
                queue_1.webhookQueue.add("sendNotification", {
                    tranactionId: transaction._id,
                    webhookId: terminal.profile.webhookId,
                    organisationId: terminal.organisationId,
                    url
                }, {
                    attempts: 5,
                    backoff: {
                        type: "exponential",
                        delay: 1000 * 5
                    }
                });
            });
        });
    }
    static checkIfDuplication(tid, rrn, stan, maskpan, processor) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = yield transaction_model_1.default.exists({
                terminalId: tid,
                rrn,
                STAN: stan,
                PAN: maskpan,
            });
            return _id != null;
        });
    }
}
exports.default = IsoCardContoller;
//# sourceMappingURL=iso_card.controller.js.map