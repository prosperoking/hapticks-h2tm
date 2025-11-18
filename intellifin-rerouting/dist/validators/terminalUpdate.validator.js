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
const terminal_model_1 = __importDefault(require("../db/models/terminal.model"));
const ptspProfile_model_1 = __importDefault(require("../db/models/ptspProfile.model"));
const organisation_model_1 = __importDefault(require("../db/models/organisation.model"));
const express_validator_1 = require("express-validator");
const groupTid_model_1 = __importDefault(require("../db/models/groupTid.model"));
const terminalUpdateValidator = (0, index_1.createValidatedRequest)((0, express_validator_1.checkSchema)({
    id: {
        in: ['params'],
        custom: {
            options: (value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req, location, path }) {
                try {
                    if (!(yield terminal_model_1.default.findById(value)))
                        return Promise.reject();
                    return true;
                }
                catch (error) {
                    return false;
                }
            }),
            errorMessage: "Terminal not Found",
            bail: true,
        }
    },
    terminalId: {
        in: ['body'],
        trim: true,
        custom: {
            options: (terminalId_1, _a) => __awaiter(void 0, [terminalId_1, _a], void 0, function* (terminalId, { req, location, path }) {
                var _b;
                try {
                    if (!(yield terminal_model_1.default.findOne({ terminalId: terminalId, _id: { $ne: req.body._id } })) &&
                        !((_b = req.body.terminalGroupId) === null || _b === void 0 ? void 0 : _b.length))
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
            options: (value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req, location, path }) {
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
            options: (serialNo_1, _a) => __awaiter(void 0, [serialNo_1, _a], void 0, function* (serialNo, { req, location, path }) {
                try {
                    if (yield terminal_model_1.default.findOne({ serialNo }))
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
    zoneTID: {
        in: ['body'],
        trim: true,
    },
    julianaTID: {
        in: ['body'],
        trim: true,
    },
    organisationId: {
        in: ['body'],
        optional: true,
        custom: {
            options: (value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req, location, path }) {
                try {
                    if (value === null)
                        return Promise.resolve();
                    if (value.length && !(yield organisation_model_1.default.findById(value)))
                        return Promise.reject();
                    return true;
                }
                catch (error) {
                    return Promise.reject();
                }
            }),
            errorMessage: "Organisation not Found",
            bail: true,
        }
    },
    profileId: {
        in: ['body'],
        custom: {
            options: (value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req, location, path }) {
                try {
                    console.log("Param ID: ", value);
                    if (!(yield ptspProfile_model_1.default.findById(value)))
                        return Promise.reject();
                    return true;
                }
                catch (error) {
                    return Promise.reject();
                }
            }),
            errorMessage: "Profile not Found",
            bail: true,
        },
        notEmpty: true
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
exports.default = terminalUpdateValidator;
//# sourceMappingURL=terminalUpdate.validator.js.map