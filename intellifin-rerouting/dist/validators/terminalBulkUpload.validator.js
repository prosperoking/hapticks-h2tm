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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const express_validator_1 = require("express-validator");
const terminal_model_1 = __importDefault(require("../db/models/terminal.model"));
const ptspProfile_model_1 = __importDefault(require("../db/models/ptspProfile.model"));
const organisation_model_1 = __importDefault(require("../db/models/organisation.model"));
const statesIso_1 = __importDefault(require("../helpers/statesIso"));
const terminalBulkUploadValidator = (0, index_1.createValidatedRequest)((0, express_validator_1.checkSchema)({
    organisationId: {
        in: ["body"],
        optional: true,
        custom: {
            options: (value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req, location, path }) {
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
        },
    },
    profileId: {
        in: ["body"],
        custom: {
            options: (value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req, location, path }) {
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
        notEmpty: true,
    },
    terminals: {
        isArray: {
            bail: true,
            options: {
                min: 1,
            },
        },
    },
    "terminals.*.terminalId": {
        in: ["body"],
        trim: true,
        notEmpty: true,
        isLength: {
            options: {
                max: 8,
                min: 8,
            },
        },
        customSanitizer: {
            options: (value) => value.length ? value.toUpperCase() : null,
        },
        custom: {
            options: (terminalId_1, _a) => __awaiter(void 0, [terminalId_1, _a], void 0, function* (terminalId, { req, location, path }) {
                try {
                    const terminal = yield terminal_model_1.default.findOne({
                        terminalId: terminalId,
                    });
                    if (terminal)
                        return Promise.reject("Exists");
                    return true;
                }
                catch (error) {
                    return false;
                }
            }),
            errorMessage: "Terminal Id already exists",
        },
    },
    "terminals.*.threeLineTid": {
        in: ["body"],
        trim: true,
        notEmpty: true,
        isLength: {
            options: {
                max: 8,
                min: 8,
            },
        },
        customSanitizer: {
            options: (value) => value.length ? value.toUpperCase() : null,
        },
        custom: {
            options: (threelineTid_1, _a) => __awaiter(void 0, [threelineTid_1, _a], void 0, function* (threelineTid, { req, location, path }) {
                try {
                    const terminal = yield terminal_model_1.default.findOne({
                        threeLineTid: threelineTid,
                    });
                    if (terminal)
                        return Promise.reject("Exists");
                }
                catch (error) {
                    return false;
                }
            }),
            errorMessage: "ThreeLineTid already exists",
        },
    },
    "terminals.*.serialNo": {
        in: ["body"],
        trim: true,
        notEmpty: true,
        custom: {
            options: (serialNo_1, _a) => __awaiter(void 0, [serialNo_1, _a], void 0, function* (serialNo, { req, location, path }) {
                try {
                    const index = path.split(".")[0].split("[")[1].split("]")[0];
                    const accData = req.body.terminals[index];
                    const terminalSerial = yield terminal_model_1.default.findOne({
                        serialNo,
                        deviceModel: accData.deviceModel,
                        brand: accData.brand,
                    });
                    if (terminalSerial)
                        return Promise.reject("Exists");
                    return true;
                }
                catch (error) {
                    return false;
                }
            }),
            errorMessage: "Terminal Exists",
        },
    },
    "terminals.*.brand": {
        in: ["body"],
        trim: true,
        notEmpty: true,
    },
    "terminals.*.deviceModel": {
        in: ["body"],
        trim: true,
        notEmpty: true,
    },
    "terminals.*.iswTid": {
        in: ["body"],
        trim: true,
        optional: true,
        customSanitizer: {
            options: (value) => value.length ? value.toUpperCase() : null,
        },
        custom: {
            options: (iswTid, _a) => __awaiter(void 0, void 0, void 0, function* () {
                var { req, location, path } = _a, others = __rest(_a, ["req", "location", "path"]);
                if (iswTid && (yield terminal_model_1.default.findOne({ iswTid })))
                    throw Error("Exists");
            }),
            errorMessage: "Kimono already taken",
        },
    },
    "terminals.*.iswISOTID": {
        in: ["body"],
        trim: true,
        optional: true,
        customSanitizer: {
            options: (value) => value.length ? value.toUpperCase() : null,
        },
        custom: {
            options: (iswISOTID_1, _a) => __awaiter(void 0, [iswISOTID_1, _a], void 0, function* (iswISOTID, { req, location, path }) {
                if (yield terminal_model_1.default.findOne({ iswISOTID }))
                    throw Error("Exists");
            }),
            errorMessage: "iswISOTID already taken",
        },
    },
    "terminals.*.hydrogenTID": {
        in: ["body"],
        trim: true,
        optional: true,
        customSanitizer: {
            options: (value) => value.length ? value.toUpperCase() : null,
        },
        custom: {
            options: (hydrogenTID_1, _a) => __awaiter(void 0, [hydrogenTID_1, _a], void 0, function* (hydrogenTID, { req, location, path }) {
                if (yield terminal_model_1.default.findOne({ hydrogenTID }))
                    throw Error("Exists");
            }),
            errorMessage: "hydrogenTID already taken",
        },
    },
    "terminals.*.zoneTID": {
        in: ["body"],
        trim: true,
        optional: true,
        customSanitizer: {
            options: (value) => value.length ? value.toUpperCase() : null,
        },
        custom: {
            options: (zoneTID_1, _a) => __awaiter(void 0, [zoneTID_1, _a], void 0, function* (zoneTID, { req, location, path }) {
                if (yield terminal_model_1.default.findOne({ zoneTID }))
                    throw Error("Exists");
            }),
            errorMessage: "zoneTID already taken",
        },
    },
    "terminals.*.julianaTID": {
        in: ["body"],
        trim: true,
        optional: true,
        customSanitizer: {
            options: (value) => value.length ? value.toUpperCase() : null,
        },
        custom: {
            options: (julianaTID_1, _a) => __awaiter(void 0, [julianaTID_1, _a], void 0, function* (julianaTID, { req, location, path }) {
                if (yield terminal_model_1.default.findOne({ julianaTID }))
                    throw Error("Exists");
            }),
            errorMessage: "julianaTID already taken",
        },
    },
    "terminals.*.iswUniqueId": {
        in: ["body"],
        trim: true,
        customSanitizer: {
            options: (value) => value.length ? value.toUpperCase() : null,
        },
        custom: {
            options: (iswUniqueId_1, _a) => __awaiter(void 0, [iswUniqueId_1, _a], void 0, function* (iswUniqueId, { req, location, path }) {
                if (yield terminal_model_1.default.findOne({ iswUniqueId }))
                    throw Error("Exists");
            }),
            errorMessage: "Isw UniqueId  already taken",
        },
    },
    "terminals.*.address": {
        in: ["body"],
        trim: true,
        isLength: {
            options: {
                max: 26,
            },
        },
        custom: {
            options: (address_1, _a) => __awaiter(void 0, [address_1, _a], void 0, function* (address, { req, location, path }) {
                if (address.length > 26)
                    throw Error("Exists");
            }),
            errorMessage: "Address too long",
        },
    },
    "terminals.*.city": {
        in: ["body"],
        trim: true,
    },
    "terminals.*.state": {
        in: ["body"],
        trim: true,
        isLength: {
            options: {
                max: 10,
            }
        },
        custom: {
            options: (state_1, _a) => __awaiter(void 0, [state_1, _a], void 0, function* (state, { req, location, path }) {
                const states = statesIso_1.default.map(s => s.code);
                if (!states.includes(state.toUpperCase()))
                    return Promise.reject();
                return true;
            }),
            errorMessage: "Invalid State",
        }
    },
}));
exports.default = terminalBulkUploadValidator;
//# sourceMappingURL=terminalBulkUpload.validator.js.map