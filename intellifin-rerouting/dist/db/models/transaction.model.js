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
let JournalsSchema = new mongoose.Schema({
    amount: Number,
    authCode: { type: String, default: '' },
    product: { type: String, default: "" },
    transactionTime: Date,
    reversal: { type: Boolean, default: false },
    handlerResponseTime: Date,
    extraFields: JSON,
    responseCode: { type: String, default: "" },
    responseDescription: { type: String, default: "" },
    isCompleted: Boolean,
    terminalId: { type: String, default: "" },
    merchantId: { type: String, default: "" },
    cashback: { type: String, default: "" },
    merchantName: { type: String, default: "" },
    merchantCategoryCode: { type: String, default: "" },
    merchantAddress: { type: String, default: "" },
    currencyCode: { type: String, default: "" },
    rrn: { type: String, default: "" },
    MTI: { type: String, default: "0200" },
    STAN: { type: String, default: "" },
    PAN: { type: String, default: "" },
    cardExpiration: { type: String, defualt: "" },
    vasData: {
        type: Object,
        default: null,
    },
    organisationId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        default: null,
    },
    extraData: { type: String, default: "" },
    processor: { type: String, default: "NIBSS" }
}, {
    timestamps: true,
    toJSON: {
        virtuals: ['terminal', 'organisation']
    }
});
JournalsSchema.virtual('terminal', {
    ref: 'terminal',
    localField: 'terminalId',
    foreignField: 'terminalId',
});
JournalsSchema.virtual('organisation', {
    ref: 'organisaionProfile',
    localField: 'organisationId',
    foreignField: '_id',
});
// @ts-ignore
JournalsSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = mongoose.model('journal', JournalsSchema);
//# sourceMappingURL=transaction.model.js.map