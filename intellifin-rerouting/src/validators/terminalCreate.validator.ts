import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import Termninal from '../db/models/terminal.model';
import OrganisationModel from '../db/models/organisation.model';
import PTSPProfileModel from '../db/models/ptspProfile.model';

const terminalCreateValidator = createValidatedRequest(checkSchema({
    terminalId: {
        in: ['body'],
        trim: true,
        notEmpty: true,
        custom: {
            options: async (terminalId: string, {req, location, path}) =>{
                try {
                    if(!Termninal.findOne({serialNo: terminalId})) return false;
                    return true;
                } catch (error) {
                    return false;
                }
            },
            errorMessage: "Terminal",
        }
    },
    serialNo: {
        in: ['body'],
        trim: true,
        notEmpty: true,
        custom: {
            options: async (serialNo: string, {req, location, path}) =>{
                try {
                    if(Termninal.findOne({serialNo})) return false;
                    return true;
                } catch (error) {
                    return false;
                }
            },
            errorMessage: "Terminal not Found",
        }
    },
    brand: {
        in: ['body'],
        trim: true,
        notEmpty: true
    },
    deviceModel: {
        in: ['body'],
        trim: true,
        notEmpty: true
    },
    iswTid: {
        in: ['body'],
        trim: true,
    },
    organisationId: {
        in: ['body'],
        optional: true,
        custom: {
            options: async (value: string, {req, location, path}) =>{
                try {
                    if(!OrganisationModel.findById(value)) return false;
                    return true;
                } catch (error) {
                    return false;
                }
            },
            errorMessage: "Organisation not Found",
            bail: true,
        }
    },
    profileId: {
        in: ['body'],
        notEmpty: true,
        custom: {
            options: async (value: string, {req, location, path}) =>{
                try {
                    if(!PTSPProfileModel.findById(value)) return false;
                    return true;
                } catch (error) {
                    return false;
                }
            },
            errorMessage: "Profile not Found",
            bail: true,
        },
    }
}),);

export default terminalCreateValidator;