import express from 'express';
import Response from '../helpers/apiResponse';
import { apiStatusCodes as codes } from '../helpers/constants';
import isoCardRoutes from './iso_card.transaction.route';
import adminRoutes from './admin.dashboard.route';
import organisationRoutes from './organisation.route';
import { authMiddleware } from '../auth';

const indexRoutes = express.Router();
const authenticate = authMiddleware();

indexRoutes.use('/card', isoCardRoutes);
indexRoutes.use('/organisation', organisationRoutes);
indexRoutes.use('/dashboard', authenticate , adminRoutes );
indexRoutes.get('/', (req, res) => Response.send(res, codes.success, 'This app is running.'));

indexRoutes.get('*', (req, res) => Response.send(res, codes.notFound, 'Endpoint not found.'));



export default indexRoutes;