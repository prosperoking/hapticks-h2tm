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
const grouptid_create_validator_1 = __importDefault(require("../validators/grouptid.create.validator"));
const grouptid_update_validator_1 = __importDefault(require("../validators/grouptid.update.validator"));
const profileCreate_validator_1 = __importDefault(require("../validators/profileCreate.validator"));
const index_controller_1 = require("../controllers/index.controller");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const adminOnly = (0, index_1.authMiddleware)(['admin']);
const hasRoleOrPermissions = (roles, permissions) => (0, index_1.authMiddleware)(roles, permissions);
const hasPermissions = (permissions = []) => (0, index_1.authMiddleware)([], permissions);
router.get('/', index_controller_1.dashboardController.index);
router.get('/transactions', hasRoleOrPermissions(['admin'], ['transactions.list']), index_controller_1.dashboardController.transactions);
router.get('/transactions/export', hasRoleOrPermissions(['admin'], ['transactions.export']), index_controller_1.dashboardController.export);
router.get('/organisations', hasRoleOrPermissions(['admin'], ['organisations.list']), index_controller_1.OrganisationController.getOrganisations);
router.get('/organisations/all', hasRoleOrPermissions(['admin'], ['organisations.list']), index_controller_1.OrganisationController.getAllOrganisations);
router.post('/organisations', [
    hasRoleOrPermissions(['admin'], ['organisations.create']),
    ...organisation_validator_1.default
], index_controller_1.OrganisationController.create);
router.get('/organisations/generate-api-key/:id', [
    hasRoleOrPermissions(['admin'], ['organisations.create-api-key']),
], index_controller_1.OrganisationController.generateApiKey);
router.put('/organisations', [
    hasRoleOrPermissions(['admin'], ['organisations.update']),
    ...organisation_validator_1.default
], index_controller_1.OrganisationController.update);
router.delete('/organisations/:id', hasRoleOrPermissions(['admin'], ['users.delete']), index_controller_1.OrganisationController.destroy);
router.get('/profiles', hasRoleOrPermissions(['admin'], ['profiles.list']), index_controller_1.profileController.index);
router.post('/profiles/:id/rotate-keys', [hasRoleOrPermissions(['admin'], ['profiles.rotate-keys']), (0, express_validator_1.body)('type').exists().isIn(['isw', 'hydrogen'])], index_controller_1.profileController.rotateZpk);
router.post('/profiles', [
    hasRoleOrPermissions(['admin'], ['profiles.create']),
    ...profileCreate_validator_1.default,
], index_controller_1.profileController.create);
router.post('/profiles/clone', [
    hasRoleOrPermissions(['admin'], ['profiles.create']),
], index_controller_1.profileController.cloneProfile);
router.put('/profiles/:id', [
    hasRoleOrPermissions(['admin'], ['profiles.update']),
    ...profileUpdate_validator_1.default
], index_controller_1.profileController.edit);
router.put('/profiles/unlink/:id', [
    hasRoleOrPermissions(['admin'], ['profiles.update']),
], index_controller_1.profileController.unlink);
router.delete('/profiles/:id', [
    hasRoleOrPermissions(['admin'], ['profiles.delete']),
], index_controller_1.profileController.delete);
router.get('/terminals', hasRoleOrPermissions(['admin'], ['terminals.list']), index_controller_1.terminalController.index);
router.post('/terminals', [
    hasRoleOrPermissions(['admin'], ['terminals.create']),
    ...terminalCreate_validator_1.default,
], index_controller_1.terminalController.create);
router.post('/terminals/bulk-upload', [
    hasRoleOrPermissions(['admin'], ['terminals.bulk_upload']),
    ...terminalBulkUpload_validator_1.default,
], index_controller_1.terminalController.bulkUpload);
router.get('/terminals/export', [hasRoleOrPermissions(['admin'], ['terminals.export'])], index_controller_1.terminalController.export);
router.put('/terminals/:id', [hasRoleOrPermissions(['admin'], ['terminals.update']), ...terminalUpdate_validator_1.default], index_controller_1.terminalController.update);
router.get('/terminals/trigger-keyexchange/:id', hasRoleOrPermissions(['admin'], ['terminals.trigger-keyexchange']), index_controller_1.terminalController.triggerKeyExchange);
router.delete('/terminals/:id', hasRoleOrPermissions(['admin'], ['terminals.delete']), index_controller_1.terminalController.destroy);
router.get('/group-tids', hasRoleOrPermissions(['admin'], ['groupTid.list']), index_controller_1.groupTidController.index);
router.get('/group-tids/all', hasRoleOrPermissions(['admin'], ['groupTid.list']), index_controller_1.groupTidController.all);
router.post('/group-tids', [
    hasRoleOrPermissions(['admin'], ['groupTid.create']),
    ...grouptid_create_validator_1.default,
], index_controller_1.groupTidController.create);
router.put('/group-tids/:id', [hasRoleOrPermissions(['admin'], ['groupTid.update']), ...grouptid_update_validator_1.default], index_controller_1.groupTidController.update);
router.get('/group-tids/trigger-keyexchange/:id', hasRoleOrPermissions(['admin'], ['groupTid.trigger-keyexchange']), index_controller_1.groupTidController.triggerKeyExchange);
router.delete('/group-tids/:id', hasRoleOrPermissions(['admin'], ['groupTid.delete']), index_controller_1.groupTidController.destroy);
router.get('/generated-tids', hasRoleOrPermissions(['admin'], ['generate-tids.list']), index_controller_1.terminalController.generatedTids);
router.get('/generated-tids/stats', hasRoleOrPermissions(['admin'], ['generate-tids.list']), index_controller_1.terminalController.generatedTidStat);
router.post('/generate-tids', hasRoleOrPermissions(['admin'], ['generate-tids.generate']), index_controller_1.terminalController.generateTids);
router.get('/webhook', hasRoleOrPermissions(['admin'], ['webhook_listeners.list']), index_controller_1.WebHookController.getWebhooks);
router.post('/webhook', [
    hasRoleOrPermissions(['admin'], ['webhook_listeners.create']),
    ...webhook_validator_1.default
], index_controller_1.WebHookController.createWebhook);
router.post('/webhook/reset-secret/:id', [
    hasRoleOrPermissions(['admin'], ['webhook_listeners.update']),
], index_controller_1.WebHookController.reCreateSecret);
router.put('/webhook/:id', [
    hasRoleOrPermissions(['admin'], ['webhook_listeners.update']),
    ...webhookUpdate_validator_1.default
], index_controller_1.WebHookController.updateWebhook);
router.delete('/webhook/:id', hasRoleOrPermissions(['admin'], ['webhook_listeners.delete']), index_controller_1.WebHookController.deleteWebhook);
router.get('/webhook-requests', hasRoleOrPermissions(['admin'], ['webhooks.list']), index_controller_1.WebHookController.webhookRequests);
router.get('/webhook-requests/retry/:id', hasRoleOrPermissions(['admin'], ['webhooks.retry']), index_controller_1.WebHookController.retryWebhook);
router.get('/auth/user', index_controller_1.authController.getUserInfo);
router.post('/auth/logout', index_controller_1.authController.logout);
router.get('/users', hasRoleOrPermissions(['admin'], ['users.list']), index_controller_1.UserController.index);
router.get('/users/permissions', hasRoleOrPermissions(['admin'], ['users.create']), index_controller_1.UserController.getAllPermissions);
router.post('/users', hasRoleOrPermissions(['admin'], ['users.create']), index_controller_1.UserController.addUser);
router.put('/users', hasRoleOrPermissions(['admin'], ['users.update']), index_controller_1.UserController.deleteUser);
router.delete('/users', hasRoleOrPermissions(['admin'], ['users.delete']), index_controller_1.UserController.deleteUser);
exports.default = router;
//# sourceMappingURL=admin.dashboard.route.js.map