"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_controller_1 = require("../controllers/index.controller");
const transRoutes = express_1.default.Router();
transRoutes.post('/transaction/*', index_controller_1.routingContoller.processTransaction);
transRoutes.post('/prep', index_controller_1.routingContoller.terminalPrep);
transRoutes.post('/callhome', index_controller_1.routingContoller.callHome);
exports.default = transRoutes;
//# sourceMappingURL=routing.transaction.route.js.map