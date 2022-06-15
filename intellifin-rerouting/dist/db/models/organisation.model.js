"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const orgSchema = new mongoose_1.Schema({
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
orgSchema.plugin(mongoose_paginate_v2_1.default);
orgSchema.plugin(mongoose_unique_validator_1.default);
const OrganisationModel = (0, mongoose_1.model)("organisaionProfile", orgSchema);
exports.default = OrganisationModel;
//# sourceMappingURL=organisation.model.js.map