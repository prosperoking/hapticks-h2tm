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
const crypt_1 = require("../../helpers/crypt");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const mongoose = __importStar(require("mongoose"));
const ptspProfile_model_1 = __importDefault(require("./ptspProfile.model"));
const webhookSchema = new mongoose.Schema({
    organisationId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        default: null,
    },
    name: {
        type: String,
        required: true,
        set: value => String(value).toUpperCase(),
    },
    url: {
        type: String,
        required: true,
    },
    secret: {
        type: String,
        set: value => (value === null || value === void 0 ? void 0 : value.length) ? (0, crypt_1.encrypt)(value) : null,
        get: value => (value === null || value === void 0 ? void 0 : value.length) ? (0, crypt_1.decrypt)(value) : null,
        default: null,
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
    toJSON: {
        getters: true
    }
});
webhookSchema.virtual('organisation', {
    ref: 'organisationProfile',
    localField: 'organisationId',
    foreignField: '_id',
});
webhookSchema.virtual('request_count', {
    ref: 'webhookRequest',
    localField: '_id',
    foreignField: 'webhookId',
    count: true,
});
webhookSchema.post('remove', function (data) {
    ptspProfile_model_1.default.updateMany({
        webhookId: data.id,
    }, {
        $set: {
            webhookId: null,
        }
    }).then((result) => {
        console.log("CLeared Webhook Setting: ", result);
    });
});
webhookSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = mongoose.model('webhooklistener', webhookSchema);
//# sourceMappingURL=webhook.model.js.map