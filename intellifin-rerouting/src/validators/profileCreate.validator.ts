import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import Termninal from '../db/models/terminal.model';
import webhookModel from '../db/models/webhook.model';
import OrganisationModel from '../db/models/organisation.model';

const profileCreateValidator = createValidatedRequest(checkSchema({
    componentKey1: {
        in: ['body'],
        trim: true,
        optional: {
            options:{
                nullable: true
            }
        },
    },
    isoHost: {
        in: ['body'],
        trim: true,
        optional:{
            options:{
                nullable: true,
            }
        },
        isIP: true,
    },
    allowProcessorOverride: {
        in: ['body'],
        isBoolean: true,
        customSanitizer: {
            options: 
                value => ['true','false','1','0'].includes(String(value)
                            .toLowerCase())
        },
        optional:{
            options:{
                nullable: true,
            }
        },
    },
    isoPort: {
        in: ['body'],
        trim: true,
        isPort: true,
        optional:{
            options:{
                nullable: true,
            }
        },
    },
    isSSl: {
        in: ['body'],
        toBoolean: true,
        optional:{
            options:{
                nullable: true,
            }
        },
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
    type: {
        in: ['body'],
        matches: {
            options: [/\b(?:generic|intelliffin)\b/],
            errorMessage: "Invalid Profile type",
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

export default profileCreateValidator;