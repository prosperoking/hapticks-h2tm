import express from 'express';
import { authMiddleware } from '../auth/index';
import terminalUpdateValidator from '../validators/terminalUpdate.validator';
import profileUpdateValidator from '../validators/profileUpdate.validator';

import {
    authController,
    dashboardController,
    profileController,
    terminalController,
    OrganisationController
} from '../controllers/index.controller';

const router = express.Router();

const adminOnly = authMiddleware(['admin'])

router.get('/', dashboardController.index);
router.get('/transactions', dashboardController.transactions);
router.get('/organisations', adminOnly, OrganisationController.getOrganisations);
router.post('/organisations', adminOnly, OrganisationController.create);
router.put('/organisations', adminOnly, OrganisationController.update);
router.delete('/organisations', adminOnly, OrganisationController.destroy);

router.get('/profiles', profileController.index)
router.post('/profiles',[
    adminOnly,
    
], profileController.create)
router.put('/profiles/:id', [
    adminOnly,
    ... profileUpdateValidator
], profileController.edit)

router.get('/terminals', terminalController.index)
router.post('/terminals',
[
    adminOnly,
    ... terminalUpdateValidator,
], terminalController.create)
router.put('/terminals/:id', [adminOnly, ... terminalUpdateValidator ], terminalController.update)
router.delete('/terminals/:id', adminOnly, terminalController.destroy)

router.get('/auth/user', authController.getUserInfo)
router.get('/auth/logout', authController.logout)
export default router;