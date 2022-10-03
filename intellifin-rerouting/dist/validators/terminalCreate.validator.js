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
const terminal_model_1 = __importDefault(require("../db/models/terminal.model"));
const organisation_model_1 = __importDefault(require("../db/models/organisation.model"));
const ptspProfile_model_1 = __importDefault(require("../db/models/ptspProfile.model"));
const terminalCreateValidator = (0, index_1.createValidatedRequest)((0, schema_1.checkSchema)({
    terminalId: {
        in: ['body'],
        trim: true,
        notEmpty: true,
        custom: {
            options: (terminalId, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (!terminal_model_1.default.findOne({ serialNo: terminalId }))
                        return false;
                    return true;
                }
                catch (error) {
                    return false;
                }
            }),
            errorMessage: "Terminal",
        }
    },
    serialNo: {
        in: ['body'],
        trim: true,
        notEmpty: true,
        custom: {
            options: (serialNo, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (terminal_model_1.default.findOne({ serialNo }))
                        return false;
                    return true;
                }
                catch (error) {
                    return false;
                }
            }),
            errorMessage: "Terminal not Found",
        }
    },
    brand: {
        in: ['body'],
        trim: true,
        notEmpty: true
    },
    deviceModel: {
        in: ['body'],
        trim: true,
        notEmpty: true
    },
    iswTid: {
        in: ['body'],
        trim: true,
    },
    organisationId: {
        in: ['body'],
        optional: true,
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (!organisation_model_1.default.findById(value))
                        return false;
                    return true;
                }
                catch (error) {
                    return false;
                }
            }),
            errorMessage: "Organisation not Found",
            bail: true,
        }
    },
    profileId: {
        in: ['body'],
        notEmpty: true,
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (!ptspProfile_model_1.default.findById(value))
                        return false;
                    return true;
                }
                catch (error) {
                    return false;
                }
            }),
            errorMessage: "Profile not Found",
            bail: true,
        },
    }
}));
exports.default = terminalCreateValidator;
//# sourceMappingURL=terminalCreate.validator.js.map