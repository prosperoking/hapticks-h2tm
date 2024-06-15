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
exports.registerQueueDashBoard = exports.startQueWorkers = exports.bullQueues = exports.Groupkeyexchange = exports.keyExchange = exports.webhookQueue = void 0;
const bullmq_1 = require("bullmq");
const logger_1 = __importDefault(require("../helpers/logger"));
const config_1 = __importDefault(require("../config/config"));
const keyexchange_1 = require("./processors/keyexchange");
const webhook_1 = __importDefault(require("./processors/webhook"));
const express_1 = require("@bull-board/express");
const api_1 = require("@bull-board/api");
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const config = (new config_1.default()).getConfig('');
const connection = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
};
const workers = [
    keyexchange_1.keyExchangeWorker,
    webhook_1.default,
    keyexchange_1.GroupKeyExchangeWorker,
];
exports.webhookQueue = new bullmq_1.Queue('webhook', { connection });
exports.keyExchange = new bullmq_1.Queue('keyexchange', { connection });
exports.Groupkeyexchange = new bullmq_1.Queue('groupkeyexchange', { connection });
exports.bullQueues = [
    exports.webhookQueue,
    exports.keyExchange,
];
const startQueWorkers = () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.log({ message: "Starting Queues" });
    try {
        Promise.all(workers.map(worker => worker.run()));
        logger_1.default.log({ message: "QueWorkers started" });
    }
    catch (error) {
        logger_1.default.error({ message: "QueWorkers Failed to start", error });
    }
});
exports.startQueWorkers = startQueWorkers;
const registerQueueDashBoard = (app, path = '/admin/queue') => {
    const serverAdapter = new express_1.ExpressAdapter();
    serverAdapter.setBasePath(path);
    (0, api_1.createBullBoard)({
        queues: exports.bullQueues.map(queue => new BullMQAdapter(queue)),
        serverAdapter
    });
    return serverAdapter.getRouter();
};
exports.registerQueueDashBoard = registerQueueDashBoard;
//# sourceMappingURL=queue.js.map