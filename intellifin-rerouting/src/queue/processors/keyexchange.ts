import { Job, Worker } from "bullmq";
import Terminal from "../../db/models/terminal.model";
import { sendSocketMessage, TransactionTypes } from '../../helpers/cardsockethelper';
import { ITerminal, ITerminalDocument } from '../../db/models/terminal.model';
import appConfig, { AppConfig } from '../../config/config';
import { Document } from 'mongoose';
import Inteliffin from '../../services/inteliffin';
import groupTidModel from "../../db/models/groupTid.model";
import PTSPProfileModel, { IPTSPProfile, } from "../../db/models/ptspProfile.model";

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
    if(terminal.profile.hasthreelineSupport && terminal.threeLineTid?.length) {
        const threeResult = await sendSocketMessage(
          TransactionTypes.THREELINE_KEY_EXCHANGE,
          {
            tid: terminal.threeLineTid,
            component: terminal.profile.threeLineKey,
            ip: terminal.profile.threeLineHost,
            ssl: String(terminal.profile.threeLineHostSSL),
            port: terminal.profile.threeLinePort,
          }
        )

        if(threeResult.status) {
          terminal.threeLineParams = threeResult.data
          if(terminal.threeLineTid == terminal.terminalId && terminal.profile.type == "3line") {
            const data = threeResult.data;
            terminal.encmasterkey = data.encmasterkey;
            terminal.encpinkey = data.encpinkey;
            terminal.encsesskey = data.encsesskey;
            terminal.clrmasterkey = data.clrmasterkey;
            terminal.clrsesskey = data.clrsesskey;
            terminal.clrpinkey = data.clrpinkey;
            terminal.paramdownload = data.paramdownload;
            await terminal.save();
            return;
          }
        }
      }

    if(profile.isInteliffin) {
        return handleIntelifinKeyExchange(terminal);
    }

    let result = await sendSocketMessage(TransactionTypes.KEY_EXCHANGE, {
        tid: terminal.terminalId,
        component: profile.componentKey1,
        ip: profile.isoHost,
        ssl: String(profile.isSSL),
        port: profile.isoPort
    });

    console.log(result);

    if (!result?.status)  throw Error(result.message);

    const { data } = result;
    terminal.nibssParams = {
        encmasterkey: data.encmasterkey,
        encPinKey: data.encpinkey,
        encSessionKey: data.encsesskey,
        clrMasterKey: data.clrmasterkey,
        clrSessionKey: data.clrsesskey,
        clrpinkey: data.clrpinkey,
        paramdownload:data.paramdownload,
    }
    terminal.paramdownload =  data.paramdownload;
    await terminal.save();
},{
    autorun: false,
    connection,
})

export const GroupKeyExchangeWorker = new Worker<ITerminal>('groupkeyexchange',async (job: Job<ITerminal>) => {

    const groupTid = await groupTidModel.findById(job.data._id).populate('profile');
    console.log(groupTid)
    if(!groupTid) throw Error("Group Tid Not found");
    const profile = groupTid.profile;
    // if(groupTid.profile.hasthreelineSupport && groupTid.threeLineTid?.length) {
    //     const threeResult = await sendSocketMessage(
    //       TransactionTypes.THREELINE_KEY_EXCHANGE,
    //       {
    //         tid: groupTid.threeLineTid,
    //         component: groupTid.profile.threeLineKey,
    //         ip: groupTid.profile.threeLineHost,
    //         ssl: String(groupTid.profile.threeLineHostSSL),
    //         port: groupTid.profile.threeLinePort,
    //       }
    //     )

    //     if(threeResult.status) {
    //       groupTid.threeLineParams = threeResult.data
    //     }
    //   }

    if(profile.isInteliffin) {
        //@ts-ignore
        return handleIntelifinKeyExchange(groupTid);
    }

    let result = await sendSocketMessage(TransactionTypes.KEY_EXCHANGE, {
        tid: groupTid.terminalId,
        component: profile.componentKey1,
        ip: profile.isoHost,
        ssl: String(profile.isSSL),
        port: profile.isoPort
    });

    console.log("", result);

    if (!result?.status)  throw Error(result.message);

    const { data } = result;
    groupTid.encmasterkey = data.encmasterkey;
    groupTid.encpinkey = data.encpinkey;
    groupTid.encsesskey = data.encsesskey;
    groupTid.clrmasterkey = data.clrmasterkey;
    groupTid.clrsesskey = data.clrsesskey;
    groupTid.clrpinkey = data.clrpinkey;
    groupTid.paramdownload = data.paramdownload;
    await groupTid.save();
},{
    autorun: false,
    connection,
})


export const RotateKeysWorker = new Worker<IPTSPProfile>('rotateKeys',async (job: Job<IPTSPProfile>) => {

    const profile = await PTSPProfileModel.findById(job.data.id);
    if(!profile) return
    if(profile.linkedProfileId !== null) return
            const type = job.data.type;

            const details:[TransactionTypes, object] = {
                isw: [TransactionTypes.ISW_KEY_EXCHANGE, {
                    host: profile.iswISOConfig.host,
                    port: profile.iswISOConfig.port,
                    ssl: profile.iswISOConfig.ssl,
                    zmk: profile.iswISOConfig.zmk
                }],
                hydrogen: [TransactionTypes.HYDROGEN_KEY_EXCHANGE ,{
                    host: profile.hydrogenConfig.host,
                    port: profile.hydrogenConfig.port,
                    ssl: profile.hydrogenConfig.ssl,
                    zmk: profile.hydrogenConfig.zmk
                },],
                habari: [TransactionTypes.HABARI_KEY_EXCHANGE ,{
                    host: profile.habariConfig.host,
                    port: profile.habariConfig.port,
                    ssl: profile.habariConfig.ssl,
                    zmk: profile.habariConfig.zmk
                },],
            }[type]
            const getConfigKey = (type): string | undefined=>({
                isw: "iswISOConfig",
                hydrogen: "hydrogenConfig",
                habari: "habariConfig",
            })[type]
            const configKey = getConfigKey(type)
            if(!configKey?.length) {
                return
            }

            const result = await sendSocketMessage(...details)

            if(!result.status){
                return
            }


            profile[configKey].zpk = result.data.clearZPK
            profile[configKey].lastRotate = new Date()
            profile[configKey].kcv = result.data.kcv
            await profile.save()
            let oProfile = profile.toJSON()
            await PTSPProfileModel.updateMany({linkedProfileId: profile._id},{$set:{
                [configKey]: oProfile[configKey],
            }});

},{
    autorun: false,
    connection,
})
type TerminalDocument = Document<unknown, any, ITerminalDocument> & ITerminalDocument & Required<{
    _id: string;
}>

async function handleIntelifinKeyExchange(terminal: TerminalDocument ) {
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
        // terminal.encmasterkey = pin_key;
        // terminal.encpinkey = data.pin_key;
        // terminal.encsesskey = data.pin_key;
        // terminal.clrmasterkey = data.pin_key;
        // terminal.clrsesskey = data.pin_key;
        // terminal.clrpinkey = data.pin_key;
        // terminal.paramdownload = [
        //     ["020",padLeadingZeros(datetime.length),datetime],
        //     ["030",padLeadingZeros(merchantid.length), merchantid],
        //     ["040",padLeadingZeros(timeout.length), timeout],
        //     ["050",padLeadingZeros( currency_code.length), currency_code,],
        //     ["060",padLeadingZeros( country_code.length), country_code],
        //     ["070",padLeadingZeros(callhome.length),callhome],
        //     ["080",padLeadingZeros(merchant_category_code.length), merchant_category_code],
        //     ["520",padLeadingZeros(merchant_address.length), merchant_address],
        // ].map(a=>a.join('')).join('');
        terminal.nibssParams = {
            encmasterkey: pin_key,
            encPinKey: data.pin_key,
            encSessionKey: data.pin_key,
            clrMasterKey: data.pin_key,
            clrSessionKey: data.pin_key,
            clrpinkey: data.pin_key,
            paramdownload: [
              ["020", padLeadingZeros(datetime.length), datetime],
              ["030", padLeadingZeros(merchantid.length), merchantid],
              ["040", padLeadingZeros(timeout.length), timeout],
              ["050", padLeadingZeros(currency_code.length), currency_code],
              ["060", padLeadingZeros(country_code.length), country_code],
              ["070", padLeadingZeros(callhome.length), callhome],
              [
                "080",
                padLeadingZeros(merchant_category_code.length),
                merchant_category_code,
              ],
              ["520", padLeadingZeros(merchant_address.length), merchant_address],
            ]
              .map((a) => a.join(""))
              .join(""),
        }
        terminal.paramdownload =  terminal.nibssParams.paramdownload;
        await terminal.save();


    } catch (error) {
        throw error;
    }
}

export default {keyExchangeWorker, GroupKeyExchangeWorker};