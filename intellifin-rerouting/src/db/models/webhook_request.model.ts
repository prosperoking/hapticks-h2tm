import { Schema, model, SchemaTypes, Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';

export interface IWebhookRequest extends Document {
    webhookId: string | any,
    payload: object,
    terminalId: string,
    organisationId?: string | any,
    responseBody: string,
    responseType: string,
    responseCode: number,
    isRetry: boolean,
    status: string,
    journalId: string | any,

}

const webhookRequestSchema = new mongoose.Schema<IWebhookRequest>({
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
    ref: 'organisation',
    localField: '_id',
    foreignField: 'organisationId',
})

// @ts-ignore
webhookRequestSchema.plugin(paginate)

export default mongoose.model<IWebhookRequest>('webhookRequest', webhookRequestSchema)