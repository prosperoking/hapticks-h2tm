"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const mongoose = __importStar(require("mongoose"));
const crypt_1 = require("../../helpers/crypt");
const ptspProfileSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        set: (value) => value.toUpperCase()
    },
    isoHost: {
        type: String,
        default: null,
    },
    isoPort: {
        type: String,
        default: null,
    },
    isSSL: {
        type: Boolean,
        default: false,
    },
    componentKey1: {
        type: String,
        default: null
    },
    componentKey2: {
        type: String,
        default: null,
    },
    iswSwitchAmount: {
        type: Number,
        default: null,
    },
    iswMid: {
        type: String,
        default: null,
    },
    iswInstitutionCode: {
        type: String,
        default: null,
    },
    iswDestinationAccount: {
        type: String,
        default: null,
    },
    allowProcessorOverride: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'generic',
    },
    organisationId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        default: null,
    },
    threeLineKey: {
        type: String,
        default: null,
    },
    threeLineHost: {
        type: String,
        default: null,
    },
    threeLinePort: {
        type: String,
        default: null,
    },
    threeLineHostSSL: {
        type: Boolean,
        default: null,
    },
    hasthreelineSupport: {
        type: Boolean,
        default: false,
    },
    webhookId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        default: null,
    },
    blueSaltTID: {
        type: String,
        default: null,
    },
    blueSaltKey: {
        type: String,
        default: null,
        set: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.encrypt)(value) : null,
        get: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.decrypt)(value) : null,
    },
    blueSaltEnv: {
        type: String,
        default: null,
    },
    iswISOConfig: {
        zmk: {
            type: String,
            set: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.encrypt)(value) : null,
            get: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.decrypt)(value) : null,
        },
        host: {
            type: String,
        },
        port: {
            type: Number,
        },
        ssl: {
            type: Boolean,
        },
        zpk: {
            type: String,
            default: null,
            set: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.encrypt)(value) : null,
            get: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.decrypt)(value) : null,
        },
        lastRotate: {
            type: Date,
            default: null
        },
        mid: {
            type: String,
        },
        ett: {
            type: String,
        },
        mcc: {
            type: String,
        },
        kcv: {
            type: String,
            default: null,
        },
        rid: {
            type: String,
            default: null,
            set: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.encrypt)(value) : null,
            get: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.decrypt)(value) : null,
        },
        oRid: {
            type: String,
            default: null,
            set: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.encrypt)(value) : null,
            get: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.decrypt)(value) : null,
        },
        settlementAccount: {
            type: String,
            default: null,
            set: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.encrypt)(value) : null,
            get: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.decrypt)(value) : null,
        },
        tidPrefix: {
            type: String,
            default: null,
            maxlength: 4,
            minlength: 4
        },
    },
    hydrogenConfig: {
        zmk: {
            type: String,
            set: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.encrypt)(value) : null,
            get: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.decrypt)(value) : null,
        },
        host: {
            type: String,
        },
        port: {
            type: Number,
        },
        ssl: {
            type: Boolean,
        },
        zpk: {
            type: String,
            default: null,
            set: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.encrypt)(value) : null,
            get: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.decrypt)(value) : null,
        },
        kcv: {
            type: String,
            default: null,
        },
        lastRotate: {
            type: Date,
            default: null
        },
        mid: {
            type: String,
        },
        mcc: {
            type: Number,
        },
        acqId: {
            type: String,
        },
        tidPrefix: {
            type: String,
            default: null,
            maxlength: 4,
            minlength: 4
        },
    },
    habariConfig: {
        zmk: {
            type: String,
            set: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.encrypt)(value) : null,
            get: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.decrypt)(value) : null,
        },
        host: {
            type: String,
        },
        port: {
            type: Number,
        },
        ssl: {
            type: Boolean,
        },
        zpk: {
            type: String,
            default: null,
            set: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.encrypt)(value) : null,
            get: (value) => (value !== null && (value === null || value === void 0 ? void 0 : value.length)) ? (0, crypt_1.decrypt)(value) : null,
        },
        kcv: {
            type: String,
            default: null,
        },
        lastRotate: {
            type: Date,
            default: null
        },
        mid: {
            type: String,
        },
        mcc: {
            type: Number,
        },
        acqId: {
            type: String,
        },
        tidPrefix: {
            type: String,
            default: null,
            maxlength: 4,
            minlength: 4
        },
    },
    processorSettings: [mongoose_1.SchemaTypes.Mixed],
    linkedProfileId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        default: null
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true,
    },
});
ptspProfileSchema.virtual('terminals', {
    ref: 'terminal',
    localField: '_id',
    foreignField: 'profileId',
});
ptspProfileSchema.virtual('isInteliffin').get(function () {
    return this.type === 'intelliffin';
});
ptspProfileSchema.virtual('organisation', {
    ref: 'organisationProfile',
    localField: 'organisationId',
    foreignField: '_id',
    justOne: true,
});
ptspProfileSchema.virtual('terminals_count', {
    ref: 'terminal',
    localField: '_id',
    foreignField: 'profileId',
    count: true,
});
ptspProfileSchema.virtual('webhook', {
    ref: 'webhooklistener',
    localField: 'webhookId',
    foreignField: '_id',
    justOne: true,
});
ptspProfileSchema.virtual('linkedProfile', {
    ref: 'ptspProfile',
    localField: 'linkedProfileId',
    foreignField: '_id',
    justOne: true,
});
ptspProfileSchema.virtual('iswISOEnabled').get(function () {
    var _a, _b;
    return ((_b = (_a = this.iswISOConfig) === null || _a === void 0 ? void 0 : _a.host) === null || _b === void 0 ? void 0 : _b.length) > 0;
});
ptspProfileSchema.virtual('hydrogenEnabled').get(function () {
    var _a, _b;
    return ((_b = (_a = this.hydrogenConfig) === null || _a === void 0 ? void 0 : _a.host) === null || _b === void 0 ? void 0 : _b.length) > 0;
});
ptspProfileSchema.virtual('habariEnabled').get(function () {
    var _a, _b;
    return ((_b = (_a = this.habariConfig) === null || _a === void 0 ? void 0 : _a.host) === null || _b === void 0 ? void 0 : _b.length) > 0;
});
ptspProfileSchema.virtual('isLinked').get(function () {
    return this.linkedProfileId !== null;
});
ptspProfileSchema.virtual('blueSaltUrl').get(function () {
    return this.blueSaltEnv === 'staging' ? 'https://dev-wallets.bluesalt.net' : undefined;
});
// @ts-ignore
ptspProfileSchema.plugin(mongoose_paginate_v2_1.default);
const PTSPProfileModel = mongoose.model("ptspProfile", ptspProfileSchema);
exports.default = PTSPProfileModel;
//# sourceMappingURL=ptspProfile.model.js.map