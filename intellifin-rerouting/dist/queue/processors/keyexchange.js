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
exports.GroupKeyExchangeWorker = exports.keyExchangeWorker = void 0;
const bullmq_1 = require("bullmq");
const terminal_model_1 = __importDefault(require("../../db/models/terminal.model"));
const cardsockethelper_1 = require("../../helpers/cardsockethelper");
const config_1 = __importDefault(require("../../config/config"));
const inteliffin_1 = __importDefault(require("../../services/inteliffin"));
const groupTid_model_1 = __importDefault(require("../../db/models/groupTid.model"));
const config = (new config_1.default()).getConfig('');
const connection = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
};
exports.keyExchangeWorker = new bullmq_1.Worker('keyexchange', (job) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const terminal = yield terminal_model_1.default.findById(job.data._id).populate('profile');
    if (!terminal)
        throw Error("Terminal Not found");
    const profile = terminal.profile;
    if (terminal.profile.hasthreelineSupport && ((_a = terminal.threeLineTid) === null || _a === void 0 ? void 0 : _a.length)) {
        const threeResult = yield (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_1.TransactionTypes.THREELINE_KEY_EXCHANGE, {
            tid: terminal.threeLineTid,
            component: terminal.profile.threeLineKey,
            ip: terminal.profile.threeLineHost,
            ssl: String(terminal.profile.threeLineHostSSL),
            port: terminal.profile.threeLinePort,
        });
        if (threeResult.status) {
            terminal.threeLineParams = threeResult.data;
            if (terminal.threeLineTid == terminal.terminalId && terminal.profile.type == "3line") {
                const data = threeResult.data;
                terminal.encmasterkey = data.encmasterkey;
                terminal.encpinkey = data.encpinkey;
                terminal.encsesskey = data.encsesskey;
                terminal.clrmasterkey = data.clrmasterkey;
                terminal.clrsesskey = data.clrsesskey;
                terminal.clrpinkey = data.clrpinkey;
                terminal.paramdownload = data.paramdownload;
                yield terminal.save();
                return;
            }
        }
    }
    if (profile.isInteliffin) {
        return handleIntelifinKeyExchange(terminal);
    }
    let result = yield (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_1.TransactionTypes.KEY_EXCHANGE, {
        tid: terminal.terminalId,
        component: profile.componentKey1,
        ip: profile.isoHost,
        ssl: String(profile.isSSL),
        port: profile.isoPort
    });
    console.log(result);
    if (!(result === null || result === void 0 ? void 0 : result.status))
        throw Error(result.message);
    const { data } = result;
    terminal.encmasterkey = data.encmasterkey;
    terminal.encpinkey = data.encpinkey;
    terminal.encsesskey = data.encsesskey;
    terminal.clrmasterkey = data.clrmasterkey;
    terminal.clrsesskey = data.clrsesskey;
    terminal.clrpinkey = data.clrpinkey;
    terminal.paramdownload = data.paramdownload;
    yield terminal.save();
}), {
    autorun: false,
    connection,
});
exports.GroupKeyExchangeWorker = new bullmq_1.Worker('groupkeyexchange', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const groupTid = yield groupTid_model_1.default.findById(job.data._id).populate('profile');
    if (!groupTid)
        throw Error("Group Tid Not found");
    const profile = groupTid.profile;
    // if(groupTid.profile.hasthreelineSupport && groupTid.threeLineTid?.length) {
    //     const threeResult = await sendSocketMessage(
    //       TransactionTypes.THREELINE_KEY_EXCHANGE,
    //       {
    //         tid: groupTid.threeLineTid,
    //         component: groupTid.profile.threeLineKey,
    //         ip: groupTid.profile.threeLineHost,
    //         ssl: String(groupTid.profile.threeLineHostSSL),
    //         port: groupTid.profile.threeLinePort,
    //       }
    //     )
    //     if(threeResult.status) {
    //       groupTid.threeLineParams = threeResult.data
    //     }
    //   }
    // if(profile.isInteliffin) {
    //     return handleIntelifinKeyExchange(groupTid);
    // }
    let result = yield (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_1.TransactionTypes.KEY_EXCHANGE, {
        tid: groupTid.terminalId,
        component: profile.componentKey1,
        ip: profile.isoHost,
        ssl: String(profile.isSSL),
        port: profile.isoPort
    });
    console.log("", result);
    if (!(result === null || result === void 0 ? void 0 : result.status))
        throw Error(result.message);
    const { data } = result;
    groupTid.encmasterkey = data.encmasterkey;
    groupTid.encpinkey = data.encpinkey;
    groupTid.encsesskey = data.encsesskey;
    groupTid.clrmasterkey = data.clrmasterkey;
    groupTid.clrsesskey = data.clrsesskey;
    groupTid.clrpinkey = data.clrpinkey;
    groupTid.paramdownload = data.paramdownload;
    yield groupTid.save();
}), {
    autorun: false,
    connection,
});
function handleIntelifinKeyExchange(terminal) {
    return __awaiter(this, void 0, void 0, function* () {
        const { isoHost, isoPort, isSSL } = terminal.profile;
        try {
            const data = yield inteliffin_1.default.getPrepInfo({
                terminalid: terminal.terminalId,
                serialno: terminal.serialNo,
            });
            if (data.response !== '00') {
                return;
            }
            const { pin_key, callhome, country_code, currency_code, datetime, merchant_address, merchant_category_code, merchantid, timeout, } = data;
            const padLeadingZeros = (num) => num.toString().padStart(2, '0');
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
                ["050", padLeadingZeros(currency_code.length), currency_code,],
                ["060", padLeadingZeros(country_code.length), country_code],
                ["070", padLeadingZeros(callhome.length), callhome],
                ["080", padLeadingZeros(merchant_category_code.length), merchant_category_code],
                ["520", padLeadingZeros(merchant_address.length), merchant_address],
            ].map(a => a.join('')).join('');
            yield terminal.save();
        }
        catch (error) {
            throw error;
        }
    });
}
exports.default = { keyExchangeWorker: exports.keyExchangeWorker, GroupKeyExchangeWorker: exports.GroupKeyExchangeWorker };
//# sourceMappingURL=keyexchange.js.map