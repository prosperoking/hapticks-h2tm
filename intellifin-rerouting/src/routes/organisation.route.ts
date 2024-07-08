import express, { NextFunction, Request, Response } from 'express';
import OrganisationModel from '../db/models/organisation.model';
import logger from '../helpers/logger';
import { decrypt } from '../helpers/crypt';
import argon2 from 'argon2';
import *  as TerminalController from '../controllers/organisation/terminal.controller';
import *  as ProfileController from '../controllers/organisation/profile.controller';
import *  as TransactionController from '../controllers/organisation/transaction.controller';
import terminalCreateValidator from '../validators/terminalCreate.validator';
import terminalUpdateValidator from '../validators/terminalUpdate.validator';

const router = express.Router();
const authenticator = async (req: Request, res: Response , next : NextFunction)=>{
    try {
        const authHeader = req.header("authorization")

        if(!authHeader?.length || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message:"No authorisation"})
        }

        const  token = authHeader.split(' ')
        if(token.length !== 2) {
            return res.status(401).json({message:"Invalid Token"})
        }
        const [encId, key] = token[1].split('.')
        const organisation = await OrganisationModel.findById(decrypt(encId),{_id:1, apiKey:1});

        if (!organisation || organisation.apiKey === null || !await argon2.verify(organisation.apiKey, key))
            return res.status(403).json({ message: "Invalid auth Token" });
        req.user = organisation;
        next();
    } catch (error) {
        logger.error(error);
        res.status(500).json({message:"Server Error"})
    }
}

router.use(authenticator)

// terminal endpoints
router.get('/terminals',  TerminalController.terminalIds);
router.get('/terminals/tid/:tid',  TerminalController.getByTid);
router.get('/terminals/:id',  TerminalController.getById);
router.get('/group-tids',  TerminalController.getGroupedTids);
router.get('/group-tids/key-exchange/:id',  TerminalController.getGroupedTids);
router.post('/terminals', [... terminalCreateValidator],  TerminalController.createTerminal);
router.put('/terminals/:id', [... terminalUpdateValidator],  TerminalController.updateTermial);
router.delete('/terminals/:id',  TerminalController.deleteTerminal);

// end terminals

//  profile routes
router.get('/profiles',  ProfileController.index);
// end profile route

// transaction rotues
router.get('/transactions',  TransactionController.index);
//end transation routes

export default router;