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
const profileCreateValidator = (0, index_1.createValidatedRequest)((0, schema_1.checkSchema)({
    componentKey1: {
        in: ['body'],
        trim: true,
        optional: {
            options: {
                nullable: true
            }
        },
    },
    isoHost: {
        in: ['body'],
        trim: true,
        optional: {
            options: {
                nullable: true,
            }
        },
        isIP: true,
    },
    allowProcessorOverride: {
        in: ['body'],
        isBoolean: true,
        customSanitizer: {
            options: value => ['true', 'false', '1', '0'].includes(String(value)
                .toLowerCase())
        },
        optional: {
            options: {
                nullable: true,
            }
        },
    },
    isoPort: {
        in: ['body'],
        trim: true,
        isPort: true,
        optional: {
            options: {
                nullable: true,
            }
        },
    },
    isSSl: {
        in: ['body'],
        toBoolean: true,
        optional: {
            options: {
                nullable: true,
            }
        },
    },
    iswDestinationAccount: {
        in: ['body'],
        trim: true,
        optional: true,
    },
    iswInstitutionCode: {
        in: ['body'],
        trim: true,
        optional: true,
    },
    iswMid: {
        in: ['body'],
        trim: true,
        optional: true,
        isLength: {
            errorMessage: "invalid MID",
            if: (value) => value === null || value === void 0 ? void 0 : value.length,
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
    type: {
        in: ['body'],
        matches: {
            options: [/\b(?:generic|intelliffin|3line)\b/],
            errorMessage: "Invalid Profile type",
        }
    },
    webhookId: {
        in: ['body'],
        optional: true,
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                if (!(value === null || value === void 0 ? void 0 : value.length))
                    return;
                if (!(yield webhook_model_1.default.findById(value)))
                    return Promise.reject();
            }),
            errorMessage: "Webhook not found",
            bail: true,
        }
    },
    processorSettings: {
        in: ['body'],
        optional: true,
        isArray: true,
    },
    "processorSettings.*.processor": {
        in: ['body'],
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                return ['nibss', 'kimono', 'blueSalt'].includes(value);
            })
        }
    },
    "processorSettings.*.minAmount": {
        in: ['body'],
        isNumeric: true,
        exists: true,
    },
    "processorSettings.*.maxAmount": {
        in: ['body'],
        isNumeric: true,
        exists: true,
    }
}));
exports.default = profileCreateValidator;
//# sourceMappingURL=profileCreate.validator.js.map