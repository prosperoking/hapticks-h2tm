import { Schema, model, SchemaTypes, Document, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';
import { Webhook, Organisation } from '../../../../ui/src/@types/types';

export interface IWebhookRequestData extends Document {
    webhookId: string | any,
    payload: object,
    terminalId: string,
    organisationId?: string | any,
    responseBody: string,
    responseType: string,
    responseCode: number,
    isRetry: boolean,
    verifyString: string,
    verifySignature: string,
    status: string,
    journalId: string | any,
    webhook?: Webhook,
    organisation?: Organisation
    url?: string,
}

export interface IWebhookRequest extends Document, IWebhookRequestData{}

const webhookRequestSchema = new mongoose.Schema<IWebhookRequestData>({
    webhookId: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    terminalId: {
        type: String,
        required: true,
    },

    payload: {
        type: Object,
        required: true
    },
    responseBody: {
        type: String,
        default: null,
    },
    responseType: {
        type: String,
        default: null,
    },
    responseCode: {
        type: Number,
        default: null,
    },
    isRetry: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        required: true,
    },
    journalId: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    organisationId: {
        type: SchemaTypes.ObjectId,
        default: null,
        index: true,
    },
    verifyString: {
        type: String,
        default: null,
    },
    verifySignature: {
        type: String,
        default: null,
    },

    url: {
        type: String,
        default: null,
    }
},{
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

webhookRequestSchema.virtual('transaction',{
    ref: 'journal',
    localField: '_id',
    foreignField: 'journalId',
})

webhookRequestSchema.virtual('webhook',{
    ref: 'webhook',
    localField: '_id',
    foreignField: 'webhookId',
})


webhookRequestSchema.virtual('organisation',{
    ref: 'organisationProfile',
    localField: '_id',
    foreignField: 'organisationId',
})


webhookRequestSchema.plugin(paginate)

export default mongoose.model<IWebhookRequest, PaginateModel<IWebhookRequest>>('webhookRequest', webhookRequestSchema)