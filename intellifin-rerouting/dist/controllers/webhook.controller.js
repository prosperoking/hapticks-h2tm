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
exports.retryWebhook = exports.webhookRequests = exports.deleteWebhook = exports.reCreateSecret = exports.updateWebhook = exports.createWebhook = exports.getWebhooks = void 0;
const webhook_model_1 = __importDefault(require("../db/models/webhook.model"));
const webhook_request_model_1 = __importDefault(require("../db/models/webhook_request.model"));
const logger_1 = __importDefault(require("../helpers/logger"));
const crypt_1 = require("../helpers/crypt");
const crypto_1 = require("crypto");
const lodash_1 = __importDefault(require("lodash"));
const queue_1 = require("../queue/queue");
function getWebhooks(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // @ts-ignore
            const orgFilter = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.organisationId) === null ? {
                organisationId: req.query.organisationId,
            } :
                //@ts-ingore
                { organisationId: req.user.organisation_id };
            const webhooks = yield webhook_model_1.default.paginate(Object.assign(Object.assign({}, filterGen(req.query)), orgFilter), {
                sort: { name: -1 },
                limit: Number(req.query.limit || 50),
                page: Number(req.query.page || 1),
                populate: [
                    { path: 'organisation', select: 'name' },
                    { path: 'request_count', model: webhook_request_model_1.default },
                ]
            });
            return res.json(webhooks);
        }
        catch (error) {
            logger_1.default.error(error.message);
            res.status(400).json({
                message: "An error occured"
            });
        }
    });
}
exports.getWebhooks = getWebhooks;
function createWebhook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const secret = (0, crypt_1.createSha256Hash)((0, crypto_1.randomUUID)());
            const webhook = yield webhook_model_1.default.create(Object.assign(Object.assign({}, req.body), { secret }));
            return res.json(webhook);
        }
        catch (error) {
            logger_1.default.error(error.message);
            return res.status(400).json({
                message: "Secret recreation failed",
            });
        }
    });
}
exports.createWebhook = createWebhook;
function updateWebhook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const webhook = yield webhook_model_1.default.findById(req.params.id);
            if (!webhook)
                return res.status(404).json({
                    message: "webhook not found"
                });
            const { url, name } = req.body;
            webhook.url = url;
            webhook.name = name;
            yield webhook.save();
            res.json(webhook);
        }
        catch (error) {
            logger_1.default.error(error.message);
            return res.status(400).json({
                message: "Webhook Update failed",
            });
        }
    });
}
exports.updateWebhook = updateWebhook;
function reCreateSecret(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const webhook = yield webhook_model_1.default.findById(req.params.id);
            if (!webhook)
                return res.status(404).json({
                    message: "webhook not found"
                });
            webhook.secret = (0, crypt_1.createSha256Hash)((0, crypto_1.randomUUID)());
            yield webhook.save();
            return res.json(webhook);
        }
        catch (error) {
            logger_1.default.error(error.message);
            return res.status(400).json({
                message: "Secret recreation failed",
            });
        }
    });
}
exports.reCreateSecret = reCreateSecret;
function deleteWebhook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const webhook = yield webhook_model_1.default.findById(req.params.id);
            if (!webhook)
                return res.status(404).json({
                    message: "webhook not found"
                });
            yield webhook.delete();
            return res.json({
                message: "Webhook deleted",
            });
        }
        catch (error) {
            logger_1.default.error(error.message);
            return res.status(400).json({
                message: "Webhook deletion Failed",
            });
        }
    });
}
exports.deleteWebhook = deleteWebhook;
function webhookRequests(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // @ts-ignore
            const orgFilter = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.organisation_id) === null ? {
                organisationId: (_b = req.query.organisationId) !== null && _b !== void 0 ? _b : undefined,
            } :
                { organisationId: req.user.organisation_id };
            const webhookRequests = yield webhook_request_model_1.default.paginate(Object.assign(Object.assign({}, filterRequest(req.query)), lodash_1.default.omitBy(orgFilter, lodash_1.default.isUndefined)), {
                sort: { _id: -1 },
                limit: Number(req.query.limit || 50),
                page: Number(req.query.page || 1),
                populate: [
                    { path: 'organisation', select: 'name' },
                    { path: 'webhook', model: webhook_model_1.default },
                ]
            });
            return res.json(webhookRequests);
        }
        catch (error) {
            logger_1.default.error(error.message);
            return res.status(400).json({
                message: "Webhook deletion Failed",
            });
        }
    });
}
exports.webhookRequests = webhookRequests;
function retryWebhook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const webhookRequest = yield webhook_request_model_1.default.findById(req.params.id);
            if (!webhookRequest)
                return res.status(404).json({
                    mesage: "Webhook Request Not found"
                });
            yield queue_1.webhookQueue.add('sendNotification', {
                tranactionId: webhookRequest.journalId,
                webhookId: webhookRequest.webhookId,
                organisationId: webhookRequest.organisationId,
                retry: true,
            });
            return res.json(webhookRequests);
        }
        catch (error) {
            logger_1.default.error(error.message);
            return res.status(400).json({
                message: "Webhook deletion Failed",
            });
        }
    });
}
exports.retryWebhook = retryWebhook;
function filterGen({ q }) {
    let query = {};
    if (q !== undefined) {
        query = Object.assign(Object.assign({}, query), { $or: [
                {
                    name: RegExp(`^${q}`, 'i'),
                },
                {
                    url: RegExp(`^${q}`, 'i'),
                },
            ] });
    }
    return query;
}
function filterRequest({ q, organisation, webhook }) {
    let query = {};
    if (q !== undefined) {
        query = Object.assign(Object.assign({}, query), { $or: [
                {
                    terminalId: RegExp(`^${q}`, 'i'),
                },
                {
                    "payload.merchantName": RegExp(`^${q}`, 'i'),
                },
            ] });
    }
    if (webhook === null || webhook === void 0 ? void 0 : webhook.length) {
        query = Object.assign(Object.assign({}, query), { webhookId: organisation });
    }
    return query;
}
//# sourceMappingURL=webhook.controller.js.map