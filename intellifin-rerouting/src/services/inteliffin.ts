import Axios, { AxiosInstance } from "axios";

export const InteliffinTransTypes = Object.freeze({
  PURCHASE: "1",
  CASH_ADVANCE: "45",
  REFUND: "5",
  REVERSAL: "4",
  BALANCE: "7",
  PREAUTH: "33",
  SALES_COMPLETION: "34",
});

export type IntellifinOptions = {
  ip: string;
  port: string;
};

export type GetTerminalInfoOptions = {
  terminalid: string;
  serialno: string;
};

export type PerformTransactionOptions = {
  terminalid: string;
  merchantid: string;
  amount: string;
  cashback?: string;
  transtype: string;
  merchant_category_code: string;
  iccdata: string;
  panseqno: string;
  track2: string;
  merchant_address: string;
  currecy_code: string;
  pinblock?: string;
  rrn?: string;
  stan?: string;
};

export type IntellifinPrepResponse = {
  response: string;
  merchantid: string;
  terminalid: string;
  country_code: string;
  currency_code: string;
  merchant_category_code: string;
  merchant_address: string;
  datetime: string;
  pin_key: string;
  callhome: string;
  timeout: string;
  description: string;
};

export type IntellifinPerformTransactionResponse = {
  response: string;
  stan?: string;
  rrn?: string;
  authid?: string;
  iccresponse?: string;
  balance?: string;
  description: string,
};

export default class Inteliffin {
  static create(): Inteliffin {
    return new Inteliffin();
  }

  static get client(): AxiosInstance {
    const axios = Axios.create({
      // baseURL: `http://${this.ip}:${this.port}/nibbs`,
      baseURL: `http://nibssepms.intellifin.com.ng/nibss`,
      timeout: 62000,
    });

    if (process.env.DEBUG_AXIOS) {
      axios.interceptors.request.use((request) => {
        console.log("Request: ", {
            method: request.method,
            url: `${request.baseURL}${request.url}`,
            headers: request.headers,
            data: request.data,
        });
        return request;
      });

      axios.interceptors.response.use((response) => {
        console.log("Response:", {
            status: response.status,
            headers: response.headers,
            data: response.data,
            statusText: response.statusText,
        });
        return response;
      });
    }

    return axios;
  }

  static async getPrepInfo(
    options: GetTerminalInfoOptions
  ): Promise<IntellifinPrepResponse> {
    const result = await Inteliffin.client.post<IntellifinPrepResponse>(
      "/api/prep_posvas",
      options
    );
    return result.data;
  }

  static async performTranaction(
    payload: PerformTransactionOptions
  ): Promise<IntellifinPerformTransactionResponse> {
    const result =
      await Inteliffin.client.post<IntellifinPerformTransactionResponse>(
        "/api/transaction_posvas",
        payload
      );
    return result.data;
  }
}
