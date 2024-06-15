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
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ptspProfile_model_1 = __importDefault(require("./ptspProfile.model"));
const organisation_model_1 = __importDefault(require("./organisation.model"));
const groupTidSchema = new mongoose_1.default.Schema({
    terminalId: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
    },
    profileId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: ptspProfile_model_1.default,
    },
    organisationId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: organisation_model_1.default,
    },
    clrmasterkey: {
        type: String,
        required: false,
        default: null,
    },
    encmasterkey: {
        type: String,
        required: false,
        default: null,
    },
    encsesskey: {
        type: String,
        required: false,
        default: null,
    },
    clrsesskey: {
        type: String,
        required: false,
        default: null,
    },
    encpinkey: {
        type: String,
        required: false,
        default: null,
    },
    clrpinkey: {
        type: String,
        required: false,
        default: null,
    },
    paramdownload: {
        type: String,
        required: false,
        default: null,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true,
    },
});
groupTidSchema.virtual("profile", {
    ref: "ptspProfile",
    localField: "profileId",
    foreignField: "_id",
    justOne: true,
});
groupTidSchema.virtual("terminals_count", {
    ref: 'terminal',
    localField: '_id',
    foreignField: 'terminalGroupId',
    count: true,
});
groupTidSchema.virtual("organisation", {
    ref: "organisationProfile",
    localField: "organisationId",
    foreignField: "_id",
    justOne: true,
});
groupTidSchema.virtual("parsedParams").get(function () {
    var _a;
    if (!((_a = this.paramdownload) === null || _a === void 0 ? void 0 : _a.length)) {
        return null;
    }
    const rawParam = this.paramdownload;
    const tags = {
        "02": "exchangeTime",
        "03": "mid",
        "04": "timeout",
        "05": "currencyCode",
        "06": "countryCode",
        "07": "callHomeTimeout",
        "52": "merchantNameLocation",
        "08": "mechantCategoryCode",
    };
    let message = rawParam + "";
    let data = {};
    while (message.length) {
        const tag = message.substr(0, 2);
        const length = parseInt(message.substr(2, 3));
        data = Object.assign(Object.assign({}, data), { [tags[tag]]: message.substr(5, length) });
        message = message.substring(5 + length, message.length);
    }
    return data;
});
groupTidSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = mongoose_1.default.model("group_tids", groupTidSchema);
//# sourceMappingURL=groupTid.model.js.map