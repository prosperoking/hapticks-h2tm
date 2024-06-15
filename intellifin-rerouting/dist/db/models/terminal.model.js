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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ptspProfile_model_1 = __importDefault(require("./ptspProfile.model"));
const organisation_model_1 = __importDefault(require("./organisation.model"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const mongoose = __importStar(require("mongoose"));
const mongoose_csv_export_1 = __importDefault(require("mongoose-csv-export"));
const groupTid_model_1 = __importDefault(require("./groupTid.model"));
const appUtils_1 = require("../../helpers/appUtils");
const terminalLocation = new mongoose.Schema({
    name: {
        default: null,
        type: String,
        maxlength: 22,
    },
    city: {
        default: null,
        type: String,
        maxlength: 12,
    },
    stateCountry: {
        default: null,
        type: String,
        maxlength: 4
    },
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    }
});
terminalLocation.virtual("location").get(function () {
    const values = [this.name, this.city, this.stateCountry];
    if (values.includes(null) || values.includes(''))
        return null;
    return `${this.name.padEnd(22, " ")}, ${this.city.padStart(12, " ")}${this.stateCountry}`.substring(0, 40);
});
const terminalSchema = new mongoose.Schema({
    serialNo: {
        type: String,
        required: true,
        unique: true,
    },
    terminalId: {
        type: String,
        required: false,
        index: {
            unique: true,
            partialFilterExpression: {
                terminalId: { $type: "string" }
            }
        },
        set: (value) => value.length ? value : null,
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
    terminalLocation: {
        type: terminalLocation,
        default: () => null,
    },
    paramdownload: {
        type: String,
        required: false,
        default: null,
    },
    profileId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: ptspProfile_model_1.default,
        index: true,
    },
    terminalGroupId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: groupTid_model_1.default,
        default: null,
    },
    organisationId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: organisation_model_1.default,
        index: true,
    },
    brand: {
        type: String,
        default: null,
        set: (value) => value.toUpperCase(),
    },
    appVersion: {
        type: String,
        default: null,
        set: (value) => value.toUpperCase(),
    },
    deviceModel: {
        type: String,
        default: null,
        set: (value) => value.toUpperCase(),
    },
    iswTid: {
        type: String,
        default: null,
        index: {
            unique: true,
            partialFilterExpression: {
                iswTid: { $type: "string" }
            }
        },
        set: (value) => (value === null || value === void 0 ? void 0 : value.length) ? value : null,
        get: function (value) {
            return (value === null || value === void 0 ? void 0 : value.length) ? value : this.terminalId;
        },
        // set: function(value: string | null){
        //     return value.length?value: null;
        // }
    },
    iswUniqueId: {
        type: String,
        default: null,
        index: {
            unique: true,
            partialFilterExpression: {
                iswUniqueId: { $type: "string" }
            }
        },
        set: (value) => (value === null || value === void 0 ? void 0 : value.length) ? value : null,
        get: function (value) {
            return (value === null || value === void 0 ? void 0 : value.length) ? value : this.serialNo;
        },
        // set: function(value: string | null){
        //    return value.length?value: null;
        // }
    },
    threeLineTid: {
        type: String,
        default: null,
        index: {
            unique: true,
            partialFilterExpression: {
                threeLineTid: { $type: "string" }
            }
        },
        set: (value) => (value === null || value === void 0 ? void 0 : value.length) ? value : null
    },
    threeLineParams: {
        type: Object,
        default: null,
    },
    hydrogenTID: {
        type: String,
        default: null,
        index: {
            unique: true,
            partialFilterExpression: {
                hydrogenTID: { $type: "string" }
            }
        },
        set: (value) => (value === null || value === void 0 ? void 0 : value.length) ? value : null
    },
    habariTID: {
        type: String,
        default: null,
        index: {
            unique: true,
            partialFilterExpression: {
                habariTID: { $type: "string" }
            }
        },
        set: (value) => (value === null || value === void 0 ? void 0 : value.length) ? value : null
    },
    iswISOTID: {
        type: String,
        default: null,
        index: {
            unique: true,
            partialFilterExpression: {
                iswISOTID: { $type: "string" }
            }
        },
        set: (value) => (value === null || value === void 0 ? void 0 : value.length) ? value : null
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true,
    },
});
terminalSchema.virtual("profile", {
    ref: "ptspProfile",
    localField: "profileId",
    foreignField: "_id",
    justOne: true,
});
terminalSchema.virtual("groupTid", {
    ref: "group_tids",
    localField: "terminalGroupId",
    foreignField: "_id",
    justOne: true,
});
terminalSchema.virtual("organisation", {
    ref: "organisationProfile",
    localField: "organisationId",
    foreignField: "_id",
    justOne: true,
});
terminalSchema.virtual("parsedParams").get(function () {
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
    let message = rawParam + "";
    let data = {};
    while (message.length) {
        const tag = message.substr(0, 2);
        const length = parseInt(message.substr(2, 3));
        data = Object.assign(Object.assign({}, data), { [tags[tag]]: message.substr(5, length) });
        message = message.substring(5 + length, message.length);
    }
    data.merchantCategoryCode = data.mechantCategoryCode;
    return data;
});
terminalSchema.virtual("threeLineParsedParams").get(function () {
    var _a, _b;
    //@ts-ignore
    if (!((_b = (_a = this.threeLineParams) === null || _a === void 0 ? void 0 : _a.paramdownload) === null || _b === void 0 ? void 0 : _b.length)) {
        return null;
    }
    //@ts-ignore
    const rawParam = this.threeLineParams.paramdownload;
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
    let message = rawParam + "";
    let data = {};
    while (message.length) {
        const tag = message.substr(0, 2);
        const length = parseInt(message.substr(2, 3));
        data = Object.assign(Object.assign({}, data), { [tags[tag]]: message.substr(5, length) });
        message = message.substring(5 + length, message.length);
    }
    data.merchantCategoryCode = data.mechantCategoryCode;
    return data;
});
terminalSchema.virtual("customerAddress").get(function () {
    var _a;
    //@ts-ignore
    return (_a = this.terminalLocation) === null || _a === void 0 ? void 0 : _a.location;
});
terminalSchema.virtual("usingGroupedTid").get(function () {
    var _a;
    if ((_a = this.terminalId) === null || _a === void 0 ? void 0 : _a.length)
        return false;
    if (!this.terminalGroupId)
        return false;
    return true;
});
terminalSchema.plugin(mongoose_paginate_v2_1.default);
terminalSchema.pre('save', function () {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (!((_a = this.iswISOTID) === null || _a === void 0 ? void 0 : _a.length)) {
            const iswTid = yield (0, appUtils_1.getAvailableTid)(this.id, "isw");
            this.iswISOTID = iswTid === null || iswTid === void 0 ? void 0 : iswTid.tid;
        }
        if (!((_b = this.hydrogenTID) === null || _b === void 0 ? void 0 : _b.length)) {
            const hyTid = yield (0, appUtils_1.getAvailableTid)(this.id, "hydrogen");
            this.hydrogenTID = hyTid === null || hyTid === void 0 ? void 0 : hyTid.tid;
        }
    });
});
terminalSchema.plugin(mongoose_csv_export_1.default, {
    headers: [
        "SerialNo",
        "TerminalId",
        "IswTid",
        "IswUniqueId",
        "Brand",
        "AppVersion",
        "DeviceModel",
        "ThreeLineTid",
    ],
    alias: {
        SerialNo: "serialNo",
        TerminalId: "terminalId",
        IswTid: "iswTid",
        IswUniqueId: "iswUniqueId",
        Brand: "brand",
        AppVersion: "appVersion",
        DeviceModel: "deviceModel",
        ThreeLineTid: "threeLineTid",
    },
});
const Terminal = mongoose.model("terminal", terminalSchema);
exports.default = Terminal;
//# sourceMappingURL=terminal.model.js.map