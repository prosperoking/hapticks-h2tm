import { Request, Response } from 'express';
import Terminal from '../db/models/terminal.model';
import logger from '../helpers/logger';
import { performCardSocketTranaction, TransactionTypes } from '../helpers/cardsockethelper';
import { ISOPayload, KIMONOPayload, Processor } from '../@types/types';
import vasjournalsModel, { IJournal } from '../db/models/vasjournals.model';
import Utils from '../helpers/utils';
import { ITerminal } from '../db/models/terminal.model';
import { IPTSPProfile } from '../db/models/ptspProfile.model';

export interface CardPurchaseResponse {
    resp: string,
    auth: string,
    icc: string,
    meaning: string,
}


class IsoCardContoller {

    public async performKeyExchange(request: Request, response: Response) {
        try {
            const terminal = await Terminal.findOne({
                serialNo: request.header('x-serial-no'),
            }).populate({
                path: "profile"
            });

            if (!terminal) {
                return response.status(400).json({
                    status: false,
                    message: "Unknown terminal"
                })
            }

            const { componentKey1, isoHost, isoPort, isSSL } = terminal.profile

            const result = await performCardSocketTranaction(TransactionTypes.KEY_EXCHANGE, {
                tid: terminal.terminalId,
                component: componentKey1,
                ip: isoHost,
                ssl: String(isSSL),
                port: isoPort
            });

            console.log("result: ", result)
            if (!result.status) {
                return response.status(400).json(result)
            }
            const { data } = result;
            terminal.encmasterkey = data.encmasterkey;
            terminal.encpinkey = data.encpinkey;
            terminal.encsesskey = data.encsesskey;
            terminal.clrmasterkey = data.clrmasterkey;
            terminal.clrsesskey = data.clrmasterkey;
            terminal.clrpinkey = data.clrpinkey;
            terminal.paramdownload = data.paramdownload;

            await terminal.save();
            return response.json(data);
        } catch (error) {
            console.log(error);
            return response.status(400).json({
                status: false,
                message: "An error occurred"
            })
        }
    }

    public async getTerminalInfo(request: Request, response: Response) {
        try {

            const serial = request.header('x-serial-no');
            const brand = request.header('x-brand') || null;
            const deviceModel = request.header('x-device-model') || null;
            const appVersion = request.header('x-app-version') || null;

            const terminal = await Terminal.findOne({ serialNo: serial }).populate({path: 'profile', select: "title isoHost isoPort isSSL"});

            if (!terminal) return response.status(404).json({ message: "Terminal not found" })
            terminal.brand = brand;
            terminal.appVersion = appVersion;
            terminal.deviceModel = deviceModel;
            terminal.save();
            return response.json(terminal);

        } catch (error) {
            console.log("Error: %s", error.message)
            return response.status(400).json({message: "An error Occured"})
        }
    }


    public async processCard(request: Request, response: Response) {
        try {
            const serial = request.header('x-serial-no');
            const brand = request.header('x-brand');
            const appVersion = request.header('x-app-version');

            const terminal = await Terminal.findOne({ serialNo: serial })
                                            .populate({path: 'profile',});

            const { body } = request

            if (!terminal || terminal.terminalId !== body.tid) return response.status(404).json({ message: "Terminal not found/ Provisioned" });
            
            const messageType = IsoCardContoller.getMessageType(terminal, Number(body.field4))
            const patchedPayload = messageType === TransactionTypes.ISW_KIMONO ? IsoCardContoller.patchISWPayload(body, terminal.profile, terminal): body;
            const socketResponse = await performCardSocketTranaction(messageType, patchedPayload);
            console.log("result: ", socketResponse)
            const { data } = socketResponse
            console.log(data);
            const responseData = data.data || data;
            const journalPayload = messageType === TransactionTypes.ISO_TRANSACTION ? IsoCardContoller.createNIBBSJournal(responseData, body) : IsoCardContoller.createISWJournal(responseData, body, terminal);

            vasjournalsModel.create(journalPayload).catch(err => {
                console.error("Error: %s \r\n Unable to save transaction: %s", err.message, JSON.stringify(journalPayload))
            });

            return response.json(socketResponse.data)
        } catch (error) {
            console.log("Error: %s", error)
            return response.status(400).json({message: "An error Occured"})
        }
    }

    private static patchISWPayload(data: any, profile: IPTSPProfile, terminal: ITerminal): object {
        return {
            ...data, 
            destInstitutionCode: profile.iswInstitutionCode , 
            destAccountNumber: profile.iswDestinationAccount,
            merchantLocation: terminal?.parsedParams.merchantNameLocation || "HAPTICKSDATA LTD LA LANG",
            tid: terminal.iswTid,
            mid: profile.iswMid,
            uniqueId: terminal.iswUniqueId,
            amount: data.field4 || data.amount || 0,
            totalamount: data.field4 || data.amount || 0,
        }
    }

    private static getMessageType(terminal: ITerminal, amount: number): TransactionTypes {
        if(!terminal?.profile?.iswSwitchAmount) return TransactionTypes.ISO_TRANSACTION
        return (amount/100) >= terminal?.profile.iswSwitchAmount ? 
            TransactionTypes.ISW_KIMONO : 
            TransactionTypes.ISO_TRANSACTION;
    }

    private static createNIBBSJournal(response: CardPurchaseResponse, payload: ISOPayload): IJournal {
        return {
            PAN: Utils.getMaskPan(payload.field2),
            rrn: payload.field37,
            amount: Number.parseFloat(payload.field4)/100,
            STAN: payload.field11,
            cardExpiration: payload.field14,
            terminalId: payload.field41,
            merchantId: payload.field42,
            responseCode: response.resp,
            responseDescription: response.meaning,
            authCode: response.auth,
            merchantAddress: payload.field43,
            merchantName: payload.field43,
            product: "CASHOUT",
            transactionTime: (new Date).toUTCString(),
            handlerResponseTime: (new Date).toUTCString(),
            isCompleted: true,
        };
    }

    private static createISWJournal(response: CardPurchaseResponse, payload: KIMONOPayload, terminal: ITerminal): IJournal {
        return {
            PAN: Utils.getMaskPan(payload.pan),
            rrn: payload.rrn,
            amount: Number.parseFloat(payload.field4)/100,
            STAN: payload.stan,
            cardExpiration: payload.expirydate,
            terminalId: payload.tid,
            merchantId: payload.mid,
            responseCode: response.resp,
            responseDescription: response.meaning,
            authCode: response.auth,
            merchantName: terminal.parsedParams.merchantNameLocation,
            merchantCategoryCode: terminal?.parsedParams.mechantCategoryCode,
            product: "CASHOUT",
            transactionTime: (new Date).toUTCString(),
            handlerResponseTime: (new Date).toUTCString(),
            isCompleted: true,
            processor: Processor.KIMONO,
        }
    }
}

export default IsoCardContoller;