import crypto from 'crypto';
export {}

export interface ISOPayload {
    field18: string;
    ssl: boolean;
    tid: string;
    field22: string;
    field23: string;
    field26: string;
    field25: string;
    host: string;
    field11: string;
    field55: string;
    field12: string;
    port: string;
    field13: string;
    field14: string;
    field52: string;
    field42: string;
    field43: string;
    field49: string;
    sn: string;
    field40: string;
    field41: string;
    amount: string;
    field128: string;
    field123: string;
    field28: string;
    field0: string;
    field32: string;
    field37: string;
    field35: string;
    clrsesskey: string;
    field7: string;
    field3: string;
    field2: string;
    transaction: string;
    field4: string;
}

export interface KIMONOPayload {
    transaction: string;
    tid: string;
    mid: string;
    sn: string;
    account: string;
    clrpin: string;
    pinblock: string;
    panseqno: string;
    amount: string;
    aip: string;
    atc: string;
    cryptogram: string;
    cip: string;
    cvm: string;
    iad: string;
    tvr: string;
    capabilities: string;
    unpredictable: string;
    filename: string;
    pan: string;
    expirydate: string;
    track: string;
    stan: string;
    rrn: string;
    totalamount: string;
    field4: string;
    field43: string;
    mcc: string;
    merchantLocation?: string;
}

export enum Processor {
    NIBSS = "NIBSS",
    KIMONO = "KIMONO",
    THREELINE = "3LINE",
    ISW = "ISW",
    HYDROGEN = "HYDROGEN",
    HABARI = "HABARI"
}


export interface PurchasePayload {
    tid:           string;
    mid:           string;
    sn:            string;
    account:       string;
    clrpin:        string;
    pinblock:      string;
    panseqno:      string;
    amount:        string;
    aip:           string;
    atc:           string;
    cryptogram:    string;
    cip:           string;
    cvm:           string;
    iad:           string;
    tvr:           string;
    capabilities:  string;
    unpredictable: string;
    filename:      string;
    pan:           string;
    expirydate:    string;
    track:         string;
    stan:          string;
    rrn:           string;
    totalamount:   string;
    field18:       string;
    ssl?:           boolean;
    field4:        string;
    field22:       string;
    field23:       string;
    field26:       string;
    field25:       string;
    host?:          string;
    field11:       string;
    field55:       string;
    field12:       string;
    field13:       string;
    field14:       string;
    field52:       string;
    field42:       string;
    field43:       string;
    field49:       string;
    field40:       string;
    field41:       string;
    field128:      string;
    field123:      string;
    field28:       string;
    field0:        string;
    field32:       string;
    field37:       string;
    field35:       string;
    field7:        string;
    field3:        string;
    field2:        string;
    processor?:    string;
}

export type SlimPurchasePayload = {
    track2: string;
    iccData: string;
    pinBlock?: string;
    rrn?: string;
    stan: string;
    accountType: '00' | '10' | '20' | '30';
    transDateTime: string;
    tid: string,
    mid: string,
    entryMode?: string,
    processor?: string,
}

export type ParsedTLv = {
    cryptogram: string;
    cryptogramInfoData: string;
    issuerApplicationData: string;
    unpredictableNumber: string;
    atc: string;
    terminalVerificationResult: string;
    transactionDate: string;
    transactionType: string;
    amountOther: string;
    amount: string;
    terminalCapabilities: string;
    aid: string;
    dedicatedFileName?: string;
    transSeqCounter?: string;
    panSeqNum: string;
    terminalCurrency: string;
    aip: string;
    transType: string;
    cvm: string;
}


export interface IntellifinPurchasePayload {
    terminalid:             string;
    merchantid:             string;
    amount:                 string;
    cashback:               string;
    transtype:              string;
    merchant_category_code: string;
    iccdata:                string;
    panseqno:               string;
    track2:                 string;
    merchant_address:       string;
    currency_code:          string;
    pinblock:               string;
    rrn:                    string;
    stan:                   string;
}

export interface IntellifinPurchaseResponse {
    response:     string;
    stan:         string;
    rrn:          string;
    authid:       string;
    iccresponse:  string;
    description:  string;
    responsecode: string;
}