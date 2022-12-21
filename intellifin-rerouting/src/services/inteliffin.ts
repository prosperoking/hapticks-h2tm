import Axios, {AxiosInstance} from 'axios';


export const InteliffinTransTypes = Object.freeze({
    PURCHASE: '1',
    CASH_ADVANCE: '45',
    REFUND: '5',
    REVERSAL: '4',
    BALANCE: '7',
    PREAUTH: '33',
    SALES_COMPLETION: '34',
});

export type IntellifinOptions = {
    ip: string;
    port: string;
}

export type GetTerminalInfoOptions = {
    terminalid: string;
    serialno: string;
}

export type PerformTransactionOptions = {
    terminalid: string,
    merchantid: string,
    amount: string,
    cashback: number,
    transtype:   typeof InteliffinTransTypes,
    merchant_category_code: string,
    iccdata: string,
    panseqno: string,
    track2: string,
    merchant_address: string,
    currecy_code: string,
    pinblock?: string,
    rrn?: string,
}



export type IntellifinPrepResponse = {
    response: string,
    merchantid: string,
    terminalid: string,
    country_code: string,
    currency_code: string,
    merchant_category_code: string,
    merchant_address: string,
    datetime: string,
    pin_key: string,
    callhome: string,
    timeout: string,
    description: string,
};


export type IntellifinPerformTransactionResponse = {
    response: string,
    stan: string,
    rrn: string,
    authid: string,
    iccresponse: string,
}

export default class Inteliffin {
    ip: string;
    port: string;

    constructor(options: IntellifinOptions) {
        this.ip = options.ip;
        this.port = options.port;
    }

    static create(options: IntellifinOptions): Inteliffin {
        return new Inteliffin(options);
    }

    get client(): AxiosInstance {
        return Axios.create({
            baseURL: `http://${this.ip}:${this.port}/nibbs`,
            timeout: 10000,
        });
    }

    async getPrepInfo(options: GetTerminalInfoOptions): Promise<IntellifinPrepResponse> {
        const result = await this.client.post<IntellifinPrepResponse>('/api/prep_live', options);
        return result.data;
    }

    async performTranaction(payload: PerformTransactionOptions): Promise<IntellifinPerformTransactionResponse> {
        const result = await this.client.post<IntellifinPerformTransactionResponse>('/api/transaction_live', payload);
        return result.data;
    }
}