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
exports.webhookWorkerScheduler = exports.webhookWorker = void 0;
const bullmq_1 = require("bullmq");
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config/config"));
const transaction_model_1 = __importDefault(require("../../db/models/transaction.model"));
const webhook_model_1 = __importDefault(require("../../db/models/webhook.model"));
const organisation_model_1 = __importDefault(require("../../db/models/organisation.model"));
const webhook_request_model_1 = __importDefault(require("../../db/models/webhook_request.model"));
const crypt_1 = require("../../helpers/crypt");
const config = (new config_1.default()).getConfig('');
const connection = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
};
exports.webhookWorker = new bullmq_1.Worker('webhook', (job) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = job.data;
    const journal = yield transaction_model_1.default.findById(data.tranactionId);
    const webhook = yield webhook_model_1.default.findById(data.webhookId);
    const organisation = yield organisation_model_1.default.findById(data.organisationId);
    if (!webhook || !journal)
        return;
    const payloadObject = {
        MTI: journal.MTI,
        amount: journal.amount / 100,
        terminalId: journal.terminalId,
        responseCode: journal.responseCode,
        responseDescription: journal.responseDescription,
        PAN: journal.PAN,
        STAN: journal.STAN,
        authCode: journal.authCode,
        transactionTime: journal.transactionTime,
        reversal: false,
        merchantId: journal.merchantId,
        merchantName: journal.merchantName,
        merchantAddress: journal.merchantAddress,
        rrn: journal.rrn,
        metaData: journal.webhookData,
    };
    const verifyString = (0, crypt_1.createSha256Hash)(JSON.stringify(payloadObject));
    const signature = (0, crypt_1.createDigest)(webhook.secret, verifyString);
    let response = null;
    try {
        response = yield axios_1.default.post(data.url, payloadObject, {
            headers: {
                'x-verify-string': verifyString,
                'x-signature': signature,
            }
        });
    }
    catch (error) {
        if (!error.isAxiosError) {
            throw error;
        }
        response = error.response;
    }
    const webhookRequest = webhook_request_model_1.default.create({
        journalId: journal.id,
        payload: payloadObject,
        webhookId: webhook.id,
        organisationId: data.organisationId,
        responseCode: response.status,
        responseType: response.headers['content-type'],
        responseBody: response.headers['content-type'] === 'application/json' ? JSON.stringify(response.data) : response.data,
        status: response.status === 200 ? 'success' : 'fail',
        isRetry: (_a = data.retry) !== null && _a !== void 0 ? _a : false,
        terminalId: journal.terminalId,
        verifyString,
        verifySignature: signature,
        url: data.url
    });
    return webhookRequest;
}), {
    autorun: false,
    limiter: {
        max: 10,
        duration: 1000 * 60,
        groupKey: 'url'
    },
    connection
});
exports.webhookWorkerScheduler = new bullmq_1.QueueScheduler('webhook', { connection });
exports.default = exports.webhookWorker;
//# sourceMappingURL=webhook.js.map