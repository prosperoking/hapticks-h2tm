import { Job, Worker } from "bullmq";
import Terminal from "../../db/models/terminal.model";
import { performCardSocketTranaction, TransactionTypes } from '../../helpers/cardsockethelper';
import { ITerminal, ITerminalDocument } from '../../db/models/terminal.model';
import appConfig, { AppConfig } from '../../config/config';
import { Document } from 'mongoose';
import Inteliffin from '../../services/inteliffin';

const config: AppConfig = (new appConfig()).getConfig('');

const connection = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
};

export const keyExchangeWorker = new Worker<ITerminal>('keyexchange',async (job: Job<ITerminal>) => {
    
    const terminal = await Terminal.findById(job.data._id).populate('profile');
    if(!terminal) throw Error("Terminal Not found");
    const profile = terminal.profile;

    if(profile.isInteliffin) {
        return handleIntelifinKeyExchange(terminal);
    }
    
    let result = await performCardSocketTranaction(TransactionTypes.KEY_EXCHANGE, {
        tid: terminal.terminalId,
        component: profile.componentKey1,
        ip: profile.isoHost,
        ssl: String(profile.isSSL),
        port: profile.isoPort
    });

    console.log(result);

    if (!result?.status)  throw Error(result.message);

    const { data } = result;
    terminal.encmasterkey = data.encmasterkey;
    terminal.encpinkey = data.encpinkey;
    terminal.encsesskey = data.encsesskey;
    terminal.clrmasterkey = data.clrmasterkey;
    terminal.clrsesskey = data.clrsesskey;
    terminal.clrpinkey = data.clrpinkey;
    terminal.paramdownload = data.paramdownload;
    await terminal.save();
},{
    autorun: false,
    connection,
})
type TerminalDocument = Document<unknown, any, ITerminalDocument> & ITerminalDocument & Required<{
    _id: string;
}>

async function handleIntelifinKeyExchange(terminal: TerminalDocument) {
    const { isoHost, isoPort, isSSL } = terminal.profile
    
    
    try {
        const data = await Inteliffin.getPrepInfo({
                        terminalid: terminal.terminalId,
                        serialno: terminal.serialNo,
                    });
        
        if (data.response !== '00') {
            return 
        }

        const { 
            pin_key, 
            callhome, 
            country_code, 
            currency_code,  
            datetime,
            merchant_address,
            merchant_category_code,
            merchantid,
            timeout,
        } = data;
        const padLeadingZeros = (num:number)=> num.toString().padStart(2, '0');
        terminal.encmasterkey = pin_key;
        terminal.encpinkey = data.pin_key;
        terminal.encsesskey = data.pin_key;
        terminal.clrmasterkey = data.pin_key;
        terminal.clrsesskey = data.pin_key;
        terminal.clrpinkey = data.pin_key;
        console.log([
            ["020",padLeadingZeros(datetime.length),datetime],
            ["030",padLeadingZeros(merchantid.length), merchantid],
            ["040",padLeadingZeros(timeout.length), timeout],
            ["050",padLeadingZeros( currency_code.length), currency_code,],
            ["060",padLeadingZeros( country_code.length), country_code],
            ["070",padLeadingZeros(callhome.length),callhome],
            ["080",padLeadingZeros(merchant_category_code.length), merchant_category_code],
            ["520",padLeadingZeros(merchant_address.length), merchant_address],
        ])
        terminal.paramdownload = [
            ["020",padLeadingZeros(datetime.length),datetime],
            ["030",padLeadingZeros(merchantid.length), merchantid],
            ["040",padLeadingZeros(timeout.length), timeout],
            ["050",padLeadingZeros( currency_code.length), currency_code,],
            ["060",padLeadingZeros( country_code.length), country_code],
            ["070",padLeadingZeros(callhome.length),callhome],
            ["080",padLeadingZeros(merchant_category_code.length), merchant_category_code],
            ["520",padLeadingZeros(merchant_address.length), merchant_address],
        ].map(a=>a.join('')).join('');
        
        await terminal.save();
       

    } catch (error) {
        throw error;
    }
}

export default keyExchangeWorker;