import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import WebhookModel from '../db/models/webhook.model';

const webHookUpdateValidator = createValidatedRequest(checkSchema({
    url: {
       in: ['body'],
       trim: true,
       isURL: true,
       custom: {
        options: async (value: string, {req, location, path}) =>{
            if(! await WebhookModel.find({
                url: value,
                organisationId: req.body.organisationId,
            })) return Promise.reject();
        },
        errorMessage: "Webhook Already Registered for Organisation",
        bail: true,
    }
    },
    name: {
        in: ['body'],
        toUpperCase: true,
        trim: true,
    },
}),);

export default webHookUpdateValidator;