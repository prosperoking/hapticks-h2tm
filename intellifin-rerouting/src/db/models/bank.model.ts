import { Schema, model, SchemaTypes, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';

export interface IBankBinData {
    _id?:  string| any,
    name: string,
}
export interface IWebhook extends IBankBinData, Document{}

const bankBinSchema = new mongoose.Schema<IBankBinData>({
    name: {
        type: String,
        required: true,
        unique:  true,
        index:{
            unique: true,

        },
        set: (value)=> String(value).toUpperCase(),
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

bankBinSchema.plugin(paginate);

export default mongoose.model<IWebhook, PaginateModel<IWebhook>>('banks', bankBinSchema);