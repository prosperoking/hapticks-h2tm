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
const organisation_model_1 = __importDefault(require("../db/models/organisation.model"));
const ptspProfile_model_1 = __importDefault(require("../db/models/ptspProfile.model"));
const groupTid_model_1 = __importDefault(require("../db/models/groupTid.model"));
const groupTidCreateValidator = (0, index_1.createValidatedRequest)((0, schema_1.checkSchema)({
    terminalId: {
        in: ['body'],
        trim: true,
        notEmpty: true,
        custom: {
            options: (terminalId, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                if (yield groupTid_model_1.default.findOne({ terminalId: terminalId }))
                    return Promise.reject();
            }),
            errorMessage: "Terminal Id exists",
        }
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
    iswTid: {
        in: ['body'],
        trim: true,
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
}));
exports.default = groupTidCreateValidator;
//# sourceMappingURL=grouptid.create.validator.js.map