import { Schema, model, SchemaTypes, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';

export interface IBankBinData extends Document {
    name: string,
}
export interface IBankBin extends IBankBinData {}

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

export default mongoose.model<IBankBinData, PaginateModel<IBankBin>>('banks', bankBinSchema);