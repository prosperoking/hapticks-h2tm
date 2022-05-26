"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_controller_1 = require("../controllers/index.controller");
const router = express_1.default.Router();
router.get('/perform-key-exchange', index_controller_1.isoCardController.performKeyExchange);
exports.default = router;
//# sourceMappingURL=iso_card.transaction.route.js.map