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
const ptspProfile_model_1 = __importDefault(require("../db/models/ptspProfile.model"));
const lodash_1 = require("lodash");
class ProfileController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { body } = request;
                const data = yield (new ptspProfile_model_1.default((0, lodash_1.omit)(body, ['_id']))).save();
                response.json({ status: true, data });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield ptspProfile_model_1.default.find({}).populate('terminals_count');
                response.json({ data, count: data.length });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    edit(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield ptspProfile_model_1.default.findById((_a = request.params) === null || _a === void 0 ? void 0 : _a.id);
                if (!profile)
                    return response.status(404).json({ message: "Profile not found" });
                const data = yield profile.update((0, lodash_1.pick)(request.body, [
                    "title",
                    "isoHost",
                    "isoPort",
                    "isSSL",
                    "componentKey1",
                    "componentKey2",
                    "iswSwitchAmount",
                    "terminals_count",
                    "iswMid",
                    "iswInstitutionCode",
                    "iswDestinationAccount",
                ]));
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
//# sourceMappingURL=profiles.controller.js.map