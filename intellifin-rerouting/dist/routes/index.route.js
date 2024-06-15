"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiResponse_1 = __importDefault(require("../helpers/apiResponse"));
const constants_1 = require("../helpers/constants");
const iso_card_transaction_route_1 = __importDefault(require("./iso_card.transaction.route"));
const admin_dashboard_route_1 = __importDefault(require("./admin.dashboard.route"));
const organisation_route_1 = __importDefault(require("./organisation.route"));
const auth_1 = require("../auth");
const indexRoutes = express_1.default.Router();
const authenticate = (0, auth_1.authMiddleware)();
indexRoutes.use('/card', iso_card_transaction_route_1.default);
indexRoutes.use('/organisation', organisation_route_1.default);
indexRoutes.use('/dashboard', authenticate, admin_dashboard_route_1.default);
indexRoutes.get('/', (req, res) => apiResponse_1.default.send(res, constants_1.apiStatusCodes.success, 'This app is running.'));
indexRoutes.get('*', (req, res) => apiResponse_1.default.send(res, constants_1.apiStatusCodes.notFound, 'Endpoint not found.'));
exports.default = indexRoutes;
//# sourceMappingURL=index.route.js.map