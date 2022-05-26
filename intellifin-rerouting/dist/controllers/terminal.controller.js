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
const terminal_model_1 = __importDefault(require("../db/models/terminal.model"));
class ProfileController {
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield terminal_model_1.default.find({}, {
                    clrmasterkey: false,
                    encmasterkey: false,
                    encsesskey: false,
                    clrsesskey: false,
                    encpinkey: false,
                    clrpinkey: false,
                }).populate({ path: 'profile', select: 'title' });
                response.json({ data, count: data.length });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(request.body);
                const data = yield terminal_model_1.default.create(request.body);
                response.json({ status: true, data });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
}
exports.default = ProfileController;
//# sourceMappingURL=terminal.controller.js.map