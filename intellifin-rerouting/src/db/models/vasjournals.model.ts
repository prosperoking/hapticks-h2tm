import mongoose from 'mongoose';
import { Processor } from '../../@types/types';

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
    processor?: Processor
}

let JournalsSchema = new mongoose.Schema({

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
    extraData: { type: String, default: "" },
    processor: { type: String, default: "NIBSS" }

});

export default mongoose.model('journal', JournalsSchema);
