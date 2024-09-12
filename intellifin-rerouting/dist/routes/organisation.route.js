"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const organisation_model_1 = __importDefault(require("../db/models/organisation.model"));
const logger_1 = __importDefault(require("../helpers/logger"));
const crypt_1 = require("../helpers/crypt");
const argon2_1 = __importDefault(require("argon2"));
const TerminalController = __importStar(require("../controllers/organisation/terminal.controller"));
const ProfileController = __importStar(require("../controllers/organisation/profile.controller"));
const TransactionController = __importStar(require("../controllers/organisation/transaction.controller"));
const terminalCreate_validator_1 = __importDefault(require("../validators/terminalCreate.validator"));
const terminalUpdate_validator_1 = __importDefault(require("../validators/terminalUpdate.validator"));
const router = express_1.default.Router();
const authenticator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("authorization");
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.length) || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No authorisation" });
        }
        const token = authHeader.split(' ');
        if (token.length !== 2) {
            return res.status(401).json({ message: "Invalid Token" });
        }
        const [encId, key] = token[1].split('.');
        const organisation = yield organisation_model_1.default.findById((0, crypt_1.decrypt)(encId), { _id: 1, apiKey: 1 });
        if (!organisation || organisation.apiKey === null || !(yield argon2_1.default.verify(organisation.apiKey, key)))
            return res.status(403).json({ message: "Invalid auth Token" });
        req.user = organisation;
        next();
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});
router.use(authenticator);
// terminal endpoints
router.get('/terminals', TerminalController.terminalIds);
router.get('/terminals/tid/:tid', TerminalController.getByTid);
router.get('/terminals/:id', TerminalController.getById);
router.get('/group-tids', TerminalController.getGroupedTids);
router.get('/group-tids/key-exchange/:id', TerminalController.triggerKeyExchangeOnGroupTid);
router.post('/terminals', [...terminalCreate_validator_1.default], TerminalController.createTerminal);
router.put('/terminals/:id', [...terminalUpdate_validator_1.default], TerminalController.updateTermial);
router.get('/terminals/update-tid/:id', TerminalController.updateTermialTidGroupTid);
router.delete('/terminals/:id', TerminalController.deleteTerminal);
// end terminals
//  profile routes
router.get('/profiles', ProfileController.index);
// end profile route
// transaction rotues
router.get('/transactions', TransactionController.index);
//end transation routes
exports.default = router;
//# sourceMappingURL=organisation.route.js.map