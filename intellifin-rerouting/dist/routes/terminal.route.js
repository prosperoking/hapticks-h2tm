"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_controller_1 = require("../controllers/index.controller");
const index_1 = require("../auth/index");
const adminOnly = (0, index_1.authMiddleware)(['admin']);
const router = express_1.default.Router();
router.get('/', index_controller_1.terminalController.index);
exports.default = router;
//# sourceMappingURL=terminal.route.js.map