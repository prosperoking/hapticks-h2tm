import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import OrganisationModel from '../db/models/organisation.model';

const organisationValidator = createValidatedRequest(checkSchema({
    id: {
        in: ['params'],
        custom: {
            options: async (value: string, {req, location, path}) =>{
                try {
                    if(!OrganisationModel.findById(value)) return false;
                    return true;
                } catch (error) {
                    return false;
                }
            },
            errorMessage: "Organisations not Found"
        }
    },
    name: {
        in: ['body'],
        trim: true,
    },
}),);

export default organisationValidator;