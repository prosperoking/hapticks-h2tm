import express from 'express';

import {profileController} from '../controllers/index.controller';

const router = express.Router();

router.get('/',profileController.index);

export default router;