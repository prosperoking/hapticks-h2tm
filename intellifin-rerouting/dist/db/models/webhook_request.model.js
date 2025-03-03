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
const webhookRequestSchema = new mongoose.Schema({
    webhookId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        required: true,
    },
    terminalId: {
        type: String,
        required: true,
    },
    payload: {
        type: Object,
        required: true
    },
    responseBody: {
        type: String,
        default: null,
    },
    responseType: {
        type: String,
        default: null,
    },
    responseCode: {
        type: Number,
        default: null,
    },
    isRetry: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        required: true,
    },
    journalId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        required: true,
    },
    organisationId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        default: null,
        index: true,
    },
    verifyString: {
        type: String,
        default: null,
    },
    verifySignature: {
        type: String,
        default: null,
    },
    url: {
        type: String,
        default: null,
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});
webhookRequestSchema.virtual('transaction', {
    ref: 'journal',
    localField: '_id',
    foreignField: 'journalId',
});
webhookRequestSchema.virtual('webhook', {
    ref: 'webhook',
    localField: '_id',
    foreignField: 'webhookId',
});
webhookRequestSchema.virtual('organisation', {
    ref: 'organisationProfile',
    localField: '_id',
    foreignField: 'organisationId',
});
webhookRequestSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = mongoose.model('webhookRequest', webhookRequestSchema);
//# sourceMappingURL=webhook_request.model.js.map