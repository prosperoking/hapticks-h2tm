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
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = status;
exports.getConnections = getConnections;
exports.killBridge = killBridge;
exports.closeConnections = closeConnections;
const cardsockethelper_1 = require("../helpers/cardsockethelper");
function status(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_1.TransactionTypes.PING, {});
            return res.status(200).json({
                status: 'success',
                data
            });
        }
        catch (error) {
            console.log(error);
            res.status(400).json({
                message: "Faile to Perform operation"
            });
        }
    });
}
function getConnections(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [isw, habari, hydrogen] = yield Promise.all([
                (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_1.TransactionTypes.ISW_CONNECTIONS, {}),
                (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_1.TransactionTypes.HABARI_CONNECTIONS, {}),
                (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_1.TransactionTypes.HYDROGEN_CONNECTIONS, {}),
            ]);
            return res.json({
                isw,
                habari,
                hydrogen
            });
        }
        catch (error) {
            res.status(400).json({
                message: "Faile to Perform operation"
            });
        }
    });
}
function killBridge(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_1.TransactionTypes.KILL_BRIDGE, {});
        }
        catch (error) {
            res.status(400).json({
                message: "Faile to Perform operation"
            });
        }
    });
}
function closeConnections(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { connection } = req.body;
            const action = {
                'isw': cardsockethelper_1.TransactionTypes.ISW_CLOSE_CONNECTIONS,
                'habari': cardsockethelper_1.TransactionTypes.HABARI_CLOSE_CONNECTIONS,
                'hydrogen': cardsockethelper_1.TransactionTypes.HYDROGEN_CLOSE_CONNECTIONS
            }[connection];
            if (!action) {
                return res.status(400).json({
                    message: "Invalid Connection name"
                });
            }
            const data = yield (0, cardsockethelper_1.sendSocketMessage)(action, {});
            return res.status(200).json({
                message: "Connection Closed Successfully",
                data
            });
        }
        catch (error) {
            res.status(400).json({
                message: "Faile to Perform operation"
            });
        }
    });
}
//# sourceMappingURL=connectionManager.controller.js.map