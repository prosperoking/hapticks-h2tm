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
exports.deleteUser = exports.getAllPermissions = exports.updateUser = exports.addUser = exports.index = void 0;
const user_model_1 = __importDefault(require("../db/models/user.model"));
const logger_1 = __importDefault(require("../helpers/logger"));
const lodash_1 = __importDefault(require("lodash"));
const permissions_1 = require("../config/permissions");
function index(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // @ts-ignore
            const orgFilter = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.organisationId) === null
                ? {
                    organisation_id: req.query.organisationId,
                }
                : //@ts-ingore
                    { organisation_id: (_b = req.user.organisation_id) !== null && _b !== void 0 ? _b : undefined };
            const webhooks = yield user_model_1.default.paginate(Object.assign(Object.assign({}, filterGen(req.query)), lodash_1.default.omitBy(orgFilter, lodash_1.default.isUndefined)), {
                sort: { name: -1 },
                limit: Number(req.query.limit || 50),
                page: Number(req.query.page || 1),
                populate: [{ path: "organisation", select: "name" }],
            });
            return res.json(webhooks);
        }
        catch (error) {
            logger_1.default.error(error.message);
            res.status(400).json({
                message: "An error occured",
            });
        }
    });
}
exports.index = index;
function addUser(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { body } = req;
            // @ts-ignore
            const orgFilter = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.organisation_id) === null
                ? {}
                : //@ts-ingore
                    { organisationId: req.user.organisation_id };
            const user = user_model_1.default.create(Object.assign(Object.assign({}, lodash_1.default.pick(body, ['email', 'fullname', 'organisation_id', 'password', 'permissions', 'username'])), orgFilter));
            return res.json(user);
        }
        catch (error) {
            logger_1.default.error(error);
            return res.status(400).json({
                message: "failed to create user",
            });
        }
    });
}
exports.addUser = addUser;
function updateUser(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // @ts-ignore
            const orgFilter = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.organisationId) === null
                ? {
                    organisationId: req.query.organisationId,
                }
                : //@ts-ingore
                    { organisationId: req.user.organisation_id };
            const user = yield user_model_1.default.findOne(Object.assign({ _id: req.params.id }, orgFilter));
            if (!user)
                return res.status(404).json({
                    message: "webhook not found",
                });
            const { name, organisation_id } = req.body;
            user.organisation_id = organisation_id;
            user.fullname = name;
            yield user.save();
            res.json(user);
        }
        catch (error) {
            logger_1.default.error(error.message);
            return res.status(400).json({
                message: "user Update failed",
            });
        }
    });
}
exports.updateUser = updateUser;
function getAllPermissions(req, res) {
    return res.json({
        data: permissions_1.APP_PERMISSIONS
    });
}
exports.getAllPermissions = getAllPermissions;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const webhook = yield user_model_1.default.findById(req.params.id);
            if (!webhook)
                return res.status(404).json({
                    message: "user not found",
                });
            yield webhook.delete();
            return res.json({
                message: "user deleted",
            });
        }
        catch (error) {
            logger_1.default.error(error.message);
            return res.status(400).json({
                message: "user deletion Failed",
            });
        }
    });
}
exports.deleteUser = deleteUser;
function filterGen({ q }) {
    let query = {};
    if (!lodash_1.default.isEmpty(q)) {
        query = Object.assign(Object.assign({}, query), { $or: [
                {
                    name: RegExp(`^${q}`, "i"),
                },
                {
                    username: RegExp(`^${q}`, "i"),
                },
                {
                    email: RegExp(`^${q}`, "i"),
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
                    terminalId: RegExp(`^${q}`, "i"),
                },
                {
                    "payload.merchantName": RegExp(`^${q}`, "i"),
                },
            ] });
    }
    if (webhook === null || webhook === void 0 ? void 0 : webhook.length) {
        query = Object.assign(Object.assign({}, query), { webhookId: organisation });
    }
    return query;
}
//# sourceMappingURL=user.controller.js.map