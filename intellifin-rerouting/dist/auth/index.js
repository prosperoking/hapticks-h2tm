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
exports.authMiddleware = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_remember_me_1 = __importDefault(require("passport-remember-me"));
const user_model_1 = __importDefault(require("../db/models/user.model"));
const logger_1 = __importDefault(require("../helpers/logger"));
const crypto_1 = __importDefault(require("crypto"));
const argon2_1 = __importDefault(require("argon2"));
const _ = __importStar(require("lodash"));
const config_1 = __importDefault(require("../config/config"));
const crypt_1 = require("../helpers/crypt");
passport_1.default.use(new passport_local_1.default.Strategy(function (username, password, done) {
    user_model_1.default.findOne({
        $or: [
            { email: username },
            { username }
        ]
    }).then((user) => __awaiter(this, void 0, void 0, function* () {
        if (!user)
            return done(null, false);
        if (!(yield argon2_1.default.verify(user.password, password))) {
            return done("Invalid password", null);
        }
        done(null, user);
    })).catch(err => {
        logger_1.default.error(err);
        done("An Error occured");
    });
}));
passport_1.default.use(new passport_remember_me_1.default.Strategy(function (token, done) {
    user_model_1.default.findOne({ rememberToken: (0, crypt_1.decrypt)(token) }).populate('organisation')
        .then(user => {
        console.log("user: ", user);
        if (!user)
            return done(null, false);
        done(null, user);
    }).catch(err => done(err));
}, function (user, done) {
    const rememberToken = Buffer.from(crypto_1.default.randomUUID()).toString('base64');
    user_model_1.default.updateOne({ _id: user.id, }, { rememberToken })
        .then(() => {
        done(null, rememberToken);
    })
        .catch(err => done(err));
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, { id: user.id });
});
passport_1.default.deserializeUser(function (user, done) {
    user_model_1.default.findById(user.id).then(user => {
        if (!user)
            return done("Unknown User");
        done(null, user);
    }).catch(e => done(e));
});
function applyAuthSetup(app) {
    app.use((0, cookie_parser_1.default)());
    app.use((0, cookie_session_1.default)({
        name: 'h2tm',
        maxAge: 60 * 60 * 1000,
        secret: process.env.APP_SECRET
    }));
    app.use((0, express_session_1.default)({ secret: process.env.APP_SECRET }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use(passport_1.default.authenticate('remember-me'));
    app.post('/api/v1/login', passport_1.default.authenticate('local', {
        session: true,
        failureMessage: "Incorrect credentials"
    }), (err, req, res, next) => {
        if (err)
            return res.status(422).json({ message: err });
        next();
    }, (req, res) => {
        // 
        if (req.body.rememberMe) {
            const token = crypto_1.default.randomUUID();
            const clear = Buffer.from(token).toString('base64');
            const id = req.user.id;
            user_model_1.default.updateOne({ _id: id, }, { rememberToken: clear }).exec();
            res.cookie('remember_me', clear, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
        }
        const { username, email, fullname, role, permissions } = req.user;
        res.json({
            message: "Successful",
            user: {
                username,
                email,
                fullname,
                role,
                permissions
            }
        });
    });
}
exports.default = applyAuthSetup;
const authMiddleware = (roles = [], permissions = []) => {
    return (req, res, next) => {
        var _a, _b, _c, _d;
        if (!req.user) {
            return res.status(401).json({
                message: "Not Authenticated"
            });
        }
        const config = (new config_1.default()).getConfig('');
        if (
        // @ts-ignore
        config.ADMIN_EMAILS.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) ||
            (!roles.length && !permissions.length)) {
            return next();
        }
        // @ts-ignore
        if (permissions.length && _.difference(permissions, (_b = req.user) === null || _b === void 0 ? void 0 : _b.permissions).length == 0) {
            return next();
        }
        // @ts-ignore
        console.log((_c = req.user) === null || _c === void 0 ? void 0 : _c.role);
        // @ts-ignore
        if (roles.length && roles.includes((_d = req.user) === null || _d === void 0 ? void 0 : _d.role)) {
            return next();
        }
        return res.status(403).json({
            message: "You do not have enough rights to perform this action"
        });
    };
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=index.js.map