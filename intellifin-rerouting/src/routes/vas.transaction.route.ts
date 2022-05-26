import express from 'express';
import { vasTransactionController } from '../controllers/index.controller';

const vasRoutes = express.Router();

vasRoutes.post('/vas/*', vasTransactionController.processVasTransaction);

vasRoutes.post('/lookup/vas/*', vasTransactionController.lookup);

export default vasRoutes;

