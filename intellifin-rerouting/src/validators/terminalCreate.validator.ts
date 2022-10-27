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
                if(await Termninal.findOne({terminalId: terminalId})) return Promise.reject();
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
                if(await Termninal.findOne({serialNo})) return Promise.reject();
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
        isMongoId: true,
        custom: {
            options: async (value: string, {req, location, path}) =>{
                if(!value?.length) return;

                if(! await OrganisationModel.findById(value)) return Promise.reject();
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
                if(! await PTSPProfileModel.findById(value)) return Promise.reject();
            },
            errorMessage: "Profile not Found",
            bail: true,
        },
    }
}),);

export default terminalCreateValidator;