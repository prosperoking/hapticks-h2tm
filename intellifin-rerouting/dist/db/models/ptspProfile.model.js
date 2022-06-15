"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ptspProfileSchema = new mongoose_1.Schema({
    title: {
        type: String,
        unique: true,
    },
    isoHost: {
        type: String,
    },
    isoPort: {
        type: String,
        unique: true,
    },
    isSSL: {
        type: Boolean,
        default: false,
    },
    componentKey1: {
        type: String,
    },
    componentKey2: {
        type: String,
    },
    iswSwitchAmount: {
        type: Number,
        default: null,
    },
}, {
    timestamps: true, toJSON: {
        virtuals: true
    }
});
ptspProfileSchema.virtual('terminals', {
    ref: 'terminal',
    localField: '_id',
    foreignField: 'profileId',
});
ptspProfileSchema.virtual('terminals_count', {
    ref: 'terminal',
    localField: '_id',
    foreignField: 'profileId',
    count: true,
});
// ptspProfileSchema.plugin(paginate);
const PTSPProfileModel = (0, mongoose_1.model)("ptspProfile", ptspProfileSchema);
exports.default = PTSPProfileModel;
//# sourceMappingURL=ptspProfile.model.js.map