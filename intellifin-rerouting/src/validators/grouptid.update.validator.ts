import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import Terminal from '../db/models/groupTid.model';
import OrganisationModel from '../db/models/organisation.model';
import PTSPProfileModel from '../db/models/ptspProfile.model';
import { body } from 'express-validator';

const groupTidUpdateValidator = createValidatedRequest(checkSchema({
    id: {
        in: ['params'],
        custom: {
            options: async (value: string, {req, location, path}) =>{
                try {
                    if(! await Terminal.findById(value)) return Promise.reject();
                    return true;
                } catch (error) {
                    return false;
                }
            },
            errorMessage: "Terminal not Found",
            bail: true,
        }
    },
    organisationId: {
        in: ['body'],
        optional: true,
        custom: {
            options: async (value: string, {req, location, path}) =>{
                if(!value?.length) return;

                if(! await OrganisationModel.findById(value)) return Promise.reject();
            },
            errorMessage: "Organisation not Found",
            bail: true,
        }
    },
    terminalId: {
        in: ['body'],
        trim: true,
        notEmpty: true,
        custom: {
            options: async (terminalId: string, {req, location, path}) =>{
                if(await Terminal.findOne({terminalId: terminalId})) return Promise.reject();
            },
            errorMessage: "Terminal",
        }
    },
    iswTid: {
        in: ['body'],
        trim: true,
    },
    profileId: {
        in: ['body'],
        notEmpty: true,
        custom: {
            options: async (value: string, {req, location, path}) =>{
                if(! await PTSPProfileModel.findById(value)) return Promise.reject();
            },
            errorMessage: "Profile not Found",
            bail: true,
        },
    },
}),);

export default groupTidUpdateValidator;