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
const webHookUpdateValidator = (0, index_1.createValidatedRequest)((0, schema_1.checkSchema)({
    urls: {
        in: ['body'],
        isArray: true,
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                if (!(yield webhook_model_1.default.find({
                    urls: value,
                    organisationId: ((_a = req.body.organisationId) === null || _a === void 0 ? void 0 : _a.length) ? req.body.organisationId : undefined,
                    _id: { $ne: req.params.id },
                })))
                    return Promise.reject();
            }),
            errorMessage: "Webhook Already Registered for Organisation",
            bail: true,
        }
    },
    "urls.*": {
        // in: ['body'],
        trim: true,
        isURL: {
            errorMessage: "Invalid Url",
        },
    },
    name: {
        in: ['body'],
        toUpperCase: true,
        trim: true,
    },
}));
exports.default = webHookUpdateValidator;
//# sourceMappingURL=webhookUpdate.validator.js.map