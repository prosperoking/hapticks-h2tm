import { Document, PaginateModel, SchemaTypes } from 'mongoose';
import { Processor } from '../../@types/types';
import paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';

export interface IJournal {
    amount: number,
    authCode: string,
    product: string,
    transactionTime: string,
    reversal?: boolean,
    handlerResponseTime?: string,
    extraFields?: object,
    responseCode: string,
    responseDescription: string,
    isCompleted?: boolean,
    terminalId: string,
    merchantId: string,
    cashback?: string,
    merchantName: string,
    merchantCategoryCode?: string,
    merchantAddress?: string,
    currencyCode?: string,
    rrn: string,
    MTI?: string,
    STAN: string,
    PAN: string,
    cardExpiration?: string,
    vasData?: object,
    extraData?: string,
    processor?: Processor | any,
    organisationId?: string | any,
}

export interface IJournalDocument extends Document, IJournal {}

let JournalsSchema = new mongoose.Schema<IJournalDocument>({

    amount: Number,
    authCode: { type: String, default: '' },
    product: { type: String, default: "" },
    transactionTime: Date,
    reversal: { type: Boolean, default: false },
    handlerResponseTime: Date,
    extraFields: JSON,
    responseCode: { type: String, default: "" },
    responseDescription: { type: String, default: "" },
    isCompleted: Boolean,
    terminalId: { type: String, default: "" },
    merchantId: { type: String, default: "" },
    cashback: { type: String, default: "" },
    merchantName: { type: String, default: "" },
    merchantCategoryCode: { type: String, default: "" },
    merchantAddress: { type: String, default: "" },
    currencyCode: { type: String, default: "" },
    rrn: { type: String, default: "" },
    MTI: { type: String, default: "0200" },
    STAN: { type: String, default: "" },
    PAN: { type: String, default: "" },
    cardExpiration: {type: String, defualt: ""},
    vasData: {
        type: Object,
        default: null,
    },
    organisationId: {
        type: SchemaTypes.ObjectId,
        default: null,
    },
    extraData: { type: String, default: "" },
    processor: { type: String, default: "NIBSS" }

},{
    timestamps: true,
    toJSON:{
        virtuals: ['terminal','organisation']
    }
});

JournalsSchema.virtual('terminal', {
    ref: 'terminal',
    localField: 'terminalId',
    foreignField: 'terminalId',
})

JournalsSchema.virtual('organisation', {
    ref: 'organisationProfile',
    localField: 'organisationId',
    foreignField: '_id',
})
// @ts-ignore
JournalsSchema.plugin(paginate)

export default mongoose.model<IJournalDocument, PaginateModel<IJournalDocument>>('journal', JournalsSchema);
