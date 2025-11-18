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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeController = exports.groupTidController = exports.UserController = exports.WebHookController = exports.OrganisationController = exports.profileController = exports.terminalController = exports.dashboardController = exports.isoCardController = exports.routingContoller = exports.authController = exports.vasTransactionController = void 0;
const transaction_controller_1 = __importDefault(require("./transaction.controller"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const routing_controller_1 = __importDefault(require("./routing.controller"));
const iso_card_controller_1 = __importDefault(require("./iso_card.controller"));
const dashboard_controller_1 = __importDefault(require("./dashboard.controller"));
const profiles_controller_1 = __importDefault(require("./profiles.controller"));
const terminal_controller_1 = __importDefault(require("./terminal.controller"));
const groupTid_controller_1 = __importDefault(require("./groupTid.controller"));
const OrganisationController = __importStar(require("./organisation.controller"));
exports.OrganisationController = OrganisationController;
const WebHookController = __importStar(require("./webhook.controller"));
exports.WebHookController = WebHookController;
const UserController = __importStar(require("./user.controller"));
exports.UserController = UserController;
const BridgeController = __importStar(require("./connectionManager.controller"));
exports.BridgeController = BridgeController;
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
const groupTidController = new groupTid_controller_1.default();
exports.groupTidController = groupTidController;
//# sourceMappingURL=index.controller.js.map