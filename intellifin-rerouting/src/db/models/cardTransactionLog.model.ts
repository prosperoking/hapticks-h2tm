import { Schema, model, Document, PaginateModel } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';

export interface CardTransactionLogData {
    maskedPan: string,
    rrn: string,
    tid: string,
    stan: string,
    amount: number,
    journalId: Schema.Types.ObjectId | string | null,
}

export interface CardTransactionLogProfile extends Document, CardTransactionLogData { }

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


const CardLogModel = mongoose.model<CardTransactionLogProfile, PaginateModel<CardTransactionLogProfile>>("cardLogs", cardLogSchema);
export default CardLogModel