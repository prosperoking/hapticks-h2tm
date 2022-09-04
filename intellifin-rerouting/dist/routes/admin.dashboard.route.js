"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../auth/index");
const terminalUpdate_validator_1 = __importDefault(require("../validators/terminalUpdate.validator"));
const profileUpdate_validator_1 = __importDefault(require("../validators/profileUpdate.validator"));
const index_controller_1 = require("../controllers/index.controller");
const router = express_1.default.Router();
const adminOnly = (0, index_1.authMiddleware)(['admin']);
router.get('/', index_controller_1.dashboardController.index);
router.get('/transactions', index_controller_1.dashboardController.transactions);
router.get('/organisations', adminOnly, index_controller_1.OrganisationController.getOrganisations);
router.post('/organisations', adminOnly, index_controller_1.OrganisationController.create);
router.put('/organisations', adminOnly, index_controller_1.OrganisationController.update);
router.delete('/organisations', adminOnly, index_controller_1.OrganisationController.destroy);
router.get('/profiles', index_controller_1.profileController.index);
router.post('/profiles', [
    adminOnly,
], index_controller_1.profileController.create);
router.put('/profiles/:id', [
    adminOnly,
    ...profileUpdate_validator_1.default
], index_controller_1.profileController.edit);
router.get('/terminals', index_controller_1.terminalController.index);
router.post('/terminals', [
    adminOnly,
    ...terminalUpdate_validator_1.default,
], index_controller_1.terminalController.create);
router.put('/terminals/:id', [adminOnly, ...terminalUpdate_validator_1.default], index_controller_1.terminalController.update);
router.delete('/terminals/:id', adminOnly, index_controller_1.terminalController.destroy);
router.get('/auth/user', index_controller_1.authController.getUserInfo);
router.get('/auth/logout', index_controller_1.authController.logout);
exports.default = router;
//# sourceMappingURL=admin.dashboard.route.js.map