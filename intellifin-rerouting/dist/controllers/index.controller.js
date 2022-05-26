"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routingContoller = exports.authController = exports.vasTransactionController = void 0;
const vas_controller_1 = __importDefault(require("./vas.controller"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const routing_controller_1 = __importDefault(require("./routing.controller"));
const vasTransactionController = new vas_controller_1.default();
exports.vasTransactionController = vasTransactionController;
const authController = new auth_controller_1.default();
exports.authController = authController;
const routingContoller = new routing_controller_1.default();
exports.routingContoller = routingContoller;
//# sourceMappingURL=index.controller.js.map