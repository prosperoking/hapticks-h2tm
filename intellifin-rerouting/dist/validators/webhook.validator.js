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
const index_1 = require("./index");
const schema_1 = require("express-validator/src/middlewares/schema");
const webhook_model_1 = __importDefault(require("../db/models/webhook.model"));
const organisation_model_1 = __importDefault(require("../db/models/organisation.model"));
const webHookValidator = (0, index_1.createValidatedRequest)((0, schema_1.checkSchema)({
    organisationId: {
        in: ['body'],
        optional: true,
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                if ((value === null || value === void 0 ? void 0 : value.length) &&
                    !(yield organisation_model_1.default.findById(value)))
                    return Promise.reject();
            }),
            errorMessage: "Organisation not Found",
            bail: true,
        }
    },
    url: {
        in: ['body'],
        trim: true,
        isURL: true,
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                if (!(yield webhook_model_1.default.find({
                    url: value,
                    organisationId: ((_a = req.body.organisationId) === null || _a === void 0 ? void 0 : _a.length) ? req.body.organisationId : undefined,
                })))
                    return Promise.reject();
            }),
            errorMessage: "Webhook Already Registered for Organisation",
            bail: true,
        }
    },
    name: {
        in: ['body'],
        toUpperCase: true,
        trim: true,
    },
}));
exports.default = webHookValidator;
//# sourceMappingURL=webhook.validator.js.map