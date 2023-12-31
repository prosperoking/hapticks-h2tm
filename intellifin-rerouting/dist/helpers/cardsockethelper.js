"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performCardSocketTranaction = exports.TransactionTypes = void 0;
const net_1 = __importDefault(require("net"));
const logger_1 = __importDefault(require("./logger"));
var TransactionTypes;
(function (TransactionTypes) {
    TransactionTypes["KEY_EXCHANGE"] = "KEY EXCHANGE";
    TransactionTypes["ISO_TRANSACTION"] = "ISO";
    TransactionTypes["NIBSS_TRANSACTION"] = "NIBSS";
    TransactionTypes["ISW_KIMONO"] = "KIMONO";
    TransactionTypes["BALACE_CHECK"] = "BALANCE";
    TransactionTypes["BLUESALT"] = "BLUESALT";
    TransactionTypes["THREELINE"] = "3LINE";
    TransactionTypes["THREELINE_KEY_EXCHANGE"] = "3LINE_KEY_EXCHANGE";
})(TransactionTypes = exports.TransactionTypes || (exports.TransactionTypes = {}));
function performCardSocketTranaction(transaction, payload) {
    return new Promise((resolve, reject) => {
        let response = [];
        const socket = net_1.default.connect({
            host: process.env.CARD_SERVICE_HOST,
            port: parseInt(process.env.CARD_SERVICE_PORT),
            timeout: 6000 * 40,
        }, () => {
            logger_1.default.log("Connected to card service socket to perform operation");
            socket.write(Buffer.from(JSON.stringify(Object.assign({ transaction }, payload)) + "\n"), (err) => {
                if (err) {
                    logger_1.default.log(err);
                    socket.end();
                    return reject(err);
                }
                logger_1.default.log("Write Successful");
            });
        });
        socket
            .on("data", (data) => {
            response = [...response, data];
        })
            .on("error", (err) => {
            socket.end();
            reject({
                status: false,
                payload,
                message: err.message,
            });
        })
            .on("end", () => {
            const allResponse = Buffer.concat(response);
            try {
                resolve(JSON.parse(allResponse.toString()));
            }
            catch (error) {
                reject({
                    status: false,
                    payload,
                    message: error.message,
                });
            }
        })
            .on("timeout", () => reject({
            status: false,
            payload,
            message: "Connection timed out",
        }));
    });
}
exports.performCardSocketTranaction = performCardSocketTranaction;
//# sourceMappingURL=cardsockethelper.js.map