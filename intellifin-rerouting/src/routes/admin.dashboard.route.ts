import express from 'express';
import { authMiddleware } from '../auth/index';
import terminalUpdateValidator from '../validators/terminalUpdate.validator';
import profileUpdateValidator from '../validators/profileUpdate.validator';
import organisationValidator from '../validators/organisation.validator';
import webHookValidator from '../validators/webhook.validator';
import terminalBulkUploadValidator from '../validators/terminalBulkUpload.validator';
import webHookUpdateValidator from '../validators/webhookUpdate.validator';
import terminalCreateValidator from '../validators/terminalCreate.validator';
import groupTidCreateValidator from '../validators/grouptid.create.validator';
import groupTidUpdateValidator from '../validators/grouptid.update.validator';

import {
    authController,
    dashboardController,
    profileController,
    terminalController,
    OrganisationController,
    WebHookController,
    UserController,
    groupTidController,
} from '../controllers/index.controller';
import { body } from 'express-validator';

const router = express.Router();

const adminOnly = authMiddleware(['admin'])
const hasRoleOrPermissions =
    (roles: string[], permissions: string[])=>authMiddleware(roles, permissions)
const hasPermissions = (permissions: string[] = [])=>authMiddleware([], permissions)

router.get('/', dashboardController.index);
router.get('/transactions',
    hasRoleOrPermissions(['admin'], ['transactions.list']),
    dashboardController.transactions
);
router.get('/transactions/export',
    hasRoleOrPermissions(['admin'], ['transactions.export']),
    dashboardController.export
);

router.get('/organisations', hasRoleOrPermissions(['admin'],['organisations.list']), OrganisationController.getOrganisations);
router.get('/organisations/all', hasRoleOrPermissions(['admin'],['organisations.list']), OrganisationController.getAllOrganisations);
router.post('/organisations', [
    hasRoleOrPermissions(['admin'],['organisations.create']),
    ... organisationValidator
], OrganisationController.create);

router.get('/organisations/generate-api-key/:id', [
    hasRoleOrPermissions(['admin'],['organisations.create-api-key']),
], OrganisationController.generateApiKey);
router.put('/organisations', [
    hasRoleOrPermissions(['admin'],['organisations.update']),
    ... organisationValidator
], OrganisationController.update);
router.delete('/organisations/:id', hasRoleOrPermissions(['admin'],['users.delete']), OrganisationController.destroy);

router.get('/profiles', hasRoleOrPermissions(['admin'],['profiles.list']),profileController.index)
router.post(
    '/profiles/:id/rotate-keys',
    [hasRoleOrPermissions(['admin'],['profiles.rotate-keys']),  body('type').exists().isIn(['isw','hydrogen'])],
    profileController.rotateZpk
)

router.post('/profiles',[
    hasRoleOrPermissions(['admin'],['profiles.create']),
], profileController.create)
router.put('/profiles/:id', [
    hasRoleOrPermissions(['admin'],['profiles.update']),
    ... profileUpdateValidator
], profileController.edit)

router.delete('/profiles/:id', [
    hasRoleOrPermissions(['admin'],['profiles.delete']),
], profileController.delete)

router.get(
    '/terminals',
    hasRoleOrPermissions(['admin'],['terminals.list']),
    terminalController.index
)
router.post('/terminals',
[
    hasRoleOrPermissions(['admin'],['terminals.create']),
    ... terminalCreateValidator,
], terminalController.create)
router.post('/terminals/bulk-upload',
[
    hasRoleOrPermissions(['admin'],['terminals.bulk_upload']),
    ... terminalBulkUploadValidator,
], terminalController.bulkUpload)

router.get(
    '/terminals/export',
    [hasRoleOrPermissions(['admin'],['terminals.export'])],
    terminalController.export
)

router.put(
    '/terminals/:id',
    [hasRoleOrPermissions(['admin'],['terminals.update']), ... terminalUpdateValidator ],
    terminalController.update
)
router.get('/terminals/trigger-keyexchange/:id',
hasRoleOrPermissions(['admin'],['terminals.trigger-keyexchange'])
, terminalController.triggerKeyExchange)
router.delete('/terminals/:id',
 hasRoleOrPermissions(['admin'],['terminals.delete']),
 terminalController.destroy
)

router.get(
    '/group-tids',
    hasRoleOrPermissions(['admin'],['groupTid.list']),
    groupTidController.index
)
router.get(
    '/group-tids/all',
    hasRoleOrPermissions(['admin'],['groupTid.list']),
    groupTidController.all
)

router.post('/group-tids',
[
    hasRoleOrPermissions(['admin'],['groupTid.create']),
    ... groupTidCreateValidator,
], groupTidController.create)

router.put(
    '/group-tids/:id',
    [hasRoleOrPermissions(['admin'],['groupTid.update']), ... groupTidUpdateValidator ],
    groupTidController.update
)

router.get(
    '/group-tids/trigger-keyexchange/:id',
    hasRoleOrPermissions(['admin'],['groupTid.trigger-keyexchange']),
    groupTidController.triggerKeyExchange
)

router.delete('/group-tids/:id',
 hasRoleOrPermissions(['admin'],['groupTid.delete']),
 groupTidController.destroy
)

router.get(
    '/generated-tids',
    hasRoleOrPermissions(['admin'],['generate-tids.list']),
    terminalController.generatedTids
)
router.get(
    '/generated-tids/stats',
    hasRoleOrPermissions(['admin'],['generate-tids.list']),
    terminalController.generatedTidStat
)

router.post(
    '/generate-tids',
    hasRoleOrPermissions(['admin'],['generate-tids.generate']),
    terminalController.generateTids
)


router.get('/webhook',hasRoleOrPermissions(['admin'],['webhook_listeners.list']), WebHookController.getWebhooks);


router.post('/webhook', [
    hasRoleOrPermissions(['admin'],['webhook_listeners.create']),
    ... webHookValidator
], WebHookController.createWebhook);
router.post('/webhook/reset-secret/:id', [
    hasRoleOrPermissions(['admin'],['webhook_listeners.update']),
], WebHookController.reCreateSecret);
router.put('/webhook/:id', [
    hasRoleOrPermissions(['admin'],['webhook_listeners.update']),
    ... webHookUpdateValidator
], WebHookController.updateWebhook);

router.delete('/webhook/:id',hasRoleOrPermissions(['admin'],['webhook_listeners.delete']), WebHookController.deleteWebhook);

router.get('/webhook-requests', hasRoleOrPermissions(['admin'],['webhooks.list']) ,WebHookController.webhookRequests);
router.get('/webhook-requests/retry/:id', hasRoleOrPermissions(['admin'],['webhooks.retry']) ,WebHookController.retryWebhook);

router.get('/auth/user', authController.getUserInfo)
router.post('/auth/logout', authController.logout)


router.get('/users', hasRoleOrPermissions(['admin'],['users.list']), UserController.index);
router.get('/users/permissions', hasRoleOrPermissions(['admin'],['users.create']), UserController.getAllPermissions);
router.post(
    '/users',
    hasRoleOrPermissions(['admin'],['users.create']),
    UserController.addUser
);
router.put(
    '/users',
    hasRoleOrPermissions(['admin'],['users.update']),
    UserController.deleteUser
);
router.delete(
    '/users',
    hasRoleOrPermissions(['admin'],['users.delete']),
    UserController.deleteUser
);
export default router;