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
exports.translateSlimCardPayload = exports.parseTrack2 = exports.getIccTags = exports.parsePurchaseTlv = exports.reparkPayLoad = void 0;
const ber_tlv_1 = require("ber-tlv");
const terminal_model_1 = __importDefault(require("../db/models/terminal.model"));
const moment_1 = __importDefault(require("moment"));
function reparkPayLoad(data, action, terminal) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const parsedData = parsePurchaseTlv(data.iccData);
        const account = {
            "00": "Default",
            "10": "Savings",
            "20": "Current",
            "30": "Credit",
        };
        const panInfo = parseTrack2(data.track2);
        const { parsedParams } = !terminal.usingGroupedTid ? terminal : terminal.groupTid;
        return {
            tid: data.tid,
            mid: data.mid,
            sn: terminal.serialNo,
            account: (_a = account[data.accountType]) !== null && _a !== void 0 ? _a : "Default",
            clrpin: !terminal.usingGroupedTid ? terminal.clrpinkey : terminal.groupTid.clrpinkey,
            pinblock: data.pinBlock,
            panseqno: parsedData.panSeqNum,
            amount: String(Number.parseInt(parsedData.amount) / 100),
            aip: parsedData.aip,
            atc: parsedData.atc,
            cryptogram: parsedData.cryptogram,
            cip: parsedData.cryptogramInfoData,
            cvm: parsedData.cvm,
            iad: parsedData.issuerApplicationData,
            tvr: parsedData.terminalVerificationResult,
            capabilities: parsedData.terminalCapabilities,
            unpredictable: parsedData.unpredictableNumber,
            filename: parsedData.dedicatedFileName,
            pan: panInfo.pan,
            expirydate: panInfo.expiryDate,
            track: data.track2,
            stan: data.stan,
            rrn: data.rrn,
            totalamount: String(Number.parseInt(parsedData.amount) / 100),
            field18: parsedParams === null || parsedParams === void 0 ? void 0 : parsedParams.mechantCategoryCode,
            field4: parsedData.amount,
            field22: (_b = data === null || data === void 0 ? void 0 : data.entryMode) !== null && _b !== void 0 ? _b : "051",
            field23: parsedData.panSeqNum,
            field26: "06",
            field25: "00",
            field28: "D00000000",
            field11: data.stan,
            field55: data.iccData,
            field12: (0, moment_1.default)().format("HHmmss"),
            field13: parsedData.transactionDate.substring(0, 4),
            field14: panInfo.expiryDate,
            field52: data.pinBlock,
            field42: data.mid,
            field43: parsedParams === null || parsedParams === void 0 ? void 0 : parsedParams.merchantNameLocation,
            field49: (_c = parsedParams === null || parsedParams === void 0 ? void 0 : parsedParams.currencyCode) !== null && _c !== void 0 ? _c : "556",
            field40: panInfo.seviceRistricionCode,
            field41: data.tid,
            field128: "",
            field123: "510101511344101",
            field0: "0200",
            field32: panInfo.pan.substring(0, 6),
            field37: data.rrn,
            field35: data.track2,
            field7: data.transDateTime,
            field3: `00${(_d = data.accountType) !== null && _d !== void 0 ? _d : "00"}00`,
            field2: panInfo.pan,
            processor: data.processor
        };
    });
}
exports.reparkPayLoad = reparkPayLoad;
function parsePurchaseTlv(payload) {
    var _a;
    const data = ber_tlv_1.TlvFactory.parse(payload);
    const getVal = (key) => { var _a, _b; return (_b = (_a = data.find((item) => item.tag === key)) === null || _a === void 0 ? void 0 : _a.value.toString('hex').toUpperCase()) !== null && _b !== void 0 ? _b : ''; };
    return {
        aid: getVal('4F'),
        cryptogram: getVal('9F26'),
        cryptogramInfoData: getVal('9F27'),
        issuerApplicationData: getVal('9F10'),
        unpredictableNumber: getVal('9F37'),
        atc: getVal('9F36'),
        terminalVerificationResult: getVal('95'),
        transactionDate: getVal('9A'),
        transactionType: getVal('9C'),
        amountOther: getVal('9F03'),
        amount: getVal('9F02'),
        terminalCapabilities: getVal('9F33'),
        dedicatedFileName: getVal('84'),
        transSeqCounter: getVal('9F41'),
        panSeqNum: (_a = getVal('5F34')) === null || _a === void 0 ? void 0 : _a.padStart(3, '0'),
        terminalCurrency: getVal('9F1A'),
        aip: getVal('82'),
        transType: getVal('9C'),
        cvm: getVal('9F34')
    };
}
exports.parsePurchaseTlv = parsePurchaseTlv;
function getIccTags(payload) {
    const data = ber_tlv_1.TlvFactory.parse(payload);
    return data.map((item) => item.tag);
}
exports.getIccTags = getIccTags;
function parseTrack2(track2) {
    const [pan, other] = track2.split("D");
    return {
        pan,
        expiryDate: other.substring(0, 4),
        seviceRistricionCode: other.substring(4, 7)
    };
}
exports.parseTrack2 = parseTrack2;
function translateSlimCardPayload(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const serial = req.header("x-serial-no");
        const brand = req.header("x-brand");
        const deviceModel = req.header("x-device-model") || "";
        const terminal = yield terminal_model_1.default.findOne({
            serialNo: serial,
            deviceModel: (deviceModel === null || deviceModel === void 0 ? void 0 : deviceModel.toUpperCase()) || null,
            brand: (brand === null || brand === void 0 ? void 0 : brand.toUpperCase()) || null,
        })
            .populate({ path: "profile" })
            .populate({ path: "groupTid" });
        if (!terminal) {
            return res.status(404).json({
                message: "Terminal not found"
            });
        }
        const repacked = yield reparkPayLoad(req.body, 'purchase', terminal);
        req.body = repacked;
        //@ts-ignore
        req.terminal = terminal;
        next();
    });
}
exports.translateSlimCardPayload = translateSlimCardPayload;
//# sourceMappingURL=iso.js.map