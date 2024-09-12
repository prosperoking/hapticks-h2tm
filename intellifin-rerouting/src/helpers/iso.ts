import { ParsedTLv, PurchasePayload, SlimPurchasePayload } from "types";
import { ITerminalDocument } from '../db/models/terminal.model';
import { TlvFactory } from "ber-tlv";
import Terminal from '../db/models/terminal.model';
import moment from "moment";

export async function reparkPayLoad(
  data: SlimPurchasePayload,
  action: "purchase" | "balance",
  terminal: ITerminalDocument
): Promise<PurchasePayload> {
  const parsedData = parsePurchaseTlv(data.iccData);
  const account = {
    "00": "Default",
    "10": "Savings",
    "20": "Current",
    "30": "Credit",
  }
  const panInfo = parseTrack2(data.track2)
  const {parsedParams} =  !terminal.usingGroupedTid ? terminal:terminal.groupTid
  return {
    tid: data.tid,
    mid: data.mid,
    sn: terminal.serialNo,
    account: account[data.accountType] ?? "Default",
    clrpin: !terminal.usingGroupedTid ? terminal.clrpinkey: terminal.groupTid.clrpinkey,
    pinblock: data.pinBlock,
    panseqno: parsedData.panSeqNum,
    amount: String(Number.parseInt(parsedData.amount)/100),
    aip: parsedData.aip,
    atc: parsedData.atc,
    cryptogram: parsedData.cryptogram,
    cip: parsedData.cryptogramInfoData,
    cvm: parsedData.cvm,
    iad: parsedData.issuerApplicationData,
    tvr: parsedData.terminalVerificationResult,
    capabilities: parsedData.terminalCapabilities,
    unpredictable: parsedData.unpredictableNumber,
    filename: parsedData.dedicatedFileName,
    pan: panInfo.pan,
    expirydate: panInfo.expiryDate,
    track: data.track2,
    stan: data.stan,
    rrn: data.rrn,
    totalamount: String(Number.parseInt(parsedData.amount)/100),
    field18: parsedParams?.mechantCategoryCode,
    field4: parsedData.amount,
    field22: data?.entryMode ?? "051",
    field23: parsedData.panSeqNum,
    field26: "06",
    field25: "00",
    field28: "D00000000",
    field11: data.stan,
    field55: data.iccData,
    field12: moment().format("HHmmss"),
    field13: parsedData.transactionDate.substring(0,4),
    field14: panInfo.expiryDate,
    field52: data.pinBlock,
    field42: data.mid,
    field43: parsedParams?.merchantNameLocation,
    field49: parsedParams?.currencyCode ?? "556",
    field40: panInfo.seviceRistricionCode,
    field41: data.tid,
    field128: "",
    field123: "510101511344101",
    field0: "0200",
    field32: panInfo.pan.substring(0,6),
    field37: data.rrn,
    field35: data.track2,
    field7: data.transDateTime,
    field3: `00${data.accountType??"00"}00`,
    field2: panInfo.pan,
    processor: data.processor
  };
}

export function parsePurchaseTlv(payload: string): ParsedTLv {
    const data = TlvFactory.parse(payload);
    const getVal = (key) =>
        data.find((item) => item.tag === key)?.value.toString('hex').toUpperCase() ?? ''
    ;
    return {
        aid: getVal('4F'),
        cryptogram: getVal('9F26'),
        cryptogramInfoData: getVal('9F27'),
        issuerApplicationData: getVal('9F10'),
        unpredictableNumber: getVal('9F37'),
        atc: getVal('9F36'),
        terminalVerificationResult: getVal('95'),
        transactionDate: getVal('9A'),
        transactionType: getVal('9C'),
        amountOther: getVal('9F03'),
        amount: getVal('9F02'),
        terminalCapabilities: getVal('9F33'),
        dedicatedFileName: getVal('84'),
        transSeqCounter: getVal('9F41'),
        panSeqNum: getVal('5F34')?.padStart(3,'0'),
        terminalCurrency: getVal('9F1A'),
        aip: getVal('82'),
        transType: getVal('9C'),
        cvm: getVal('9F34')
    };
}

export function getIccTags(payload: string): String[] {
  const data = TlvFactory.parse(payload);
  return  data.map((item) => item.tag);
}

export function parseTrack2(track2: string){
  const [pan, other] = track2.split("D")
  return {
    pan,
    expiryDate: other.substring(0, 4),
    seviceRistricionCode: other.substring(4,7)
  }
}

export async function translateSlimCardPayload (req,res, next){
  const serial = req.header("x-serial-no");
  const brand = req.header("x-brand");
  const deviceModel = req.header("x-device-model") || "";
  const terminal = await Terminal.findOne({
      serialNo: serial,
      deviceModel: deviceModel?.toUpperCase() || null,
      brand: brand?.toUpperCase() || null,
  })
  .populate({ path: "profile" })
  .populate({ path: "groupTid" })
  if(!terminal){
      return res.status(404).json({
          message:"Terminal not found"
      })
  }
  const repacked = await reparkPayLoad(
      req.body,
      'purchase',
      terminal,
  )
  req.body = repacked;
  //@ts-ignore
  req.terminal = terminal;
  next();
}
