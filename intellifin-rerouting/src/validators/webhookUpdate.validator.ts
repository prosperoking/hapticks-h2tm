import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import WebhookModel from '../db/models/webhook.model';

const webHookUpdateValidator = createValidatedRequest(checkSchema({
    urls: {
        in: ['body'],
        isArray: true,
        custom: {
            options: async (value: string, { req, location, path }) => {
                if (! await WebhookModel.find({
                    urls: value,
                    organisationId: req.body.organisationId?.length ? req.body.organisationId : undefined,
                    _id: { $ne: req.params.id },
                })) return Promise.reject();
            },
            errorMessage: "Webhook Already Registered for Organisation",
            bail: true,
        }
    },
    "urls.*": {
        // in: ['body'],
        trim: true,
        isURL: {
            errorMessage: "Invalid Url",
        },
    },
    name: {
        in: ['body'],
        toUpperCase: true,
        trim: true,
    },
}),);

export default webHookUpdateValidator;