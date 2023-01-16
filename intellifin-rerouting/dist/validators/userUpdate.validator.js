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
const user_model_1 = __importDefault(require("../db/models/user.model"));
const organisation_model_1 = __importDefault(require("../db/models/organisation.model"));
const profileUpdateValidator = (0, index_1.createValidatedRequest)((0, schema_1.checkSchema)({
    id: {
        in: ['params'],
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (!user_model_1.default.findById(value))
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
    username: {
        in: ['body'],
        trim: true,
        optional: {
            options: {
                nullable: true
            }
        },
    },
    password: {
        in: ['body'],
        trim: true,
        optional: {
            options: {
                nullable: true
            }
        },
    },
    email: {
        in: ['body'],
        trim: true,
        isPort: true,
    },
    updatePassword: {
        in: ['body'],
        toBoolean: true,
    },
    fullname: {
        in: ['body'],
        trim: true,
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
    role: {
        in: ['body'],
        trim: true,
        optional: true,
        custom: {
            options: (value, { req, location, path }) => __awaiter(void 0, void 0, void 0, function* () {
                if (!(value === null || value === void 0 ? void 0 : value.length))
                    return;
                if (!['user', 'admin'].includes(value))
                    return Promise.reject();
            })
        },
        customSanitizer: {
            options: (value, { req, location, path }) => {
                if (!(value === null || value === void 0 ? void 0 : value.length))
                    return;
                return value.toLowerCase();
            }
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
}));
exports.default = profileUpdateValidator;
//# sourceMappingURL=userUpdate.validator.js.map