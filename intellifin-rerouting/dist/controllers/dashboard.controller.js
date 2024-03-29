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
const transaction_model_1 = __importDefault(require("../db/models/transaction.model"));
const logger_1 = __importDefault(require("../helpers/logger"));
const terminal_model_1 = __importDefault(require("../db/models/terminal.model"));
const moment_1 = __importDefault(require("moment"));
class DashboardController {
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = (0, moment_1.default)().format("YYYY-MM-DD");
                const totalTransactionsToday = yield transaction_model_1.default.where({
                    transactionTime: {
                        $gte: new Date(date),
                    }
                }).count();
                const totalFailedTransactionsToday = yield transaction_model_1.default.where({
                    transactionTime: {
                        $gte: new Date(date),
                    },
                    responseCode: {
                        $ne: "00",
                    }
                }).count();
                const lastestTransacions = yield transaction_model_1.default.find({
                    transactionTime: {
                        $gte: new Date(date),
                    }
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
    transactions(request, response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = (0, moment_1.default)().format("YYYY-MM-DD");
                // @ts-ignore
                const organisationFilter = ((_a = request.user) === null || _a === void 0 ? void 0 : _a.organisation_id) ? { organisationId: (_b = request.user) === null || _b === void 0 ? void 0 : _b.organisation_id } : {};
                console.log(request.query);
                const transactions = yield transaction_model_1.default.paginate(Object.assign(Object.assign({}, DashboardController.filterGen(request.query)), organisationFilter), {
                    sort: { _id: -1 },
                    limit: Number(request.query.limit || 50),
                    page: Number(request.query.page || 1),
                    populate: [
                        { path: 'organisation' },
                    ]
                });
                return response.json(transactions);
            }
            catch (error) {
                logger_1.default.error(error.message);
                response.status(400).json({
                    message: "An error occured"
                });
            }
        });
    }
    export(request, response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = (0, moment_1.default)().format("YYYY-MM-DD");
                // @ts-ignore
                const organisationFilter = ((_a = request.user) === null || _a === void 0 ? void 0 : _a.organisation_id) ? { organisationId: (_b = request.user) === null || _b === void 0 ? void 0 : _b.organisation_id } : {};
                response.header('Content-Type', 'text/csv; charset=utf-8');
                response.attachment(`transactions-${Date.now()}.csv`);
                transaction_model_1.default.find(Object.assign(Object.assign({}, DashboardController.filterGen(request.query)), organisationFilter)).sort({ _id: -1 })
                    .cursor()
                    .pipe(transaction_model_1.default.csvTransformStream()).pipe(response);
            }
            catch (error) {
                logger_1.default.error(error.message);
                response.status(400).json({
                    message: "An error occured"
                });
            }
        });
    }
    static filterGen({ q, organisation, startDate, endDate, processor }) {
        console.log(processor);
        let query = {};
        if (q !== undefined) {
            query = Object.assign(Object.assign({}, query), { $or: [
                    {
                        terminalId: RegExp(`^${q}`, 'i'),
                    },
                    {
                        rrn: RegExp(`^${q}`, 'i'),
                    },
                    {
                        merchantName: RegExp(`${q}`, 'i'),
                    },
                    {
                        merchantId: RegExp(`^${q}`, 'i'),
                    },
                ] });
        }
        if (processor !== undefined &&
            ["kimono", "nibss"].includes(processor.toLowerCase())) {
            query = Object.assign(Object.assign({}, query), { processor: processor.toUpperCase() });
        }
        if (organisation !== undefined) {
            query = Object.assign(Object.assign({}, query), { organisationId: organisation });
        }
        if (Boolean(startDate)) {
            query = Object.assign(Object.assign({}, query), { $and: [
                    {
                        transactionTime: {
                            $gte: (0, moment_1.default)(startDate).toDate(),
                        }
                    },
                ] });
        }
        if (Boolean(endDate)) {
            query = Object.assign(Object.assign({}, query), { $and: [
                    ...query['$and'] || [],
                    {
                        transactionTime: {
                            $lte: (0, moment_1.default)(endDate).toDate(),
                        }
                    },
                ] });
        }
        console.log("query: ", query);
        return query;
    }
}
exports.default = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map