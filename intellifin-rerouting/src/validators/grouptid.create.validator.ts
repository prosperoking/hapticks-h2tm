import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import OrganisationModel from '../db/models/organisation.model';
import PTSPProfileModel from '../db/models/ptspProfile.model';
import { body } from 'express-validator';
import groupTidModel from '../db/models/groupTid.model';

const groupTidCreateValidator = createValidatedRequest(checkSchema({
    terminalId: {
        in: ['body'],
        trim: true,
        notEmpty: true,
        custom: {
            options: async (terminalId: string, {req, location, path}) =>{
                if(await groupTidModel.findOne({terminalId: terminalId})) return Promise.reject();
            },
            errorMessage: "Terminal Id exists",
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

export default groupTidCreateValidator;