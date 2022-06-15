export type Transaction = {
    product:              Product;
    reversal:             boolean;
    responseCode:         string;
    responseDescription:  string;
    terminalId:           string;
    merchantId:           string;
    cashback:             string;
    merchantName:         string;
    merchantCategoryCode: string;
    merchantAddress:      string;
    currencyCode:         string;
    rrn:                  string;
    MTI:                  string;
    STAN:                 string;
    PAN:                  string;
    vasData:              null;
    extraData:            string;
    processor:            Processor;
    _id:                  string;
    amount:               number;
    transactionTime:      string;
    __v:                  number;
    isCompleted:          boolean;
    cardExpiration?:      string;
    handlerResponseTime?: string;
}

export enum Processor {
    Nibss = "NIBSS",
    ISW = "ISW"
}

export enum Product {
    Cashout = "CASHOUT",
    Purchase = "purchase",
}

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}
export interface User {
    _id?: string,
    role: UserRole,
    username: string,
    email: string,
    password?: string,
    fullname: string,
    organisation_id: string,
    permissions: string[],
}