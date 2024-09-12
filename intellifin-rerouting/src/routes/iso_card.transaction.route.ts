import express from 'express';

import {isoCardController} from '../controllers/index.controller';
import { translateSlimCardPayload } from '../helpers/iso';


const router = express.Router();

router.get('/perform-key-exchange',isoCardController.performKeyExchange);
router.get('/terminal-info', isoCardController.getTerminalInfo);
router.post('/processCard', isoCardController.processCard);
router.post('/checkBalance', isoCardController.checkBalance);
router.post('/requery', isoCardController.requeryTransaction);
router.post('/purchase', translateSlimCardPayload, isoCardController.processCard);
router.post('/balance', translateSlimCardPayload, isoCardController.checkBalance);
export default router;