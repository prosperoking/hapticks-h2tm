"use strict";
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
require("dotenv/config");
const app = express_1.default();
const port = process.env.PORT || '5009';
/** connection mongodb */
mongoose_1.default.Promise = global.Promise;
mongoose_1.default.set('useFindAndModify', false);
const config = new config_1.default();
const dbConfig = config.getConfig(process.env.NODE_ENV);
console.log("connection URL :: ", dbConfig.DATABASE_URL);
mongoose_1.default.connect(dbConfig.DATABASE_URL, dbConfig.options, (err) => {
    if (err)
        logger_1.default.log(err);
    else {
        logger_1.default.log(`Connected to mongodb successfully on ${process.env.NODE_ENV}`);
    }
});
mongoose_1.default.set('debug', true);
/** Enable Cross Origin Resource Sharing */
app.use(cors_1.default());
app.use(connect_timeout_1.default('5m'));
/** set parser to parse the request data in json format */
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(morgan_1.default(':date *** :method :: :url ** :response-time'));
app.use('/api/v1', index_route_1.default);
app.use(express_1.default.static('./public'));
app.use('*', express_1.default.static('./public'));
app.listen(port, () => {
    //if (err) return console.error(err);
    return console.log(`Server Magic happening on port ${port}`);
});
//# sourceMappingURL=index.js.map