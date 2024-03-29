import express from 'express';

import {isoCardController} from '../controllers/index.controller';

const router = express.Router();

router.get('/perform-key-exchange',isoCardController.performKeyExchange);
router.get('/terminal-info', isoCardController.getTerminalInfo);
router.post('/processCard', isoCardController.processCard);
router.post('/checkBalance', isoCardController.checkBalance);
router.post('/requery', isoCardController.requeryTransaction);
export default router;