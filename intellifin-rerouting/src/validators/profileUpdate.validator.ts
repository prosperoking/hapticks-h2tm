import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import PTSPProfileModel from '../db/models/ptspProfile.model';
import OrganisationModel from '../db/models/organisation.model';
import webhookModel from '../db/models/webhook.model';

const profileUpdateValidator = createValidatedRequest(checkSchema({
    id: {
        in: ['params'],
        custom: {
            options: async (value: string, {req, location, path}) =>{
                try {
                    if(!PTSPProfileModel.findById(value)) return false;
                    return true;
                } catch (error) {
                    return false;
                }
            },
            errorMessage: "Terminal not Found"
        }
    },
    componentKey1: {
        in: ['body'],
        trim: true,
        optional: {
            options:{
                nullable: false
            }
        },
    },
    isoHost: {
        in: ['body'],
        trim: true,
        isIP: true,
    },
    isoPort: {
        in: ['body'],
        trim: true,
        isPort: true,
    },
    isSSl: {
        in: ['body'],
        toBoolean: true,
    },
    iswDestinationAccount: {
        in: ['body'],
        trim: true,
        optional: true,
    },
    iswInstitutionCode: {
        in: ['body'],
        trim: true,
        optional: true,
    },
    iswMid: {
        in: ['body'],
        trim: true,
        optional: true,
        isLength: {
            errorMessage: "invalid MID",
            if: (value)=>value?.length,
            options:{
                min: 15,
                max: 15
            }
        }
    },
    iswSwitchAmount: {
        in: ['body'],
        trim: true,
    },
    title: {
        in: ['body'],
        trim: true,
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
    webhookId: {
        in: ['body'],
        optional: true,
        custom: {
            options: async (value: string, {req, location, path}) =>{
                if(!value?.length) return;
                if(!await webhookModel.findById(value)) return Promise.reject();
            },
            errorMessage: "Webhook not found",
            bail: true,
        }
    }
}),);

export default profileUpdateValidator;