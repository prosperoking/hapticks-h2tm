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
const vasjournals_model_1 = __importDefault(require("../db/models/vasjournals.model"));
const logger_1 = __importDefault(require("../helpers/logger"));
const terminal_model_1 = __importDefault(require("../db/models/terminal.model"));
class DashboardController {
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalTransactionsToday = yield vasjournals_model_1.default.where({
                    $and: [
                        {
                            transactionTime: {
                                $gte: Date.now(),
                            }
                        },
                        {
                            transactionTime: {
                                $lte: Date.now(),
                            }
                        },
                    ]
                }).count();
                const totalFailedTransactionsToday = yield vasjournals_model_1.default.where({
                    $and: [
                        {
                            transactionTime: {
                                $gte: Date.now(),
                            }
                        },
                        {
                            transactionTime: {
                                $lte: Date.now(),
                            }
                        },
                    ],
                    responseCode: {
                        $ne: "00",
                    }
                }).count();
                const lastestTransacions = yield vasjournals_model_1.default.find({
                    $and: [
                        {
                            transactionTime: {
                                $gte: Date.now(),
                            }
                        },
                        {
                            transactionTime: {
                                $lte: Date.now(),
                            }
                        },
                    ]
                }).sort({ _id: -1 }).limit(50);
                const terminalCount = yield terminal_model_1.default.find({}).count();
                return response.json({
                    totalTransactionsToday,
                    totalFailedTransactionsToday,
                    lastestTransacions,
                    terminalCount
                });
            }
            catch (error) {
                logger_1.default.error(error.message);
                response.status(400).json({
                    message: "An error occured"
                });
            }
        });
    }
}
exports.default = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map