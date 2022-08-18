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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const crypt_1 = require("../../helpers/crypt");
const paginate = __importStar(require("mongoose-paginate-v2"));
const mongoose = __importStar(require("mongoose"));
const webhookSchema = new mongoose.Schema({
    organisation_id: {
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
    headers: {
        type: String,
        set: value => (value === null || value === void 0 ? void 0 : value.length) ? (0, crypt_1.encrypt)(JSON.stringify(value)) : null,
        get: value => (value === null || value === void 0 ? void 0 : value.length) ? JSON.stringify((0, crypt_1.decrypt)(value)) : null,
        default: null,
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    }
});
// @ts-ignore
webhookSchema.plugin(paginate);
exports.default = mongoose.model('webhook', webhookSchema);
//# sourceMappingURL=webhook.model.js.map