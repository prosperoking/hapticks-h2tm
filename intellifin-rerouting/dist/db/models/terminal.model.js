"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ptspProfile_model_1 = __importDefault(require("./ptspProfile.model"));
const organisation_model_1 = __importDefault(require("./organisation.model"));
const terminalSchema = new mongoose_1.Schema({
    serialNo: {
        type: String,
        required: true,
        unique: true,
    },
    terminalId: {
        type: String,
        required: true,
        unique: true,
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
    profileId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: ptspProfile_model_1.default
    },
    organisationId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: organisation_model_1.default,
    },
    brand: {
        type: String,
        default: null,
    },
    appVersion: {
        type: String,
        default: null
    },
    deviceModel: {
        type: String,
        default: null,
    },
    iswTid: {
        type: String,
        unique: true,
        default: null,
        get: function (value) {
            return (value === null || value === void 0 ? void 0 : value.length) ? value : this.terminalId;
        },
    },
    iswUniqueId: {
        type: String,
        default: null,
        unique: true,
        get: function (value) {
            return (value === null || value === void 0 ? void 0 : value.length) ? value : this.serialNo;
        }
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true
    }
});
terminalSchema.virtual('profile', {
    ref: 'ptspProfile',
    localField: 'profileId',
    foreignField: '_id',
    justOne: true,
});
terminalSchema.virtual('parsedParams').get(function () {
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
    let message = rawParam + '';
    let data = {};
    while (message.length) {
        const tag = message.substr(0, 2);
        const length = parseInt(message.substr(2, 3));
        data = Object.assign(Object.assign({}, data), { [tags[tag]]: message.substr(5, length) });
        message = message.substring(5 + length, message.length);
    }
    return data;
});
const Termninal = (0, mongoose_1.model)('terminal', terminalSchema);
exports.default = Termninal;
//# sourceMappingURL=terminal.model.js.map