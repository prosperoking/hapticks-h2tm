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
})(TransactionTypes = exports.TransactionTypes || (exports.TransactionTypes = {}));
function performCardSocketTranaction(transaction, payload) {
    return new Promise((resolve, reject) => {
        let response = [];
        const socket = net_1.default.connect({
            port: parseInt(process.env.CARD_SERVICE_PORT),
            timeout: 6000 * 20
        }, () => {
            logger_1.default.log("Connected to card service socket to perform operation");
            socket.write(Buffer.from(JSON.stringify(Object.assign({ transaction }, payload)) + "\n"), err => {
                if (err) {
                    logger_1.default.log(err);
                    socket.end();
                    return reject(err);
                }
                logger_1.default.log("Write Successful");
            });
        });
        socket.on("data", (data) => {
            response = [...response, data];
        })
            .on("error", (err) => {
            socket.end();
            reject({
                status: false,
                message: err.message
            });
        })
            .on("end", () => {
            const allResponse = Buffer.concat(response);
            resolve(JSON.parse(allResponse.toString()));
        })
            .on("timeout", () => reject({
            status: false,
            message: "Connection timed out"
        }));
    });
}
exports.performCardSocketTranaction = performCardSocketTranaction;
//# sourceMappingURL=cardsockethelper.js.map