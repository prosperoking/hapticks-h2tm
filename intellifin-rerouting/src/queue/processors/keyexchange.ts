import { Job, Worker } from "bullmq";
import Terminal from "../../db/models/terminal.model";
import { performCardSocketTranaction, TransactionTypes } from '../../helpers/cardsockethelper';
import { ITerminal } from '../../db/models/terminal.model';
import appConfig, { AppConfig } from '../../config/config';

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

export default keyExchangeWorker;