"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../auth/index");
const terminalUpdate_validator_1 = __importDefault(require("../validators/terminalUpdate.validator"));
const profileUpdate_validator_1 = __importDefault(require("../validators/profileUpdate.validator"));
const organisation_validator_1 = __importDefault(require("../validators/organisation.validator"));
const webhook_validator_1 = __importDefault(require("../validators/webhook.validator"));
const terminalBulkUpload_validator_1 = __importDefault(require("../validators/terminalBulkUpload.validator"));
const webhookUpdate_validator_1 = __importDefault(require("../validators/webhookUpdate.validator"));
const terminalCreate_validator_1 = __importDefault(require("../validators/terminalCreate.validator"));
const index_controller_1 = require("../controllers/index.controller");
const router = express_1.default.Router();
const adminOnly = (0, index_1.authMiddleware)(['admin']);
const hasRoleOrPermissions = (roles, permissions) => (0, index_1.authMiddleware)(roles, permissions);
const hasPermissions = (permissions = []) => (0, index_1.authMiddleware)([], permissions);
router.get('/', index_controller_1.dashboardController.index);
router.get('/transactions', hasRoleOrPermissions(['admin'], ['transactions.list']), index_controller_1.dashboardController.transactions);
router.get('/transactions/export', hasRoleOrPermissions(['admin'], ['transactions.list']), index_controller_1.dashboardController.export);
router.get('/organisations', adminOnly, index_controller_1.OrganisationController.getOrganisations);
router.get('/organisations/all', adminOnly, index_controller_1.OrganisationController.getAllOrganisations);
router.post('/organisations', [
    adminOnly,
    ...organisation_validator_1.default
], index_controller_1.OrganisationController.create);
router.put('/organisations', [
    adminOnly,
    ...organisation_validator_1.default
], index_controller_1.OrganisationController.update);
router.delete('/organisations/:id', adminOnly, index_controller_1.OrganisationController.destroy);
router.get('/profiles', index_controller_1.profileController.index);
router.post('/profiles', [
    adminOnly,
], index_controller_1.profileController.create);
router.put('/profiles/:id', [
    adminOnly,
    ...profileUpdate_validator_1.default
], index_controller_1.profileController.edit);
router.delete('/profiles/:id', [
    adminOnly,
], index_controller_1.profileController.delete);
router.get('/terminals', index_controller_1.terminalController.index);
router.post('/terminals', [
    adminOnly,
    ...terminalCreate_validator_1.default,
], index_controller_1.terminalController.create);
router.post('/terminals/bulk-upload', [
    adminOnly,
    ...terminalBulkUpload_validator_1.default,
], index_controller_1.terminalController.bulkUpload);
router.get('/terminals/export', [
    adminOnly
], index_controller_1.terminalController.export);
router.put('/terminals/:id', [adminOnly, ...terminalUpdate_validator_1.default], index_controller_1.terminalController.update);
router.get('/terminals/trigger-keyexchange/:id', [adminOnly], index_controller_1.terminalController.triggerKeyExchange);
router.delete('/terminals/:id', adminOnly, index_controller_1.terminalController.destroy);
router.get('/webhook', index_controller_1.WebHookController.getWebhooks);
router.post('/webhook', [
    adminOnly,
    ...webhook_validator_1.default
], index_controller_1.WebHookController.createWebhook);
router.post('/webhook/reset-secret/:id', [
    adminOnly,
], index_controller_1.WebHookController.reCreateSecret);
router.put('/webhook/:id', [
    adminOnly,
    ...webhookUpdate_validator_1.default
], index_controller_1.WebHookController.updateWebhook);
router.delete('/webhook/:id', adminOnly, index_controller_1.WebHookController.deleteWebhook);
router.get('/webhook-requests', [adminOnly], index_controller_1.WebHookController.webhookRequests);
router.get('/webhook-requests/retry/:id', [adminOnly], index_controller_1.WebHookController.retryWebhook);
router.get('/auth/user', index_controller_1.authController.getUserInfo);
router.post('/auth/logout', index_controller_1.authController.logout);
router.get('/users', adminOnly, index_controller_1.UserController.index);
router.get('/users/permissions', adminOnly, index_controller_1.UserController.getAllPermissions);
router.post('/users', hasRoleOrPermissions(['admin'], ['users.create']), index_controller_1.UserController.addUser);
exports.default = router;
//# sourceMappingURL=admin.dashboard.route.js.map