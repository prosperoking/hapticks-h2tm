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
const terminalIDSchema = new mongoose_1.default.Schema({
    tid: {
        type: String,
        index: true,
        unique: true,
    },
    prefix: {
        index: true,
        type: String,
        minLength: 4,
        maxlength: 4,
    },
    linkedTo: {
        type: mongoose_1.SchemaTypes.ObjectId,
        default: null,
    },
    rangeGenerated: {
        type: String,
        index: true,
        default: null,
    },
    type: {
        type: String,
        required: true,
        index: true,
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    }
});
terminalIDSchema.virtual('terminal', {
    localField: 'linkedTo',
    foreignField: '_id',
    justOne: true,
    ref: 'terminal'
});
terminalIDSchema.pre('save', function () {
    this.prefix = this.tid.substring(0, 4);
});
terminalIDSchema.plugin(mongoose_paginate_v2_1.default);
const TerminalID = mongoose_1.default.model("TerminalId", terminalIDSchema);
exports.default = TerminalID;
//# sourceMappingURL=terminalIds.model.js.map