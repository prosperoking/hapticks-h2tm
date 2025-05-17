import axios, { AxiosResponse } from "axios";
import { IJournal } from "../db/models/transaction.model";
import moment from "moment"

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
        return axios.create({
            baseURL: process.env.ZONE_BASE_URL ?? "https://zone.cluster.africa",
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
                TransactionTime: moment(new Date(transaction.createdAt)).format("hh:mm")
             };
            const { data } = await ZoneApi.client.post<IZoneJournal, AxiosResponse<{message: string, status:boolean}>>(
                "/pushjournal/api/push-journal",paylaod,{
                    headers: {
                        "x-api-key": options.apiKey
                    }
                })

            return data.status;
        }catch (e) {
            e.isAxiosError ?console.log(e.response.data):console.log(e.message);
            return false;
        }
    }
}

export default new ZoneApi;