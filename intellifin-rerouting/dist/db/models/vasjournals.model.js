"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let JournalsSchema = new mongoose_1.default.Schema({
    amount: Number,
    authCode: { type: String, default: '' },
    product: { type: String, default: "" },
    transactionTime: Date,
    reversal: { type: Boolean, default: false },
    handlerResponseTime: Date,
    extraFields: JSON,
    responseCode: { type: String, default: "" },
    responseDescription: { type: String, default: "" },
    isCompleted: Boolean,
    terminalId: { type: String, default: "" },
    merchantId: { type: String, default: "" },
    cashback: { type: String, default: "" },
    merchantName: { type: String, default: "" },
    merchantCategoryCode: { type: String, default: "" },
    merchantAddress: { type: String, default: "" },
    currencyCode: { type: String, default: "" },
    rrn: { type: String, default: "" },
    MTI: { type: String, default: "0200" },
    STAN: { type: String, default: "" },
    PAN: { type: String, default: "" },
    vasData: Object,
    extraData: { type: String, default: "" }
});
exports.default = mongoose_1.default.model('journal', JournalsSchema);
//# sourceMappingURL=vasjournals.model.js.map