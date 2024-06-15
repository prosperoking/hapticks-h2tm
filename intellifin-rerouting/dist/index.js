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
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const express_1 = __importDefault(require("express"));
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
mongoose_1.default.connect(dbConfig.DATABASE_URL, dbConfig.options, (err) => {
    if (err)
        logger_1.default.log(err);
    else {
        logger_1.default.log(`Connected to mongodb successfully ...`);
    }
});
mongoose_1.default.set('debug', dbConfig.enable_logging);
/** Enable Cross Origin Resource Sharing */
app.use((0, cors_1.default)());
app.use((0, connect_timeout_1.default)('15m'));
/** set parser to parse the request data in json format */
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use((0, morgan_1.default)(':date *** :method :: :url ** :response-time'));
(0, index_1.default)(app);
app.use('/api/v1', index_route_1.default);
app.use('/admin/queue', (0, index_1.authMiddleware)(['admin']), (0, queue_1.registerQueueDashBoard)(app, '/admin/queue'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('*', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.listen(port, () => {
    (0, queue_1.startQueWorkers)();
    return console.log(`Server Magic happening on port ${port}`);
});
//# sourceMappingURL=index.js.map