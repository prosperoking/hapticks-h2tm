import express from 'express';
import { routingContoller } from '../controllers/index.controller';

const transRoutes = express.Router();

transRoutes.post('/transaction/*', routingContoller.processTransaction);
transRoutes.post('/prep', routingContoller.terminalPrep);
transRoutes.post('/callhome', routingContoller.callHome);

export default transRoutes;

