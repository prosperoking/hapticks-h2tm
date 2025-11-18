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
exports.getBanks = getBanks;
exports.getBins = getBins;
exports.addBin = addBin;
exports.updateBin = updateBin;
exports.deleteBin = deleteBin;
const bank_model_1 = __importDefault(require("../db/models/bank.model"));
function getBanks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const banks = yield bank_model_1.default.find({}, { _id: 1, name: 1 });
        return res.json(banks);
    });
}
function getBins(req, res) {
    return __awaiter(this, void 0, void 0, function* () { });
}
function addBin(req, res) {
    return __awaiter(this, void 0, void 0, function* () { });
}
function updateBin(req, res) {
    return __awaiter(this, void 0, void 0, function* () { });
}
function deleteBin(req, res) {
    return __awaiter(this, void 0, void 0, function* () { });
}
//# sourceMappingURL=bankBins.controller.js.map