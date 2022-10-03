import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import WebhookModel from '../db/models/webhook.model';
import OrganisationModel from '../db/models/organisation.model';

const webHookValidator = createValidatedRequest(checkSchema({
    organisationId: {
        in: ['body'],
        optional: true,
        custom: {
            options: async (value: string, { req, location, path }) => {
                if (value?.length &&
                    ! await OrganisationModel.findById(value)
                ) return Promise.reject();
            },
            errorMessage: "Organisation not Found",
            bail: true,
        }
    },
    url: {
        in: ['body'],
        trim: true,
        isURL: true,
        custom: {
            options: async (value: string, { req, location, path }) => {
                if (! await WebhookModel.find({
                    url: value,
                    organisationId: req.body.organisationId?.length ? req.body.organisationId : undefined,
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

export default webHookValidator;