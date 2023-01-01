import express from 'express';
import { authMiddleware } from '../auth/index';
import terminalUpdateValidator from '../validators/terminalUpdate.validator';
import profileUpdateValidator from '../validators/profileUpdate.validator';
import organisationValidator from '../validators/organisation.validator';
import webHookValidator from '../validators/webhook.validator';
import terminalBulkUploadValidator from '../validators/terminalBulkUpload.validator';
import webHookUpdateValidator from '../validators/webhookUpdate.validator';
import terminalCreateValidator from '../validators/terminalCreate.validator';

import {
    authController,
    dashboardController,
    profileController,
    terminalController,
    OrganisationController,
    WebHookController,
    UserController
} from '../controllers/index.controller';

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
router.get('/organisations', adminOnly, OrganisationController.getOrganisations);
router.get('/organisations/all', adminOnly, OrganisationController.getAllOrganisations);
router.post('/organisations', [
    adminOnly,
    ... organisationValidator
], OrganisationController.create);
router.put('/organisations', [
    adminOnly,
    ... organisationValidator
], OrganisationController.update);
router.delete('/organisations/:id', adminOnly, OrganisationController.destroy);

router.get('/profiles', profileController.index)
router.post('/profiles',[
    adminOnly,
], profileController.create)
router.put('/profiles/:id', [
    adminOnly,
    ... profileUpdateValidator
], profileController.edit)

router.delete('/profiles/:id', [
    adminOnly,
], profileController.delete)

router.get('/terminals', terminalController.index)
router.post('/terminals',
[
    adminOnly,
    ... terminalCreateValidator,
], terminalController.create)
router.post('/terminals/bulk-upload',
[
    adminOnly,
    ... terminalBulkUploadValidator,
], terminalController.bulkUpload)
router.put('/terminals/:id', [adminOnly, ... terminalUpdateValidator ], terminalController.update)
router.get('/terminals/trigger-keyexchange/:id', [adminOnly ], terminalController.triggerKeyExchange)
router.delete('/terminals/:id', adminOnly, terminalController.destroy)


router.get('/webhook', WebHookController.getWebhooks);


router.post('/webhook', [
    adminOnly,
    ... webHookValidator
], WebHookController.createWebhook);
router.post('/webhook/reset-secret/:id', [
    adminOnly,
], WebHookController.reCreateSecret);
router.put('/webhook/:id', [
    adminOnly,
    ... webHookUpdateValidator
], WebHookController.updateWebhook);

router.delete('/webhook/:id',adminOnly, WebHookController.deleteWebhook);

router.get('/webhook-requests', [ adminOnly ] ,WebHookController.webhookRequests);
router.get('/webhook-requests/retry/:id', [ adminOnly ] ,WebHookController.retryWebhook);

router.get('/auth/user', authController.getUserInfo)
router.post('/auth/logout', authController.logout)


router.get('/users', adminOnly, UserController.index);
router.get('/users/permissions', adminOnly, UserController.getAllPermissions);
router.post(
    '/users', 
    hasRoleOrPermissions(['admin'],['users.create']), 
    UserController.addUser
);
export default router;