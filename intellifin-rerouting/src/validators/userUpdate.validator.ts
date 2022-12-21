import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import UserModel from '../db/models/user.model';
import OrganisationModel from '../db/models/organisation.model';
import webhookModel from '../db/models/webhook.model';

const profileUpdateValidator = createValidatedRequest(checkSchema({
    id: {
        in: ['params'],
        custom: {
            options: async (value: string, {req, location, path}) =>{
                try {
                    if(!UserModel.findById(value)) return false;
                    return true;
                } catch (error) {
                    return false;
                }
            },
            errorMessage: "Terminal not Found"
        }
    },
    username: {
        in: ['body'],
        trim: true,
        optional: {
            options:{
                nullable: true
            }
        },
    },
    password: {
        in: ['body'],
        trim: true,
        optional: {
            options:{
                nullable: true
            }
        },
    },
    email: {
        in: ['body'],
        trim: true,
        isPort: true,
    },
    updatePassword: {
        in: ['body'],
        toBoolean: true,
    },
    fullname: {
        in: ['body'],
        trim: true,
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
}),);

export default profileUpdateValidator;