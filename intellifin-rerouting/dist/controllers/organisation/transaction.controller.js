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
exports.index = void 0;
const logger_1 = __importDefault(require("../../helpers/logger"));
const transaction_model_1 = __importDefault(require("../../db/models/transaction.model"));
function index(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = req.query.q;
            const terminals = yield transaction_model_1.default.paginate({
                //@ts-ignore
                organisationId: req.user._id,
                $or: [
                    { terminalId: query },
                    { rrn: query },
                    { stan: query }
                ],
                processor: req.query.processor || undefined,
                $and: [
                    { createdAt: { $gte: req.query.startDate || undefined } },
                    { createdAt: { $lte: req.query.endDate || undefined } },
                ]
            });
            res.json(terminals);
        }
        catch (error) {
            logger_1.default.error(error);
            res.status(400).json({ message: "Something went wrong" });
        }
    });
}
exports.index = index;
//# sourceMappingURL=transaction.controller.js.map