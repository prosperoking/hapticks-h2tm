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
const ptspProfile_model_1 = __importDefault(require("../../db/models/ptspProfile.model"));
const logger_1 = __importDefault(require("../../helpers/logger"));
function index(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const profiles = yield ptspProfile_model_1.default.paginate(
            //@ts-ignore
            { organisationId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, {
                select: '_id title',
                limit: 50,
            });
            return res.json(profiles);
        }
        catch (error) {
            logger_1.default.error(error);
            res.status(400).json({ message: "Something went wrong" });
        }
    });
}
exports.index = index;
//# sourceMappingURL=profile.controller.js.map