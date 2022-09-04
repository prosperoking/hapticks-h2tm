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
const config_1 = __importDefault(require("../../config/config"));
const config = (new config_1.default()).getConfig('');
const connection = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
};
exports.webhookWorker = new bullmq_1.Worker('webhook', (job) => __awaiter(void 0, void 0, void 0, function* () {
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