import express from 'express';
import Response from '../helpers/apiResponse';
import { apiStatusCodes as codes } from '../helpers/constants';
import vasRoutes from './vas.transaction.route';
import transRoutes from './routing.transaction.route';
import isoCardRoutes from './iso_card.transaction.route';
import adminRoutes from './admin.dashboard.route';
 
const indexRoutes = express.Router();

indexRoutes.use('/intellifin', transRoutes);
indexRoutes.use('/intellifin', vasRoutes);
indexRoutes.use('/card', isoCardRoutes);
indexRoutes.use('/dashboard', adminRoutes );
indexRoutes.get('/', (req, res) => Response.send(res, codes.success, 'This app is running.'));

indexRoutes.get('*', (req, res) => Response.send(res, codes.notFound, 'Endpoint not found.'));



export default indexRoutes;