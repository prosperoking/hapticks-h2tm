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
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const mongoose = __importStar(require("mongoose"));
const orgSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        set: (value) => String(value).toUpperCase(),
    },
}, {
    timestamps: true, toJSON: {
        virtuals: true
    }
});
orgSchema.virtual('terminals', {
    ref: 'terminal',
    localField: '_id',
    foreignField: 'organisationId',
});
orgSchema.virtual('terminals_count', {
    ref: 'terminal',
    localField: '_id',
    foreignField: 'organisationId',
    count: true,
});
orgSchema.virtual('users', {
    ref: 'user',
    localField: '_id',
    foreignField: 'organisationId',
});
orgSchema.virtual('users_count', {
    ref: 'user',
    localField: '_id',
    foreignField: 'organisationId',
    count: true,
});
orgSchema.virtual('tranactions_count', {
    ref: 'journal',
    localField: '_id',
    foreignField: 'organisationId',
    count: true,
});
orgSchema.plugin(mongoose_paginate_v2_1.default);
orgSchema.plugin(mongoose_unique_validator_1.default);
const OrganisationModel = mongoose.model("organisaionProfile", orgSchema);
exports.default = OrganisationModel;
//# sourceMappingURL=organisation.model.js.map