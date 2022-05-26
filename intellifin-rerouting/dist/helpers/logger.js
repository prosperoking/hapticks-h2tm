"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const winston_1 = __importDefault(require("winston"));
class Logger {
    log(data) {
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        console.error(moment_1.default().toString(), data);
    }
    error(data) {
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        const logger = winston_1.default.createLogger({
            transports: [
                new winston_1.default.transports.Console()
            ]
        });
        logger.error(`${moment_1.default().toString()} ${data}`);
    }
    logWinston(data) {
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        const logger = winston_1.default.createLogger({
            transports: [
                new winston_1.default.transports.Console()
            ]
        });
        logger.info(`${moment_1.default().toString()} ${data}`);
    }
}
exports.default = new Logger();
//# sourceMappingURL=logger.js.map