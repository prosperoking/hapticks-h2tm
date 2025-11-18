import { Schema, model, Document, PaginateModel, Model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';

export interface CardTransactionLogData extends Document{
    maskedPan: string,
    rrn: string,
    tid: string,
    stan: string,
    amount: number,
    journalId: Schema.Types.ObjectId | string | null,
}

export interface CardTransactionLogProfile extends Model<CardTransactionLogData>, PaginateModel<CardTransactionLogData> { }

const cardLogSchema = new mongoose.Schema<CardTransactionLogData>({
    maskedPan: {
        type: String,
    },
    rrn: {
        type: String,
    },
    tid: {
        type: String,
    },
    stan: {
        type: String,
    },
    amount:{
        type: Number,
    },
    journalId: {
        type: Schema.Types.ObjectId,
        ref: 'journal',
        default: null,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
})




cardLogSchema.plugin(paginate);
cardLogSchema.plugin(uniqueValidator);


const CardLogModel = mongoose.model<CardTransactionLogData, CardTransactionLogProfile>("cardLogs", cardLogSchema);
export default CardLogModel