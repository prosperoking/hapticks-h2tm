"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiResponse_1 = __importDefault(require("../helpers/apiResponse"));
const constants_1 = require("../helpers/constants");
const vas_transaction_route_1 = __importDefault(require("./vas.transaction.route"));
const routing_transaction_route_1 = __importDefault(require("./routing.transaction.route"));
const iso_card_transaction_route_1 = __importDefault(require("./iso_card.transaction.route"));
const admin_dashboard_route_1 = __importDefault(require("./admin.dashboard.route"));
const indexRoutes = express_1.default.Router();
indexRoutes.use('/intellifin', routing_transaction_route_1.default);
indexRoutes.use('/intellifin', vas_transaction_route_1.default);
indexRoutes.use('/card', iso_card_transaction_route_1.default);
indexRoutes.use('/dashboard', admin_dashboard_route_1.default);
indexRoutes.get('/', (req, res) => apiResponse_1.default.send(res, constants_1.apiStatusCodes.success, 'This app is running.'));
indexRoutes.get('*', (req, res) => apiResponse_1.default.send(res, constants_1.apiStatusCodes.notFound, 'Endpoint not found.'));
exports.default = indexRoutes;
//# sourceMappingURL=index.route.js.map