import express from 'express';

import {terminalController} from '../controllers/index.controller';

const router = express.Router();

router.get('/',terminalController.index);

export default router;