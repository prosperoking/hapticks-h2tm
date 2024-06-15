import { Schema, model, SchemaTypes, PaginateModel } from 'mongoose';
import { encrypt, decrypt } from '../../helpers/crypt';
import paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';

export interface ISetting {
    _id?:  string| any,
    key?: string | any,
    value: object,
}
export interface IWebhook extends ISetting, Document{}

const settingSchema = new mongoose.Schema<ISetting>({
    key: {
        type: String,
        required: true,
        unique: true,
        set: value=> String(value).toUpperCase(),
    },
    value: {
        type: Object,
        required: true,
    },
},{
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
    toJSON:{
        getters: true
    }
},);

settingSchema.plugin(paginate);

export default mongoose.model<IWebhook, PaginateModel<IWebhook>>('settings', settingSchema);