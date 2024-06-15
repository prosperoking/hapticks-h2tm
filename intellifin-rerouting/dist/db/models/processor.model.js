"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const processorSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        set: (title) => title.trim().toUpperCase(),
    },
    type: {
        type: String,
        enum: ["nibss", "kimono", "isw", "hydrogen", "bluesalt"],
    },
    host: {
        type: String,
        required: true,
        set: (host) => host.trim(),
    },
    port: {
        type: Number,
        required: true,
    },
    key: {
        type: String,
        required: true,
    },
    ssl: {
        type: Boolean,
        default: false,
    },
    kcv: {
        type: String,
        default: null,
    },
    zpk: {
        type: String,
        default: null,
    },
    mid: {
        type: String,
        required: false,
        default: null,
    },
    ett: {
        type: String,
        default: null,
    },
    lastRotate: {
        type: Date,
        default: null,
    },
    rid: {
        type: String,
        default: null,
    },
    oRid: {
        type: String,
        default: null,
    },
    settlementAccount: {
        type: String,
        default: null,
    },
    mcc: {
        type: String,
        default: null,
    },
    tidPrefix: {
        type: String,
        default: null,
        maxlength: 4,
        minlength: 4,
    },
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
});
processorSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = mongoose_1.default.model("processors", processorSchema);
//# sourceMappingURL=processor.model.js.map