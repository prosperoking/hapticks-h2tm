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
exports.authMiddleware = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_remember_me_1 = __importDefault(require("passport-remember-me"));
const user_model_1 = __importDefault(require("../db/models/user.model"));
const logger_1 = __importDefault(require("../helpers/logger"));
const crypto_1 = __importDefault(require("crypto"));
const argon2_1 = __importDefault(require("argon2"));
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
    user_model_1.default.findOne({ rememberToken: token }).populate('organisation')
        .then(user => {
        if (!user)
            return done(null, false);
        done(null, user);
    }).catch(err => done(err));
}, function (user, done) {
    const token = crypto_1.default.randomUUID();
    user_model_1.default.updateOne({ _id: user.id, }, { rememberToken: Buffer.from(token).toString('base64') })
        .then(() => {
        done(null, token);
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
    // app.use(session({  }))
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
        if (req.body.rember_me) {
            const token = crypto_1.default.randomUUID();
            const id = req.user.id;
            user_model_1.default.updateOne({ _id: id, }, { rememberToken: Buffer.from(token).toString('base64') }).exec();
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
const authMiddleware = (roles = []) => (req, res, next) => {
    var _a;
    if (!req.user) {
        return res.status(401).json({
            message: "Not Authenticated"
        });
    }
    // Todo: handle permissions
    // @ts-ignore
    if (roles.length && !(roles || []).includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
        return res.status(403).json({
            message: "Your not authorized to view this page"
        });
    }
    next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=index.js.map