import express from 'express';

import {authController, dashboardController, profileController, terminalController} from '../controllers/index.controller';

const router = express.Router();


router.get('/',dashboardController.index);
router.get('/transactions',dashboardController.transactions);
router.get('/profiles', profileController.index)
router.post('/profiles',profileController.create)
router.put('/profiles/:id',profileController.edit)

router.get('/terminals', terminalController.index)
router.post('/terminals', terminalController.create)
router.put('/terminals/:id', terminalController.update)

router.get('/auth/user', authController.getUserInfo)
router.get('/auth/logout', authController.logout)
export default router;