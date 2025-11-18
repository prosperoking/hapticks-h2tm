import { Schema, model, SchemaTypes, PaginateModel } from 'mongoose';
import { encrypt, decrypt } from '../../helpers/crypt';
import paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';
import PTSPProfileModel from './ptspProfile.model';

export interface IBankBinData extends Document {
    _id?:  string| any,
    bin: string ,
    bankId: mongoose.ObjectId,
}
export interface IBankBin extends IBankBinData{}

const bankBinSchema = new mongoose.Schema<IBankBinData>({
    bin: {
        type: String,
        required: true,
        unique: true,
        set: value=> String(value).toUpperCase(),
    },
    bankId: {
        type: SchemaTypes.ObjectId,
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

bankBinSchema.virtual("bank", {
    ref: "banks",
    localField: "bankId",
    foreignField: "_id",
    justOne: true,
});

bankBinSchema.plugin(paginate);

export default mongoose.model<IBankBinData, PaginateModel<IBankBin>>('bankBin', bankBinSchema);