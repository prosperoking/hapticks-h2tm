import express from 'express';

import {isoCardController} from '../controllers/index.controller';

const router = express.Router();

router.get('/perform-key-exchange',isoCardController.performKeyExchange);

export default router;