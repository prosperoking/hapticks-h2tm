"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_controller_1 = require("../controllers/index.controller");
const vasRoutes = express_1.default.Router();
vasRoutes.post('/vas/*', index_controller_1.vasTransactionController.processVasTransaction);
vasRoutes.post('/lookup/vas/*', index_controller_1.vasTransactionController.lookup);
exports.default = vasRoutes;
//# sourceMappingURL=vas.transaction.route.js.map