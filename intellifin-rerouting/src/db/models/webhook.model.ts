import { Schema, model, SchemaTypes } from 'mongoose';
import { encrypt, decrypt } from '../../helpers/crypt';
import * as paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';

export interface IWebhook extends Document {
    _id?:  string| any,
    organisation_id?: string | any,
    name: string,
    url: string,
    headers: string,
}

const webhookSchema = new mongoose.Schema<IWebhook>({
    organisation_id:{
        type: SchemaTypes.ObjectId,
        default: null,
    },
    name: {
        type: String,
        required: true,
        set: value=> String(value).toUpperCase(),
    },
    url: {
        type: String,
        required: true,
    },
    headers: {
        type: String,
        set: value=> value?.length? encrypt(JSON.stringify(value)): null,
        get: value=> value?.length? JSON.stringify(decrypt(value)): null,
        default: null,
    }
},{
    timestamps: {
        createdAt: true,
        updatedAt: true,
    }
})

// @ts-ignore
webhookSchema.plugin(paginate);

export default mongoose.model<IWebhook>('webhook', webhookSchema);