import express from 'express';

import {terminalController} from '../controllers/index.controller';
import { authMiddleware } from '../auth/index';

const adminOnly = authMiddleware(['admin'])

const router = express.Router();

router.get('/',terminalController.index);

export default router;