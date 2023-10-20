import { Request, Response } from "express";
import Terminal from "../db/models/terminal.model";
import logger from "../helpers/logger";
import {
  performCardSocketTranaction as performCardSocketTransaction,
  TransactionTypes,
  CardSocketResponse,
} from "../helpers/cardsockethelper";
import { ISOPayload, KIMONOPayload, Processor } from "../@types/types";
import vasjournalsModel, { IJournal } from "../db/models/transaction.model";
import Utils from "../helpers/utils";
import { ITerminal, ITerminalDocument } from "../db/models/terminal.model";
import { IPTSPProfile } from "../db/models/ptspProfile.model";
import { webhookQueue } from "../queue/queue";
import { IJournalDocument } from "../db/models/transaction.model";
import Inteliffin from "../services/inteliffin";
import { Document } from "mongoose";
import { PurchasePayload } from "../@types/types";
import { InteliffinTransTypes } from "../services/inteliffin";
import CardLogModel from "../db/models/cardTransactionLog.model";

export interface CardPurchaseResponse {
  resp: string;
  auth: string;
  icc: string;
  meaning: string;
  stan: string;
  rrn: string;
  meta?: object;
}

type TerminalDocument = Document<unknown, any, ITerminalDocument> &
  ITerminalDocument &
  Required<{
    _id: string;
  }>;



class IsoCardContoller {
  public async performKeyExchange(request: Request, response: Response) {
    try {
      const appVersion = request.header("x-app-version");
      const terminal = await Terminal.findOne({
        serialNo: request.header("x-serial-no"),
        deviceModel: request.header("x-device-model")?.toUpperCase() || null,
        brand: request.header("x-brand")?.toUpperCase() || null,
      }).populate({
        path: "profile",
      });

      if (!terminal) {
        return response.status(400).json({
          status: false,
          message: "Unknown terminal",
        });
      }
      terminal.appVersion = appVersion; // update app version

      const { componentKey1, isoHost, isoPort, isSSL, type, hasthreelineSupport } = terminal.profile;

      if(hasthreelineSupport && terminal.threeLineTid?.length) {
        performCardSocketTransaction(
          TransactionTypes.THREELINE_KEY_EXCHANGE,
          {
            tid: terminal.threeLineTid,
            component: terminal.profile.threeLineKey,
            ip: terminal.profile.threeLineHost,
            ssl: String(terminal.profile.threeLineHostSSL),
            port: terminal.profile.threeLinePort,
          }
        ).then((threeResult) => {
          if(threeResult.status) {
            terminal.threeLineParams = threeResult.data
            terminal.save()
          }
        }).catch((err) => {
          console.log(err)
        })
      }

      if (type === "intelliffin")
        return IsoCardContoller.handleIntelifinKeyExchange(terminal, response);

      const result = await performCardSocketTransaction(
        TransactionTypes.KEY_EXCHANGE,
        {
          tid: terminal.terminalId,
          component: componentKey1,
          ip: isoHost,
          ssl: String(isSSL),
          port: isoPort,
        }
      );



      if (!result.status) {
        return response.status(400).json(result);
      }
      const { data } = result;
      terminal.encmasterkey = data.encmasterkey;
      terminal.encpinkey = data.encpinkey;
      terminal.encsesskey = data.encsesskey;
      terminal.clrmasterkey = data.clrmasterkey;
      terminal.clrsesskey = data.clrsesskey;
      terminal.clrpinkey = data.clrpinkey;
      terminal.paramdownload = data.paramdownload;

      await terminal.save();
      return response.json({...data, parsedParams: terminal.parsedParams});
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        status: false,
        message: "An error occurred",
      });
    }
  }

  public static async handleIntelifinKeyExchange(
    terminal: TerminalDocument,
    response: Response
  ) {
    const { isoHost, isoPort, isSSL } = terminal.profile;

    try {
      const data = await Inteliffin.getPrepInfo({
        terminalid: terminal.terminalId,
        serialno: terminal.serialNo,
      });

      if (data.response !== "00") {
        return response.status(400).json({
          status: false,
          message: "Unable to Perform Key Exchange",
        });
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
        terminalid,
      } = data;

      const padLeadingZeros = (num: number) => num.toString().padStart(2, "0");
      terminal.encmasterkey = pin_key;
      terminal.encpinkey = data.pin_key;
      terminal.encsesskey = data.pin_key;
      terminal.clrmasterkey = data.pin_key;
      terminal.clrsesskey = data.pin_key;
      terminal.clrpinkey = data.pin_key;
      terminal.paramdownload = [
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
        .join("");

      await terminal.save();
      return response.json({
        encpinkey: pin_key,
        encsesskey: pin_key,
        clrpinkey: pin_key,
        clrsesskey: pin_key,
        encmasterkey: pin_key,
        paramdownload: terminal.paramdownload,
        tid: terminal.terminalId,
        clrmasterkey: pin_key,
      });
    } catch (error) {
      if (error.isAxiosError) {
        return response.status(400).json({
          status: false,
          message: error.response?.data.message,
        });
      }

      return response.status(400).json({
        status: false,
        message: "An error occurred",
      });
    }
  }

  public async getTerminalInfo(request: Request, response: Response) {
    try {
      const serial = request.header("x-serial-no");
      const brand = request.header("x-brand") || "";
      const deviceModel = request.header("x-device-model") || "";
      const appVersion = request.header("x-app-version") || null;

      const terminal = await Terminal.findOne({
        serialNo: serial,
        deviceModel: request.header("x-device-model")?.toUpperCase() || null,
        brand: request.header("x-brand")?.toUpperCase() || null,
      }).populate({ path: "profile", select: "title isoHost isoPort isSSL" });

      if (!terminal)
        return response.status(404).json({ message: "Terminal not found" });
      terminal.brand = brand;
      terminal.appVersion = appVersion;
      terminal.deviceModel = deviceModel;
      terminal.save();
      return response.json(terminal);
    } catch (error) {
      console.log("Error: %s", error.message);
      return response.status(400).json({ message: "An error Occured" });
    }
  }

  public async processCard(request: Request, response: Response) {
    const serial = request.header("x-serial-no");
    const brand = request.header("x-brand");
    const deviceModel = request.header("x-device-model") || "";
    const appVersion = request.header("x-app-version");
    const { body } = request;
    let patchedPayload,
        terminal: TerminalDocument,
        processor:string,
        transLog,
        messageType: TransactionTypes;

    try {
      terminal = await Terminal.findOne({
        serialNo: serial,
        deviceModel: deviceModel?.toUpperCase() || null,
        brand: brand?.toUpperCase() || null,
      }).populate({ path: "profile" });


      processor = String(body.processor).toUpperCase();
      processor = processor === "NIBSS" ? "ISO" : processor;

      if (!terminal || terminal.terminalId !== body.tid)
        return response
          .status(404)
          .json({ message: "Terminal not found/ Provisioned" });
      const { componentKey1, isoHost, isoPort, isSSL, type } = terminal.profile;
      transLog = await CardLogModel.create({
        tid: terminal.terminalId,
        amount: body.field4,
        maskedPan: Utils.getMaskPan(body.field2),
        rrn: body.field37,
        stan: body.field11,
      });

      messageType =
        terminal.profile.allowProcessorOverride &&
        ["KIMONO", "NIBSS", "BLUESALT", "ISO", "3LINE"].includes(processor)
          ? (processor as TransactionTypes)
          : IsoCardContoller.getMessageType(terminal, Number(body.field4));

      patchedPayload = IsoCardContoller.getPayload(
        messageType,
        body,
        terminal
      );

      const socketResponse =
        messageType === TransactionTypes.ISO_TRANSACTION &&
        terminal.profile.isInteliffin
          ? await IsoCardContoller.hanldeIntellifin(
              messageType,
              patchedPayload,
              terminal
            )
          : await performCardSocketTransaction(messageType, patchedPayload);

      const { data } = socketResponse;
      const responseData = data.data || data;
      const journalPayload = IsoCardContoller.saveTransaction(messageType, type, body, responseData, patchedPayload, terminal, appVersion, transLog);
      return response.json({
        ...socketResponse,
        ...{
          ...(socketResponse.data?.data || {}),
          processor: journalPayload.processor,
        },
        data: responseData,
        ...responseData,
        processor: journalPayload.processor,
      });
    } catch (error) {
      const responseData = error.data || error;
      IsoCardContoller.saveTransaction(
        messageType,
        terminal.profile.type,
        body,
        responseData,
        patchedPayload,
        terminal,
        appVersion, transLog
      )
      console.log("Error: %s", error);
      if(error.payload) {
        console.log("Payload: %s", JSON.stringify(error.payload));
      }

      return response
        .json({ status: false, data: null, message: "An error Occured" });
    }
  }

  public static saveTransaction(messageType: TransactionTypes, type: string, body: any, responseData: any, patchedPayload: any, terminal: TerminalDocument, appVersion: string, transLog: import("/home/prosperoking/projects/hapticks-middleware/intellifin-rerouting/src/db/models/cardTransactionLog.model").CardTransactionLogProfile & { _id: import("mongoose").Types.ObjectId; }) {
    const journalPayload = IsoCardContoller.resolveJournal(
      messageType,
      type,
      body,
      responseData,
      patchedPayload,
      terminal
    );
    terminal.appVersion = appVersion;
    terminal.save();

    vasjournalsModel
      .create({ ...journalPayload, organisationId: terminal.organisationId, webhookData: body.webhookData })
      .then((data) => {
        transLog.journalId = data._id;
        transLog.save();
        return IsoCardContoller.processWebHook(data, terminal);
      })
      .catch((err) => {
        console.error(
          "Error: %s \r\n Unable to save transaction: %s",
          err.message,
          JSON.stringify(journalPayload)
        );
      });
    return journalPayload;
  }

  public static resolveJournal(
    messageType: TransactionTypes,
    type,
    body,
    responseData,
    patchedPayload,
    terminal: ITerminal
  ) {
    switch (messageType) {
      case TransactionTypes.ISO_TRANSACTION:
        return IsoCardContoller.createNIBBSJournal(
          responseData,
          patchedPayload,
          IsoCardContoller.getISOProcessor(type),
        );
      case TransactionTypes.BLUESALT:
        return IsoCardContoller.createNIBBSJournal(
          responseData,
          patchedPayload,
          TransactionTypes.BLUESALT
        );
      case TransactionTypes.THREELINE:
        return IsoCardContoller.createNIBBSJournal(
          responseData,
          patchedPayload,
          TransactionTypes.THREELINE
        );
      case TransactionTypes.ISW_KIMONO:
        return IsoCardContoller.createISWJournal(
          responseData,
          body,
          terminal,
          IsoCardContoller.getISOProcessor(type)
        );
      default:
        return IsoCardContoller.createNIBBSJournal(
          responseData,
          patchedPayload,
          IsoCardContoller.getISOProcessor(type)
        );
    }
  }

  public static getPayload(messageType, body, terminal: ITerminal) {
    const {
      componentKey1,
      isoHost,
      isoPort,
      isSSL,
      type,
      blueSaltTID,
      blueSaltKey,
    } = terminal.profile;
    switch (messageType) {
      case TransactionTypes.ISO_TRANSACTION:
        return {
          ...body,
          component: componentKey1,
          ip: isoHost,
          ssl: String(isSSL),
          iso_flavour: type,
          port: isoPort,
          clrsesskey: terminal.clrsesskey,
          clrpin: terminal.clrpinkey,
          field43: terminal.parsedParams?.merchantNameLocation,
          field42: terminal.parsedParams?.mid,
        };
      case TransactionTypes.THREELINE:
        return {
          ...body,
          component: terminal.profile?.threeLineKey,
          ip: terminal.profile?.threeLineHost,
          ssl: String(terminal.profile?.threeLineHostSSL),
          iso_flavour: type,
          port: terminal.profile?.threeLinePort,
          clrsesskey: terminal.clrsesskey,
          clrpin: terminal.clrpinkey,
          field41: terminal.threeLineTid,
          field43: terminal.threeLineParsedParams?.merchantNameLocation,
          field42: terminal.threeLineParsedParams?.mid,
          threeLineclrPinKey: terminal.threeLineParams.clrPinKey,
        };
      case TransactionTypes.ISW_KIMONO:
        return IsoCardContoller.patchISWPayload(
          body,
          terminal.profile,
          terminal
        );
      case TransactionTypes.BLUESALT:
        return {
          ...IsoCardContoller.patchISWPayload(body, terminal.profile, terminal),
          serial: terminal.serialNo,
          blueSaltTid: blueSaltTID,
          blueSaltKey: blueSaltKey,
          model: terminal.deviceModel,
          device: terminal.deviceModel,
        };
      default:
        throw new Error("Invalid Message Type");
    }
  }

  public static getISOProcessor(key: string) {
    return !["generic", "intelliffin", "bluesalt", '3line'].includes(key)
      ? key
      : undefined;
  }

  public async checkBalance(request: Request, response: Response) {
    try {
      const serial = request.header("x-serial-no");
      const brand = request.header("x-brand");
      const deviceModel = request.header("x-device-model") || "";
      const appVersion = request.header("x-app-version");

      const terminal = await Terminal.findOne({
        serialNo: serial,
        deviceModel: deviceModel?.toUpperCase() || null,
        brand: brand?.toUpperCase() || null,
      }).populate({ path: "profile" });

      const { body } = request;
      let processor = String(body.processor).toUpperCase();
      processor = processor === "NIBSS" ? "ISO" : processor;
      console.log("Processor: %s => %s", terminal.terminalId, body.tid);
      if (!terminal || terminal.terminalId !== body.tid)
        return response
          .status(404)
          .json({ message: "Terminal not found/ Provisioned" });
      const { componentKey1, isoHost, isoPort, isSSL, type } = terminal.profile;

      const patchedPayload = {
        ...body,
        component: componentKey1,
        ip: isoHost,
        ssl: String(isSSL),
        port: isoPort,
        clrsesskey: terminal.clrsesskey,
        clrpin: terminal.clrpinkey,
        field0: "0100",
        field3: "31" + body.field3.substring(2),
        field43: terminal.parsedParams?.merchantNameLocation,
        field42: terminal.parsedParams?.mid,
      };
      const socketResponse = terminal.profile.isInteliffin
        ? await IsoCardContoller.hanldeIntellifin(
            TransactionTypes.BALACE_CHECK,
            patchedPayload,
            terminal,
            7
          )
        : await performCardSocketTransaction(
            TransactionTypes.BALACE_CHECK,
            patchedPayload
          );

      const { data } = socketResponse;
      const responseData = data.data || data;
      terminal.appVersion = appVersion;
      terminal.save();

      return response.json({
        ...socketResponse,
        ...{ ...(socketResponse.data?.data || {}) },
        data: responseData,
        ...responseData,
      });
    } catch (error) {
      console.log("Error: %s", error);
      return response
        .status(400)
        .json({ status: false, data: null, message: "An error Occured" });
    }
  }

  private static async hanldeIntellifin(
    type: TransactionTypes,
    payload: PurchasePayload,
    terminal: ITerminal,
    transType: number | null = null
  ): Promise<CardSocketResponse> {
    try {
      const data = await Inteliffin.performTranaction({
        amount: payload.field4,
        pinblock: payload.field52,
        terminalid: payload.tid,
        merchantid: payload.field42,
        cashback: "0",
        merchant_address: terminal.parsedParams?.merchantNameLocation,
        transtype:
          transType?.toString() ??
          (type === TransactionTypes.ISO_TRANSACTION
            ? InteliffinTransTypes.PURCHASE
            : InteliffinTransTypes.PURCHASE),
        stan: payload.field11,
        iccdata: payload.field55,
        track2: payload.field35,
        rrn: payload.field37,
        panseqno: payload.panseqno,
        merchant_category_code: terminal.parsedParams?.mechantCategoryCode,
        currency_code: terminal.parsedParams?.currencyCode,
      });

      return {
        status: data.response === "00",
        message: data.description,
        data: {
          resp: data.response,
          auth: data.authid,
          meaning: data.description,
          icc: data.iccresponse,
          stan: data.stan,
          rrn: data.rrn,
          balance: data.balance,
        },
      };
    } catch (error) {
      console.error(error.message, error);
      return {
        status: false,
        message: error.message,
        data: {
          resp: "06",
          auth: null,
          meaning: "An error occurred",
          icc: null,
        },
      };
    }
  }

  private static async handleOtherTransaction(
    type: TransactionTypes,
    payload: any
  ): Promise<CardSocketResponse> {
    return await performCardSocketTransaction(type, payload);
  }

  private static patchISWPayload(
    data: any,
    profile: IPTSPProfile,
    terminal: ITerminal
  ): object {
    return {
      ...data,
      destInstitutionCode: profile.iswInstitutionCode,
      destAccountNumber: profile.iswDestinationAccount,
      merchantLocation:
        terminal?.parsedParams.merchantNameLocation ||
        "HAPTICKSDATA LTD LA LANG",
      tid: terminal.iswTid,
      mid: profile.iswMid,
      field43: terminal.parsedParams?.merchantNameLocation || data.field43,
      uniqueId: terminal.iswUniqueId,
      amount: data.field4 || data.amount || 0,
      totalamount: data.field4 || data.amount || 0,
      clrsesskey: terminal.clrsesskey,
      clrpin: terminal.clrpinkey,
      pinblock: data.pinblock || "",
    };
  }

  private static getMessageType(
    terminal: ITerminal,
    amount: number
  ): TransactionTypes {
    const profile = terminal?.profile;
    if (!terminal?.profile?.iswSwitchAmount && !profile.processorSettings)
      return TransactionTypes.ISO_TRANSACTION;
    if (!profile.processorSettings)
      return amount / 100 >= (terminal?.profile.iswSwitchAmount as number)
        ? TransactionTypes.ISW_KIMONO
        : TransactionTypes.ISO_TRANSACTION;

    const type = profile.processorSettings.find(
      (band) => amount / 100 >= band.minAmount && amount / 100 <= band.maxAmount
    )?.processor;
    switch (type) {
      case "nibss":
        return TransactionTypes.ISO_TRANSACTION;
      case "kimono":
        return TransactionTypes.ISW_KIMONO;
      case "3line":
          return TransactionTypes.THREELINE;
      case "bluesalt":
        return TransactionTypes.BLUESALT;
      default:
        return TransactionTypes.ISO_TRANSACTION;
    }
  }

  private static createNIBBSJournal(
    response: CardPurchaseResponse,
    payload: ISOPayload,
    processor?: string,
  ): IJournal {
    return {
      PAN: Utils.getMaskPan(payload.field2),
      rrn: (response?.meta || {})["rrn"] || response.rrn || payload.field37,
      amount: Number.parseFloat(payload.field4),
      STAN: response.stan || payload.field11,
      cardExpiration: payload.field14,
      terminalId: payload.field41,
      merchantId: payload.field42,
      responseCode: response.resp,
      responseDescription: response.meaning,
      authCode: response.auth,
      merchantAddress: payload.field43,
      merchantName: payload.field43,
      product: "CASHOUT",
      transactionTime: new Date().toUTCString(),
      handlerResponseTime: new Date().toUTCString(),
      isCompleted: true,
      processor: processor ?? Processor.NIBSS,
      meta: response.meta,
    };
  }

  private static create3LineJournal(
    response: CardPurchaseResponse,
    payload: ISOPayload,
    processor?: string
  ): IJournal {
    return {
      PAN: Utils.getMaskPan(payload.field2),
      rrn: (response?.meta || {})["rrn"] || response.rrn || payload.field37,
      amount: Number.parseFloat(payload.field4),
      STAN: response.stan || payload.field11,
      cardExpiration: payload.field14,
      terminalId: payload.field41,
      merchantId: payload.field42,
      responseCode: response.resp,
      responseDescription: response.meaning,
      authCode: response.auth,
      merchantAddress: payload.field43,
      merchantName: payload.field43,
      product: "CASHOUT",
      transactionTime: new Date().toUTCString(),
      handlerResponseTime: new Date().toUTCString(),
      isCompleted: true,
      processor: Processor.THREELINE,
      meta: response.meta,
    };
  }

  private static createISWJournal(
    response: CardPurchaseResponse,
    payload: KIMONOPayload,
    terminal: ITerminal,
    processor: string
  ): IJournal {
    return {
      PAN: Utils.getMaskPan(payload.pan),
      rrn: payload.rrn,
      amount: Number.parseFloat(payload.field4),
      STAN: payload.stan,
      cardExpiration: payload.expirydate,
      terminalId: terminal.iswTid,
      merchantId: terminal.iswUniqueId,
      responseCode: response.resp,
      responseDescription: response.meaning,
      authCode: response.auth,
      merchantName: terminal.parsedParams.merchantNameLocation,
      merchantCategoryCode: terminal?.parsedParams.mechantCategoryCode,
      product: "CASHOUT",
      transactionTime: new Date().toUTCString(),
      handlerResponseTime: new Date().toUTCString(),
      isCompleted: true,
      processor: processor ?? Processor.KIMONO,
    };
  }

  private static async processWebHook(
    transaction: IJournalDocument,
    terminal: ITerminal
  ) {
    if (!terminal.profile.webhookId) return;
    webhookQueue.add("sendNotification", {
      tranactionId: transaction._id,
      webhookId: terminal.profile.webhookId,
      organisationId: terminal.organisationId,
    });
  }
}

export default IsoCardContoller;
