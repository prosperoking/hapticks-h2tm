import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import PTSPProfileModel from '../db/models/ptspProfile.model';
import OrganisationModel from '../db/models/organisation.model';

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
    },
    iswInstitutionCode: {
        in: ['body'],
        trim: true,
    },
    iswMid: {
        in: ['body'],
        trim: true,
        isLength: {
            errorMessage: "invalid MID",
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
        custom: {
            options: async (value: string, {req, location, path}) =>{
                try {
                    console.log("Param ID: ",value,)
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
}),);

export default profileUpdateValidator;