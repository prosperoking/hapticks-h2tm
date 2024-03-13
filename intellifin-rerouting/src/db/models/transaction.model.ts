import { Document, PaginateModel, SchemaTypes } from 'mongoose';
import { Processor } from '../../@types/types';
import csv from 'mongoose-csv-export';
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
    meta?: object,
    webhookData?: object,
    reversalData?: object,
    totalTransTime?: number | null,
    createdAt?: Date | string,
    updatedAt?: Date | string,
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
    terminalId: { type: String, default: "", index: true },
    merchantId: { type: String, default: "" },
    cashback: { type: String, default: "" },
    merchantName: { type: String, default: "" },
    merchantCategoryCode: { type: String, default: "" },
    merchantAddress: { type: String, default: "" },
    currencyCode: { type: String, default: "" },
    rrn: { type: String, default: "", index: true },
    MTI: { type: String, default: "0200" },
    STAN: { type: String, default: "" },
    PAN: { type: String, default: "", index: true },
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
    processor: { type: String, default: "NIBSS" },
    meta: {
        type: Object,
    },
    webhookData: {
        type: Object,
        default: null,
    },
    reversalData: {
        type: Object,
        default: null,
    },
    totalTransTime: {
        type: Number,
        default: null,
    }

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

JournalsSchema.plugin(paginate)

JournalsSchema.plugin(csv, {
    headers: [ "MTI",'TerminalId', "STAN", "RRN", "RESPONSE CODE", "RESPONSE MEANING", "MASKED PAN", "AUTH CODE", "AMOUNT", "CASHBACK", "TRANSACTION TIME", "PROCESSOR", "MERCHANT NAME", "MERCHANT ID", "MERCHANT ADDRESS", "MERCHANT CATEGORY CODE", "CURRENCY CODE", ],
    alias: {
        "MTI": "MTI",
        "TerminalId": "terminalId",
        "STAN": "STAN",
        "RRN": "rrn",
        "RESPONSE CODE": "responseCode",
        "RESPONSE MEANING": "responseDescription",
        "MASKED PAN": "PAN",
        "AUTH CODE": "authCode",
        "AMOUNT": "amount",
        "CASHBACK": "cashback",
        "TRANSACTION TIME": "transactionTime",
        "PROCESSOR": "processor",
        "ORGANISATION": "organisationId",
        "MERCHANT NAME": "merchantName",
        "MERCHANT ID": "merchantId",
        "MERCHANT ADDRESS": "merchantAddress",
        "MERCHANT CATEGORY CODE": "merchantCategoryCode",
        "CURRENCY CODE": "currencyCode",
    },
    delimiter: ",",
})

export default mongoose.model<IJournalDocument, PaginateModel<IJournalDocument>>('journal', JournalsSchema);
