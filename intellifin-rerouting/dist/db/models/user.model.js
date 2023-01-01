"use strict";
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
exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
const argon2_1 = __importDefault(require("argon2"));
const crypto_1 = __importDefault(require("crypto"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
const UserSchema = new mongoose_1.Schema({
    username: {
        unique: true,
        type: String,
        required: true,
    },
    email: {
        unique: true,
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    rememberToken: {
        type: String,
        default: null,
    },
    organisation_id: {
        default: null,
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    role: {
        type: mongoose_1.SchemaTypes.String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    permissions: {
        type: [mongoose_1.SchemaTypes.String],
        default: []
    },
    requirePasswordChange: {
        type: mongoose_1.SchemaTypes.Boolean,
        default: false,
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: ['organisation', 'imageUrl']
    }
});
UserSchema.virtual('organisation', {
    localField: 'organisation_id',
    foreignField: '_id',
    ref: 'organisationProfile',
    justOne: true,
});
UserSchema.virtual('imageUrl').get(function () {
    const hashedEmail = crypto_1.default.createHash('md5').update(this.email).digest("hex");
    return "https://www.gravatar.com/avatar/" + hashedEmail;
});
UserSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield argon2_1.default.hash(this.password);
    });
});
UserSchema.plugin(mongoose_paginate_v2_1.default);
const User = (0, mongoose_1.model)('user', UserSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map