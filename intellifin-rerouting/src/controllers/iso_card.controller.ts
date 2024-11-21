import { Request, Response } from "express";
import Terminal from "../db/models/terminal.model";
import logger from "../helpers/logger";
import {
  sendSocketMessage as performCardSocketTransaction,
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
import CardLogModel, {
  CardTransactionLogProfile,
} from "../db/models/cardTransactionLog.model";
import { generateTDESKey } from "../helpers/appUtils";
import moment from "moment";
import { getBinDetails } from "../helpers/cardBins";
import webhookModel from "../db/models/webhook.model";

export interface CardPurchaseResponse {
  resp: string;
  auth: string;
  icc: string;
  meaning: string;
  stan: string;
  rrn: string;
  meta?: object;
  reversal?: object;
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
      })
        .populate({
          path: "profile",
        })
        .populate("groupTid");

      if (!terminal) {
        return response.status(400).json({
          status: false,
          message: "Unknown terminal",
        });
      }
      terminal.appVersion = appVersion; // update app version
      const padLeadingZeros = (num: number) => num.toString().padStart(2, "0");
      const {
        componentKey1,
        isoHost,
        isoPort,
        isSSL,
        type,
        hasthreelineSupport,
      } = terminal.profile;
      let threeResult;
      if (hasthreelineSupport && terminal.threeLineTid?.length) {
        threeResult = await performCardSocketTransaction(
          TransactionTypes.THREELINE_KEY_EXCHANGE,
          {
            tid: terminal.threeLineTid,
            component: terminal.profile.threeLineKey,
            ip: terminal.profile.threeLineHost,
            ssl: String(terminal.profile.threeLineHostSSL),
            port: terminal.profile.threeLinePort,
          }
        );

        if (threeResult.status) {
          terminal.threeLineParams = threeResult.data;
          await terminal.save();
        }
      }
      if (terminal.usingGroupedTid) {
        const {
          encmasterkey,
          encpinkey,
          encsesskey,
          clrmasterkey,
          clrsesskey,
          clrpinkey,
          paramdownload,
          parsedParams,
          terminalId,
        } = terminal.groupTid;

        return response.json({
          encmasterkey,
          encpinkey,
          encsesskey,
          clrmasterkey,
          clrsesskey,
          clrpinkey,
          paramdownload,
          parsedParams,
          tid: terminalId,
          terminalId,
          customerAddress: terminal.customerAddress,
          iswISOTID: terminal.iswISOTID,
          iswISOTIDNew: terminal.iswISOTIDNew,
          hydrogenTID: terminal.hydrogenTID,
          profileId: terminal.profile?._id,
          iswTid: terminal.iswTid,
          threeLineTid: terminal.threeLineTid,
          kimonoTid: terminal.iswTid,
          organisationId: terminal.organisation?._id,
        });
      }

      const newKey = generateTDESKey();
      terminal.encmasterkey = newKey;
      terminal.encpinkey = newKey;
      terminal.encsesskey = newKey;
      terminal.clrmasterkey = newKey;
      terminal.clrsesskey = newKey;
      terminal.clrpinkey = newKey;

      if(!terminal.terminalId?.length){
        const datetime = moment().format('YYYYMMDDHHmmss');
        const merchantid = "2302BAXXXXXX9611"
        const timeout = "60"
        const currency_code = "566"
        const country_code = "566"
        const callhome = "60"
        const merchant_category_code = "5411"
        const merchant_address = terminal.customerAddress?? "DEVICE NEEDS SETUP"
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
          .join("")
        await terminal.save()
        const {
          encmasterkey,
          encpinkey,
          encsesskey,
          clrmasterkey,
          clrsesskey,
          clrpinkey,
          paramdownload,
          parsedParams,
          terminalId,
        } = terminal;
        return response.json({
          encmasterkey,
          encpinkey,
          encsesskey,
          clrmasterkey,
          clrsesskey,
          clrpinkey,
          paramdownload,
          terminalId,
          tid: terminalId,
          parsedParams,
          customerAddress: terminal.customerAddress,
          iswISOTID: terminal.iswISOTID,
          hydrogenTID: terminal.hydrogenTID,
          profileId: terminal.profile?._id,
          iswTid: terminal.iswTid,
          kimonoTid: terminal.iswTid,
          threeLineTid: terminal.threeLineTid,
          organisationId: terminal.organisation?._id,
        });
      }


      if (type === "intelliffin")
        return IsoCardContoller.handleIntelifinKeyExchange(terminal, response);

      const result =
        type === "3line" &&
        terminal.threeLineTid === terminal.terminalId &&
        threeResult?.status
          ? threeResult
          : await performCardSocketTransaction(TransactionTypes.KEY_EXCHANGE, {
              tid: terminal.terminalId,
              component: componentKey1,
              ip: isoHost,
              ssl: String(isSSL),
              port: isoPort,
            });

      if (!result.status) {
        return response.status(400).json(result);
      }
      const { data } = result;
      terminal.nibssParams = {
        encmasterkey: data.encmasterkey,
        encPinKey: data.encpinkey,
        encSessionKey: data.encsesskey,
        clrMasterKey: data.clrmasterkey,
        clrSessionKey: data.clrsesskey,
        clrpinkey: data.clrpinkey,
        paramdownload: data.paramdownload,
      };
      terminal.paramdownload = data.paramdownload;

      await terminal.save();
      const {
        encmasterkey,
        encpinkey,
        encsesskey,
        clrmasterkey,
        clrsesskey,
        clrpinkey,
        paramdownload,
        parsedParams,
        terminalId,
      } = terminal;
      return response.json({
        encmasterkey,
        encpinkey,
        encsesskey,
        clrmasterkey,
        clrsesskey,
        clrpinkey,
        paramdownload,
        terminalId,
        tid: terminalId,
        parsedParams,
        customerAddress: terminal.customerAddress,
        iswISOTID: terminal.iswISOTID,
        hydrogenTID: terminal.hydrogenTID,
        profileId: terminal.profile?._id,
        iswTid: terminal.iswTid,
        kimonoTid: terminal.iswTid,
        threeLineTid: terminal.threeLineTid,
        organisationId: terminal.organisation?._id,
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        status: false,
        message: "An error occurred",
      });
    }
  }

  public async requeryTransaction(request: Request, response: Response) {
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
      const { rrn } = request.body;

      const data = await vasjournalsModel
        .find({
          rrn,
        })
        .exec();
      return response.json({
        status: data.length > 0,
        data: data.map((item) => ({
          rrn: item.rrn,
          stan: item.STAN,
          amount: item.amount,
          responseCode: item.responseCode,
          responseDescription: item.responseDescription,
          PAN: item.PAN,
          authCode: item.authCode,
          processor: item.processor,
        })),
      });
    } catch (error) {
      logger.error(error);
      return response.status(500).json({ message: "An error occurred" });
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
      const internalKey = generateTDESKey();
      terminal.encmasterkey = internalKey;
      terminal.encpinkey = internalKey;
      terminal.encsesskey = internalKey;
      terminal.clrmasterkey = internalKey;
      terminal.clrsesskey = internalKey;
      terminal.clrpinkey = internalKey;
      // terminal.paramdownload = [
      //   ["020", padLeadingZeros(datetime.length), datetime],
      //   ["030", padLeadingZeros(merchantid.length), merchantid],
      //   ["040", padLeadingZeros(timeout.length), timeout],
      //   ["050", padLeadingZeros(currency_code.length), currency_code],
      //   ["060", padLeadingZeros(country_code.length), country_code],
      //   ["070", padLeadingZeros(callhome.length), callhome],
      //   [
      //     "080",
      //     padLeadingZeros(merchant_category_code.length),
      //     merchant_category_code,
      //   ],
      //   ["520", padLeadingZeros(merchant_address.length), merchant_address],
      // ]
      //   .map((a) => a.join(""))
      // .join("");
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
      };
      terminal.paramdownload = terminal.nibssParams.paramdownload;
      await terminal.save();
      return response.json({
        encpinkey: internalKey,
        encsesskey: internalKey,
        clrpinkey: internalKey,
        clrsesskey: internalKey,
        encmasterkey: internalKey,
        paramdownload: terminal.paramdownload,
        tid: terminal.terminalId,
        clrmasterkey: internalKey,
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
      })
        .populate({ path: "profile", select: "title isoHost isoPort isSSL" })
        .populate({ path: "groupTid" });

      if (!terminal)
        return response.status(404).json({ message: "Terminal not found" });
      terminal.brand = brand;
      terminal.appVersion = appVersion;
      terminal.deviceModel = deviceModel;
      terminal.save();
      const {
        encmasterkey,
        encpinkey,
        encsesskey,
        clrmasterkey,
        clrsesskey,
        clrpinkey,
        paramdownload,
        parsedParams,
        terminalId,
      } = !terminal.usingGroupedTid ? terminal : terminal.groupTid;

      return response.json({
        encmasterkey,
        encpinkey,
        encsesskey,
        clrmasterkey,
        clrsesskey,
        clrpinkey,
        paramdownload,
        parsedParams,
        tid: terminalId,
        terminalId,
        customerAddress: terminal.customerAddress,
        iswISOTID: terminal.iswISOTID,
        hydrogenTID: terminal.hydrogenTID,
        profileId: terminal.profile?._id,
        iswTid: terminal.iswTid,
        kimonoTid: terminal.iswTid,
        threeLineTid: terminal.threeLineTid,
        organisationId: terminal.organisation?._id,
      });
    } catch (error) {
      console.log("Error: %s", error.message);
      return response.status(400).json({ message: "An error Occured" });
    }
  }

  public static patchTerminalWithGroupValues(
    terminal: TerminalDocument
  ): TerminalDocument {
    const {
      encmasterkey,
      encpinkey,
      encsesskey,
      clrmasterkey,
      clrsesskey,
      clrpinkey,
      paramdownload,
      terminalId,
    } = terminal.groupTid;
    terminal.encmasterkey = encmasterkey;
    terminal.encpinkey = encpinkey;
    terminal.encsesskey = encsesskey;
    terminal.clrmasterkey = clrmasterkey;
    terminal.clrsesskey = clrsesskey;
    terminal.clrpinkey = clrpinkey;
    terminal.paramdownload = paramdownload;
    terminal.terminalId = terminalId;
    return terminal;
  }

  public async processCard(request: Request, response: Response) {
    const startOfTransaction = performance.now();
    const serial = request.header("x-serial-no");
    const brand = request.header("x-brand");
    const deviceModel = request.header("x-device-model") || "";
    const appVersion = request.header("x-app-version");
    const { body } = request;
    let patchedPayload,
      terminal: TerminalDocument,
      processor: string,
      transLog,
      transactingTid,
      transactingMid,
      messageType: TransactionTypes;

    try {
      // @ts-ignore
      terminal = request.terminal || await Terminal.findOne({
        serialNo: serial,
        deviceModel: deviceModel?.toUpperCase() || null,
        brand: brand?.toUpperCase() || null,
      })
        .populate({ path: "profile" })
        .populate({ path: "groupTid" });

      processor = String(body.processor).toUpperCase();
      processor =
        processor === "NIBSS"
          ? terminal.profile.type === "3line"
            ? "3LINE"
            : "ISO"
          : processor;
      if (
        !terminal ||
        ![terminal.terminalId, terminal.groupTid?.terminalId].includes(
          body.tid
        ) ||
        body.tid == null
      )
        return response
          .status(404)
          .json({ message: "Terminal not found/ Provisioned" });
      const { type } = terminal.profile;
      // patch terminal values for the transaction
      if (terminal.usingGroupedTid) {
        IsoCardContoller.patchTerminalWithGroupValues(terminal);
      }

      if (body.clrpinkey?.length && terminal.clrpinkey !== body.clrpinkey) {
        return response.status(412).json({ message: "Expired Keys" });
      }

      transLog = await CardLogModel.create({
        tid: terminal.terminalId,
        amount: body.field4,
        maskedPan: Utils.getMaskPan(body.field2),
        rrn: body.field37,
        stan: body.field11,
      });

      messageType =
        terminal.profile.allowProcessorOverride &&
        [
          "KIMONO",
          "NIBSS",
          "BLUESALT",
          "ISO",
          "3LINE",
          "ISW",
          "HYDROGEN",
          "HABARI",
        ].includes(processor)
          ? IsoCardContoller.resolveProcessorTransType(processor.toLowerCase())
          : IsoCardContoller.getMessageType(terminal, Number(body.field4));

      patchedPayload = IsoCardContoller.getPayload(messageType, body, terminal);
      transactingTid = patchedPayload.tid;
      transactingMid = patchedPayload.mid;
      const isDuplicate = await IsoCardContoller.checkIfDuplication(
        patchedPayload.tid,
        patchedPayload.rrn,
        patchedPayload.stan,
        Utils.getMaskPan(body.field2),
        messageType
      );

      if (isDuplicate) {
        return response.json({
          status: false,
          resp: 26,
          transactingTid,
          transactingMid,
          processor: "",
          meaning: "Duplicate Transaction",
          data: {
            resp: 26,
            transactingTid,
            transactingMid,
            meaning: "Duplicate Transaction",
          },
        });
      }

      const socketResponse =
        messageType === TransactionTypes.ISO_TRANSACTION &&
        terminal.profile.isInteliffin
          ? await IsoCardContoller.hanldeIntellifin(
              messageType,
              patchedPayload,
              terminal
            )
          : await performCardSocketTransaction(messageType, patchedPayload);
      const totalTransTime = performance.now() - startOfTransaction;
      const { data } = socketResponse;
      const responseData = data?.data || data;
      responseData.transactingTid = transactingTid;
      responseData.transactingMid = transactingMid;
      body.totalTransTime = totalTransTime;
      const journalPayload = IsoCardContoller.saveTransaction(
        messageType,
        type,
        body,
        responseData,
        patchedPayload,
        terminal,
        appVersion,
        transLog
      );
      return response.json({
        ...socketResponse,
        ...{
          ...(socketResponse.data?.data || {}),
          processor: journalPayload.processor,
        },
        data: responseData,
        ...responseData,
        processor: journalPayload.processor,
        issuer: getBinDetails(journalPayload.PAN),
        totalTransTime,
      });
    } catch (error) {
      console.log("Error: %s", error);
      const responseData = error.data || error;
      responseData.transactingTid = transactingTid;
      responseData.transactingMid = transactingMid;
      const totalTransTime = performance.now() - startOfTransaction;
      body.totalTransTime = totalTransTime;
      IsoCardContoller.saveTransaction(
        messageType,
        terminal.profile.type,
        body,
        responseData,
        patchedPayload,
        terminal,
        appVersion,
        transLog,
      );

      if (error.payload) {
        console.log("Payload: %s", JSON.stringify(error.payload));
      }

      return response.json({
        status: false,
        data: null,
        message: "An error Occured",
        processor,
        issuer: getBinDetails(patchedPayload.field2),
      });
    }
  }

  public static saveTransaction(
    messageType: TransactionTypes,
    type: string,
    body: any,
    responseData: any,
    patchedPayload: any,
    terminal: TerminalDocument,
    appVersion: string,
    transLog: CardTransactionLogProfile & {
      _id: import("mongoose").Types.ObjectId;
    }
  ) {
    const journalPayload = IsoCardContoller.resolveJournal(
      messageType,
      type,
      body,
      responseData,
      patchedPayload,
      terminal
    );
    Terminal.findOneAndUpdate(
      { _id: terminal._id },
      { appVersion },
      { new: true }
    );

    vasjournalsModel
      .create({
        ...journalPayload,
        organisationId: terminal.organisationId,
        webhookData: body.webhookData,
        totalTransTime: body.totalTransTime,
        issuer: getBinDetails(journalPayload.PAN).code,
        deviceInfo:{
          serial: terminal.serialNo,
          model: terminal.deviceModel,
          brand: terminal.brand
        }
      })
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
          IsoCardContoller.getISOProcessor(type)
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
      case TransactionTypes.ISW_PURCHASE:
        return IsoCardContoller.createISWISOJournal(
          responseData,
          patchedPayload,
          terminal,
          IsoCardContoller.getISOProcessor(type)
        );
      case TransactionTypes.HYDROGEN_PURCHASE:
        return IsoCardContoller.createHydrogenJournal(
          responseData,
          patchedPayload,
          terminal,
          IsoCardContoller.getISOProcessor(type)
        );
      case TransactionTypes.HABARI_PURCHASE:
        return IsoCardContoller.createHabariJournal(
          responseData,
          patchedPayload,
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
          host: isoHost,
          ssl: String(isSSL),
          iso_flavour: type,
          port: isoPort,
          clrsesskey: terminal.nibssParams?.clrSessionKey ?? terminal.clrsesskey,
          clrpin: terminal.clrpinkey,
          field43: terminal.parsedParams?.merchantNameLocation,
          field42: terminal.parsedParams?.mid,
          nibssPinKey: terminal.nibssParams?.clrpinkey ?? terminal.clrpinkey,
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
          clrPinKey: terminal.clrpinkey,
          field41: terminal.threeLineTid,
          field43: terminal.threeLineParsedParams?.merchantNameLocation,
          field42: terminal.threeLineParsedParams?.mid,
          threeLineclrPinKey: terminal.threeLineParams.clrPinKey,
          threeLinePinKey: terminal.threeLineParams.clrpinkey,
          tid: terminal.threeLineTid,
          mid: terminal.threeLineParsedParams?.mid,
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
      case TransactionTypes.ISW_PURCHASE:
        return {
          ...IsoCardContoller.patchISWISOPayload(
            body,
            terminal.profile,
            terminal
          ),
        };
      case TransactionTypes.HYDROGEN_PURCHASE:
        return {
          ...IsoCardContoller.patchHydrogenPayload(
            body,
            terminal.profile,
            terminal
          ),
        };
      case TransactionTypes.HABARI_PURCHASE:
        return {
          ...IsoCardContoller.patchHabariPayload(
            body,
            terminal.profile,
            terminal
          ),
        };
      default:
        throw new Error("Invalid Message Type");
    }
  }

  public static getISOProcessor(key: string) {
    return !["generic", "intelliffin", "bluesalt", "3line"].includes(key)
      ? key
      : undefined;
  }

  public async checkBalance(request: Request, response: Response) {
    try {
      const serial = request.header("x-serial-no");
      const brand = request.header("x-brand");
      const deviceModel = request.header("x-device-model") || "";
      const appVersion = request.header("x-app-version");

      let terminal = await Terminal.findOne({
        serialNo: serial,
        deviceModel: deviceModel?.toUpperCase() || null,
        brand: brand?.toUpperCase() || null,
      })
        .populate({ path: "profile" })
        .populate("groupTid");

      const { body } = request;
      let processor = String(body.processor).toUpperCase();
      processor = processor === "NIBSS" ? "ISO" : processor;
      console.log("Processor: %s => %s", terminal.terminalId, body.tid);
      if (
        !terminal ||
        ![terminal.terminalId, terminal.groupTid?.terminalId].includes(
          body.tid
        ) ||
        body.tid == null
      )
        return response
          .status(404)
          .json({ message: "Terminal not found/ Provisioned" });
      terminal.appVersion = appVersion;
      await terminal.save().catch(console.log);
      const { componentKey1, isoHost, isoPort, isSSL, type } = terminal.profile;

      if (terminal.usingGroupedTid) {
        terminal = IsoCardContoller.patchTerminalWithGroupValues(terminal);
      }
      const patchedPayload = {
        ...body,
        component: componentKey1,
        ip: isoHost,
        host: isoHost,
        ssl: String(isSSL),
        port: isoPort,
        clrsesskey: terminal.nibssParams?.clrSessionKey ?? terminal.clrsesskey,
        nibssPinKey: terminal.nibssParams?.clrpinkey ?? terminal.clrpinkey,
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
  ): Promise<CardSocketResponse<any>> {
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
  ): Promise<CardSocketResponse<any>> {
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

  private static patchISWISOPayload(
    data: any,
    profile: IPTSPProfile,
    terminal: ITerminal
  ): object {
    const {
      host,
      port,
      ssl,
      zpk,
      mid,
      rid,
      oRid,
      mcc,
      ett,
      settlementAccount,
    } = profile.iswISOConfig;

    return {
      ...data,
      destInstitutionCode: profile.iswInstitutionCode,
      destAccountNumber: profile.iswDestinationAccount,
      merchantLocation:
        data.terminalLocation ||
        terminal?.terminalLocation?.location ||
        terminal.parsedParams?.merchantNameLocation,
      tid: terminal.iswISOTIDNew ?? terminal.iswISOTID,
      mid: mid,
      field42: mid,
      field18: mcc,
      field41: terminal.iswISOTID,
      field43: data.field43 || terminal.parsedParams?.merchantNameLocation,
      uniqueId: terminal.iswUniqueId,
      amount: data.field4 || data.amount || 0,
      totalamount: data.field4 || data.amount || 0,
      clrsesskey: terminal.clrsesskey,
      clrpin: terminal.clrpinkey,
      pinblock: data.pinblock || "",
      clearZpk: zpk,
      host,
      port,
      rid,
      oRid,
      ssl,
      ett,
      settlementAccount,
    };
  }

  private static patchHydrogenPayload(
    data: any,
    profile: IPTSPProfile,
    terminal: ITerminal
  ): object {
    const { host, port, ssl, zpk, mid, acqId, mcc } = profile.hydrogenConfig;
    return {
      ...data,
      destInstitutionCode: profile.iswInstitutionCode,
      destAccountNumber: profile.iswDestinationAccount,
      merchantLocation:
        data.terminalLocation ||
        terminal?.terminalLocation?.location ||
        terminal?.parsedParams.merchantNameLocation,
      tid: terminal.hydrogenTID,
      mid: mid,
      field18: mcc,
      field43: terminal.parsedParams?.merchantNameLocation || data.field43,
      uniqueId: terminal.iswUniqueId,
      amount: data.field4 || data.amount || 0,
      totalamount: data.field4 || data.amount || 0,
      clrsesskey: terminal.clrsesskey,
      clrpin: terminal.clrpinkey,
      pinblock: data.pinblock || "",
      clearZpk: zpk,
      host,
      port,
      ssl,
      acqId,
    };
  }

  private static patchHabariPayload(
    data: any,
    profile: IPTSPProfile,
    terminal: ITerminal
  ): object {
    const { host, port, ssl, zpk, mid, acqId, mcc } = profile.habariConfig;
    return {
      ...data,
      destInstitutionCode: profile.iswInstitutionCode,
      destAccountNumber: profile.iswDestinationAccount,
      merchantLocation:
        data.terminalLocation ||
        terminal?.terminalLocation?.location ||
        terminal?.parsedParams.merchantNameLocation,
      tid: terminal.habariTID,
      mid: mid,
      field18: mcc,
      field43: terminal.parsedParams?.merchantNameLocation || data.field43,
      uniqueId: terminal.iswUniqueId,
      amount: data.field4 || data.amount || 0,
      totalamount: data.field4 || data.amount || 0,
      clrsesskey: terminal.clrsesskey,
      clrpin: terminal.clrpinkey,
      pinblock: data.pinblock || "",
      clearZpk: zpk,
      host,
      port,
      ssl,
      acqId,
    };
  }

  private static getMessageType(
    terminal: ITerminal,
    amount: number
  ): TransactionTypes {
    const profile = terminal?.profile;
    if (!terminal?.profile?.iswSwitchAmount && !profile.processorSettings)
      return TransactionTypes.ISO_TRANSACTION;
    if (!profile.processorSettings?.length)
      return amount / 100 >= (terminal?.profile.iswSwitchAmount as number)
        ? TransactionTypes.ISW_KIMONO
        : TransactionTypes.ISO_TRANSACTION;

    const type = profile.processorSettings.find(
      (band) => amount / 100 >= band.minAmount && amount / 100 <= band.maxAmount
    )?.processor;
    console.log(type);
    return IsoCardContoller.resolveProcessorTransType(type);
  }

  private static resolveProcessorTransType(type: string) {
    switch (type) {
      case "nibss":
        return TransactionTypes.ISO_TRANSACTION;
      case "kimono":
        return TransactionTypes.ISW_KIMONO;
      case "3line":
        return TransactionTypes.THREELINE;
      case "bluesalt":
        return TransactionTypes.BLUESALT;
      case "isw":
        return TransactionTypes.ISW_PURCHASE;
      case "hydrogen":
        return TransactionTypes.HYDROGEN_PURCHASE;
      case "habari":
        return TransactionTypes.HABARI_PURCHASE;
      default:
        return TransactionTypes.ISO_TRANSACTION;
    }
  }

  private static createNIBBSJournal(
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
      merchantId: payload.mid,
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

  private static createISWISOJournal(
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
      terminalId: terminal.iswISOTIDNew ?? terminal.iswISOTID,
      merchantId: payload.mid,
      responseCode: response.resp,
      responseDescription: response.meaning,
      authCode: response.auth,
      merchantName:
        payload.merchantLocation ?? terminal.parsedParams.merchantNameLocation,
      merchantCategoryCode: terminal?.parsedParams.mechantCategoryCode,
      product: "CASHOUT",
      transactionTime: new Date().toUTCString(),
      handlerResponseTime: new Date().toUTCString(),
      isCompleted: true,
      processor: processor ?? Processor.ISW,
      reversal: Boolean(response.reversal),
      reversalData: response.reversal,
    };
  }

  private static createHydrogenJournal(
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
      terminalId: terminal.hydrogenTID,
      merchantId: payload.mid,
      responseCode: response.resp,
      responseDescription: response.meaning,
      authCode: response.auth,
      merchantName: payload.merchantLocation ?? payload.field43,
      merchantCategoryCode: payload.mcc,
      product: "CASHOUT",
      transactionTime: new Date().toUTCString(),
      handlerResponseTime: new Date().toUTCString(),
      isCompleted: true,
      processor: processor ?? Processor.HYDROGEN,
      reversal: Boolean(response.reversal),
      reversalData: response.reversal,
    };
  }

  private static createHabariJournal(
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
      terminalId: terminal.habariTID,
      merchantId: payload.mid,
      responseCode: response.resp,
      responseDescription: response.meaning,
      authCode: response.auth,
      merchantName: payload.merchantLocation ?? payload.field43,
      merchantCategoryCode: payload.mcc,
      product: "CASHOUT",
      transactionTime: new Date().toUTCString(),
      handlerResponseTime: new Date().toUTCString(),
      isCompleted: true,
      processor: processor ?? Processor.HABARI,
      reversal: Boolean(response.reversal),
      reversalData: response.reversal,
    };
  }

  private static async processWebHook(
    transaction: IJournalDocument,
    terminal: ITerminal
  ) {
    if (!terminal.profile.webhookId) return;
    const webhook = await webhookModel.findById(terminal.profile.webhookId);
    webhook.dest_urls.forEach((url)=>{
      console.log("Firing for url: ",url)
      webhookQueue.add("sendNotification", {
        tranactionId: transaction._id,
        webhookId: terminal.profile.webhookId,
        organisationId: terminal.organisationId,
        url
      },{
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 1000 * 5
        }
      });
    })
  }

  private static async checkIfDuplication(
    tid,
    rrn,
    stan,
    maskpan,
    processor
  ): Promise<boolean> {
    const _id = await vasjournalsModel.exists({
      terminalId: tid,
      rrn,
      STAN: stan,
      PAN: maskpan,
    });
    return _id != null;
  }
}

export default IsoCardContoller;
