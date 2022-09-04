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
const ptspProfile_model_1 = __importDefault(require("../db/models/ptspProfile.model"));
const organisation_model_1 = __importDefault(require("../db/models/organisation.model"));
const profileUpdateValidator = (0, index_1.createValidatedRequest)((0, schema_1.checkSchema)({
    id: {
        in: ['params'],
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
            errorMessage: "Terminal not Found"
        }
    },
    componentKey1: {
        in: ['body'],
        trim: true,
        optional: {
            options: {
                nullable: false
            }
        },
    },
    isoHost: {
        in: ['body'],
        trim: true,
        isIP: true,
    },
    isoPort: {
        in: ['body'],
        trim: true,
        isPort: true,
    },
    isSSl: {
        in: ['body'],
        toBoolean: true,
    },
    iswDestinationAccount: {
        in: ['body'],
        trim: true,
    },
    iswInstitutionCode: {
        in: ['body'],
        trim: true,
    },
    iswMid: {
        in: ['body'],
        trim: true,
        isLength: {
            errorMessage: "invalid MID",
            options: {
                min: 15,
                max: 15
            }
        }
    },
    iswSwitchAmount: {
        in: ['body'],
        trim: true,
    },
    title: {
        in: ['body'],
        trim: true,
    },
    organisationId: {
        in: ['body'],
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    console.log("Param ID: ", value);
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
}));
exports.default = profileUpdateValidator;
//# sourceMappingURL=profileUpdate.validator.js.map