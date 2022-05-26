"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileController = exports.terminalController = exports.dashboardController = exports.isoCardController = exports.routingContoller = exports.authController = exports.vasTransactionController = void 0;
const vas_controller_1 = __importDefault(require("./vas.controller"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const routing_controller_1 = __importDefault(require("./routing.controller"));
const iso_card_controller_1 = __importDefault(require("./iso_card.controller"));
const dashboard_controller_1 = __importDefault(require("./dashboard.controller"));
const profiles_controller_1 = __importDefault(require("./profiles.controller"));
const terminal_controller_1 = __importDefault(require("./terminal.controller"));
const vasTransactionController = new vas_controller_1.default();
exports.vasTransactionController = vasTransactionController;
const authController = new auth_controller_1.default();
exports.authController = authController;
const routingContoller = new routing_controller_1.default();
exports.routingContoller = routingContoller;
const isoCardController = new iso_card_controller_1.default();
exports.isoCardController = isoCardController;
const dashboardController = new dashboard_controller_1.default();
exports.dashboardController = dashboardController;
const profileController = new profiles_controller_1.default();
exports.profileController = profileController;
const terminalController = new terminal_controller_1.default();
exports.terminalController = terminalController;
//# sourceMappingURL=index.controller.js.map