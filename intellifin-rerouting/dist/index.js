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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const index_route_1 = __importDefault(require("./routes/index.route"));
const config_1 = __importDefault(require("./config/config"));
const logger_1 = __importDefault(require("./helpers/logger"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const index_1 = __importStar(require("./auth/index"));
const queue_1 = require("./queue/queue");
const app = (0, express_1.default)();
const port = process.env.PORT || '5009';
/** connection mongodb */
mongoose_1.default.Promise = global.Promise;
const config = new config_1.default();
const dbConfig = config.getConfig(process.env.NODE_ENV);
/** Enable Cross Origin Resource Sharing */
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({ secret: process.env.APP_SECRET, resave: true, saveUninitialized: false }));
app.use(function (req, res, next) {
    res.setHeader('X-Frame-Options', 'sameorigin');
    next();
});
app.use((0, connect_timeout_1.default)('15m'));
/** set parser to parse the request data in json format */
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use((0, morgan_1.default)(':date *** :method :: :url ** :response-time'));
(0, index_1.default)(app);
app.use('/api/v1', index_route_1.default);
app.use('/admin/queue', (0, index_1.authMiddleware)(['admin']), (0, queue_1.registerQueueDashBoard)(app, '/admin/queue'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/{*splat}', express_1.default.static(path_1.default.join(__dirname, 'public')));
mongoose_1.default.set('debug', dbConfig.enable_logging);
mongoose_1.default.connect(dbConfig.DATABASE_URL, dbConfig.options)
    .then(() => {
    logger_1.default.log("Connected to database successfully");
    app.listen(port, () => {
        (0, queue_1.startQueWorkers)();
        // loadZoneBins();
        return console.log(`Server Magic happening on port ${port}`);
    });
})
    .catch((err) => {
    logger_1.default.log(err);
});
//# sourceMappingURL=index.js.map