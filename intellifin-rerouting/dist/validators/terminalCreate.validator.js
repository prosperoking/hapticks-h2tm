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
const express_validator_1 = require("express-validator");
const groupTid_model_1 = __importDefault(require("../db/models/groupTid.model"));
const terminalCreateValidator = (0, index_1.createValidatedRequest)((0, schema_1.checkSchema)({
    terminalId: {
        in: ['body'],
        trim: true,
        custom: {
            options: (terminalId, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                try {
                    if (!(yield terminal_model_1.default.findOne({ terminalId: terminalId })) &&
                        !((_a = req.body.terminalGroupId) === null || _a === void 0 ? void 0 : _a.length))
                        return false;
                    return true;
                }
                catch (error) {
                    return false;
                }
            }),
            errorMessage: "Invalid/Existing Terminal ID",
        }
    },
    terminalGroupId: {
        in: ['body'],
        optional: true,
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                if (!(value === null || value === void 0 ? void 0 : value.length))
                    return;
                if (!(yield groupTid_model_1.default.findById(value)))
                    return Promise.reject();
            }),
            errorMessage: "Group Tid not Found",
            bail: true,
        }
    },
    serialNo: {
        in: ['body'],
        trim: true,
        notEmpty: true,
        custom: {
            options: (serialNo, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                if (yield terminal_model_1.default.findOne({ serialNo }))
                    return Promise.reject();
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
    hydrogenTID: {
        in: ['body'],
        trim: true,
    },
    habariTID: {
        in: ['body'],
        trim: true,
    },
    iswISOTID: {
        in: ['body'],
        trim: true,
    },
    organisationId: {
        in: ['body'],
        optional: true,
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                if (!(value === null || value === void 0 ? void 0 : value.length))
                    return;
                if (!(yield organisation_model_1.default.findById(value)))
                    return Promise.reject();
            }),
            errorMessage: "Organisation not Found",
            bail: true,
        }
    },
    groupTidId: {
        in: ['body'],
        optional: true,
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                if (!(value === null || value === void 0 ? void 0 : value.length))
                    return;
                if (!(yield groupTid_model_1.default.findById(value)))
                    return Promise.reject();
            }),
            errorMessage: "Group Tid not Found",
            bail: true,
        }
    },
    profileId: {
        in: ['body'],
        notEmpty: true,
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                if (!(yield ptspProfile_model_1.default.findById(value)))
                    return Promise.reject();
            }),
            errorMessage: "Profile not Found",
            bail: true,
        },
    },
    terminalLocation: {
        in: ['body'],
        isObject: true,
    },
    "terminalLocation.name": {
        in: ["body"],
        exists: {
            if: (0, express_validator_1.body)("terminalLocation").exists({ checkNull: false })
        },
        trim: true,
        toUpperCase: true,
        isLength: {
            if: (value) => value.length,
            errorMessage: "Name must be less than or equal to  22",
            options: {
                max: 22,
                min: 3
            }
        }
    },
    "terminalLocation.city": {
        in: ["body"],
        exists: {
            if: (0, express_validator_1.body)("terminalLocation").exists({ checkNull: false })
        },
        trim: true,
        toUpperCase: true,
        isLength: {
            if: (value) => value.length,
            errorMessage: "City must be less than or equal to  12",
            options: {
                max: 12,
                min: 3
            }
        }
    },
    "terminalLocation.stateCountry": {
        in: ["body"],
        exists: {
            if: (0, express_validator_1.body)("terminalLocation").exists({ checkNull: false })
        },
        trim: true,
        toUpperCase: true,
        isLength: {
            if: (value) => value.length,
            errorMessage: "State/Country must be exactly of length 4",
            options: {
                max: 4,
                min: 4,
            }
        }
    },
}));
exports.default = terminalCreateValidator;
//# sourceMappingURL=terminalCreate.validator.js.map