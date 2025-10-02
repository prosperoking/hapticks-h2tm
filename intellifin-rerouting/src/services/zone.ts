import axios, { AxiosResponse } from "axios";
import { IJournal } from "../db/models/transaction.model";
import moment from "moment"
import https from "https"
type IZoneJournal = {
    Rrn: string,
    Stan: string,
    AcquirerBank: string,
    Amount: number,
    AccountNumber: string,
    Pan: string,
    TransactionStatus: string,
    CurrencyCode: string,
    Comment: string,
    TransactionDate: string,
    TransactionTime: string,
    Error: string | "",
    TerminalId: string
}
class ZoneApi {
    static get client () {
        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
        });
        return axios.create({
            baseURL: process.env.ZONE_BASE_URL ?? "https://ofi.zonenetwork.com",
            httpsAgent
        });
    }

    async postJournal(transaction: IJournal, options: { accno: string, acqID: string,apiKey: string,}): Promise<boolean>
    {
        try{
            const paylaod = {
                Rrn: transaction.rrn,
                Stan: transaction.STAN,
                AcquirerBank: options.acqID,
                Amount: transaction.amount,
                AccountNumber: options.accno,
                Pan: transaction.PAN,
                TransactionStatus: transaction.responseCode === '00'? "APPROVED": "FAILED",
                CurrencyCode: "566",
                Comment: transaction.responseDescription,
                TerminalId: transaction.terminalId,
                Error: transaction.responseCode === '00'? "": transaction.responseDescription,
                TransactionDate: moment(new Date(transaction.createdAt)).format("DD/MM/YYYY"),
                TransactionTime: moment(new Date(transaction.createdAt)).format("hh:mm"),
             };
            const { data } = await ZoneApi.client.post<IZoneJournal, AxiosResponse<{message: string, status:boolean}>>(
                "/pushjournal/api/push-journal",paylaod,{
                    headers: {
                        "x-api-key": options.apiKey
                    }
                })

            return data.status;
        }catch (e) {
            console.log(e)
            const message = e.message
            const response: AxiosResponse | null = e.isAxiosError? e.response : null
            console.log({
                data: response?.data ?? null,
                status: response?.status?? null,
                statusText: response?.statusText ?? null,
                responseHeaders: response? JSON.parse(JSON.stringify(response?.headers)): null,
                message
            })
            return false;
        }
    }
}

export default new ZoneApi;