import express from 'express';

import {authController, dashboardController, profileController, terminalController} from '../controllers/index.controller';

const router = express.Router();


router.get('/',dashboardController.index);
router.get('/profiles', profileController.index)
router.post('/profiles',profileController.create)

router.get('/terminals', terminalController.index)
router.post('/terminals', terminalController.create)

router.get('/auth/user', authController.getUserInfo)
router.get('/auth/logout', authController.logout)
export default router;