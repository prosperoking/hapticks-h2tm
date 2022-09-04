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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganisationController = exports.profileController = exports.terminalController = exports.dashboardController = exports.isoCardController = exports.routingContoller = exports.authController = exports.vasTransactionController = void 0;
const transaction_controller_1 = __importDefault(require("./transaction.controller"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const routing_controller_1 = __importDefault(require("./routing.controller"));
const iso_card_controller_1 = __importDefault(require("./iso_card.controller"));
const dashboard_controller_1 = __importDefault(require("./dashboard.controller"));
const profiles_controller_1 = __importDefault(require("./profiles.controller"));
const terminal_controller_1 = __importDefault(require("./terminal.controller"));
const OrganisationController = __importStar(require("./organisation.controller"));
exports.OrganisationController = OrganisationController;
const vasTransactionController = new transaction_controller_1.default();
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