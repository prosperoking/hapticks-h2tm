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
const ptspProfile_model_1 = __importDefault(require("../db/models/ptspProfile.model"));
const organisation_model_1 = __importDefault(require("../db/models/organisation.model"));
const terminalBulkUploadValidator = (0, index_1.createValidatedRequest)((0, schema_1.checkSchema)({
    organisationId: {
        in: ['body'],
        optional: true,
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (!organisation_model_1.default.findById(value))
                        return Promise.reject();
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
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (!(yield ptspProfile_model_1.default.findById(value)))
                        return Promise.reject();
                    return true;
                }
                catch (error) {
                    return false;
                }
            }),
            errorMessage: "Profile not Found",
            bail: true,
        },
        notEmpty: true
    },
    terminals: {
        isArray: {
            bail: true,
            options: {
                min: 1,
            }
        }
    },
    "terminals.*.terminalId": {
        in: ['body'],
        trim: true,
        notEmpty: true,
        isLength: {
            options: {
                max: 8,
                min: 8,
            },
        },
        custom: {
            options: (terminalId, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const terminal = yield terminal_model_1.default.findOne({ terminalId: terminalId });
                    if (terminal)
                        return Promise.reject("Exists");
                    return true;
                }
                catch (error) {
                    return false;
                }
            }),
            errorMessage: "Terminal Id already exists",
        }
    },
    "terminals.*.serialNo": {
        in: ['body'],
        trim: true,
        notEmpty: true,
        custom: {
            options: (serialNo, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const index = path.split('.')[0].split('[')[1].split(']')[0];
                    const accData = req.body.terminals[index];
                    const terminalSerial = yield terminal_model_1.default.findOne({ serialNo, deviceModel: accData.deviceModel, brand: accData.brand });
                    if (terminalSerial)
                        return Promise.reject("Exists");
                    return true;
                }
                catch (error) {
                    return false;
                }
            }),
            errorMessage: "Terminal Exists",
        }
    },
    "terminals.*.brand": {
        in: ['body'],
        trim: true,
        notEmpty: true
    },
    "terminals.*.deviceModel": {
        in: ['body'],
        trim: true,
        notEmpty: true
    },
    "terminals.*.iswTid": {
        in: ['body'],
        trim: true,
        custom: {
            options: (iswTid, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                if (yield terminal_model_1.default.findOne({ iswTid }))
                    throw Error("Exists");
            }),
            errorMessage: "IswTid alread taken",
        }
    },
    "terminals.*.iswUniqueId": {
        in: ['body'],
        trim: true,
        custom: {
            options: (iswUniqueId, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                if (yield terminal_model_1.default.findOne({ iswUniqueId }))
                    throw Error("Exists");
            }),
            errorMessage: "Isw UniqueId taken",
        }
    },
}));
exports.default = terminalBulkUploadValidator;
//# sourceMappingURL=terminalBulkUpload.validator.js.map