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
exports.keyExchangeWorker = void 0;
const bullmq_1 = require("bullmq");
const terminal_model_1 = __importDefault(require("../../db/models/terminal.model"));
const cardsockethelper_1 = require("../../helpers/cardsockethelper");
const config_1 = __importDefault(require("../../config/config"));
const config = (new config_1.default()).getConfig('');
const connection = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
};
exports.keyExchangeWorker = new bullmq_1.Worker('keyexchange', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const terminal = yield terminal_model_1.default.findById(job.data._id).populate('profile');
    if (!terminal)
        throw Error("Terminal Not found");
    const profile = terminal.profile;
    let result = yield (0, cardsockethelper_1.performCardSocketTranaction)(cardsockethelper_1.TransactionTypes.KEY_EXCHANGE, {
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
exports.default = exports.keyExchangeWorker;
//# sourceMappingURL=keyexchange.js.map