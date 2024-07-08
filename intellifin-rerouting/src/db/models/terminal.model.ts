import { Schema, model, SchemaTypes, ObjectId, PaginateModel } from "mongoose";
import PTSPProfileModel, { IPTSPProfile } from "./ptspProfile.model";
import OrganisationModel from "./organisation.model";
import { OrganisationProfile } from "./organisation.model";
import paginate from "mongoose-paginate-v2";
import * as mongoose from "mongoose";
import csv from "mongoose-csv-export";
import groupTidModel, {IGroupTid} from "./groupTid.model";
import { getAvailableTid } from "../../helpers/appUtils";

type TerminalLocation = {
  name: string;
  city: string;
  stateCountry: string;
  location: string | null;
};

export type ParsedParams = {
  paramdownload: string;
  mechantCategoryCode: string;
  merchantNameLocation: string;
  mid: string;
  currencyCode: string;
}


export interface ITerminal {
  _id?: string;
  serialNo: string;
  terminalId: string;
  terminalGroupId: ObjectId | null;
  clrmasterkey: string;
  encmasterkey: string;
  encsesskey: string;
  clrsesskey: string;
  encpinkey: string;
  clrpinkey: string;
  profileId: ObjectId;
  paramdownload: string;
  appVersion?: string;
  brand?: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: IPTSPProfile;
  organisationId?: ObjectId;
  iswTid?: string;
  customerAddress?: string;
  terminalLocation?: TerminalLocation;
  iswUniqueId?: string;
  threeLineTid?: string;
  usingGroupedTid: boolean,
  groupTid: IGroupTid,
  threeLineParams?: {
    clrpinkey: string;
    clrMasterKey: string;
    encMasterKey: string;
    encSessionKey: string;
    clrSessionKey: string;
    encPinKey: string;
    clrPinKey: string;
  };
  parsedParams?: ParsedParams;
  threeLineParsedParams?: ParsedParams;
  deviceModel?: string;
  organisation?: OrganisationProfile;
  hydrogenTID?: string;
  habariTID?: string;
  iswISOTID?: string;
  maxTransAmount: number;
}

export interface ITerminalDocument extends Document, ITerminal {}

const terminalLocation = new mongoose.Schema<TerminalLocation>({
  name: {
    default: null,
    type: String,
    maxlength: 22,
  },
  city: {
    default: null,
    type: String,
    maxlength: 12,
  },
  stateCountry: {
    default: null,
    type: String,
    maxlength: 4
  },
},{
    toJSON:{
        virtuals: true,
        getters: true,
    }
});

terminalLocation.virtual("location").get(function () {
  const values = [this.name, this.city, this.stateCountry];
  if (values.includes(null) || values.includes('')) return null;

  return `${this.name.padEnd(
    22,
    " "
  )}, ${this.city.padStart(12," ")}${this.stateCountry}`.substring(0,40);
});

const terminalSchema = new mongoose.Schema<ITerminal>(
  {
    serialNo: {
      type: String,
      required: true,
      unique: true,
    },
    terminalId: {
      type: String,
      required: false,
      index:{
        unique: true,
        partialFilterExpression: {
          terminalId: {$type: "string"}
        }
      },
      set: (value: string)=> value?.length? value: null,
    },
    clrmasterkey: {
      type: String,
      required: false,
      default: null,
    },
    encmasterkey: {
      type: String,
      required: false,
      default: null,
    },
    encsesskey: {
      type: String,
      required: false,
      default: null,
    },
    clrsesskey: {
      type: String,
      required: false,
      default: null,
    },
    encpinkey: {
      type: String,
      required: false,
      default: null,
    },
    clrpinkey: {
      type: String,
      required: false,
      default: null,
    },
    terminalLocation: {
        type: terminalLocation,
        default: ()=> null,
    },
    paramdownload: {
      type: String,
      required: false,
      default: null,
    },
    profileId: {
      type: SchemaTypes.ObjectId,
      ref: PTSPProfileModel,
      index: true,
    },
    terminalGroupId: {
      type: SchemaTypes.ObjectId,
      ref: groupTidModel,
      default: null,
    },
    organisationId: {
      type: SchemaTypes.ObjectId,
      ref: OrganisationModel,
      index: true,
    },
    brand: {
      type: String,
      default: null,
      set: (value: string) => value.toUpperCase(),
    },
    appVersion: {
      type: String,
      default: null,
      set: (value: string) => value.toUpperCase(),
    },
    deviceModel: {
      type: String,
      default: null,
      set: (value: string) => value.toUpperCase(),
    },
    iswTid: {
      type: String,
      default: null,
      index:{
        unique: true,
        partialFilterExpression: {
          iswTid: {$type: "string"}
        }
      },
      set: (value)=> value?.length? value: null,
      get: function (value) {
        return value?.length ? value : this.terminalId;
      },
      // set: function(value: string | null){
      //     return value.length?value: null;
      // }
    },
    iswUniqueId: {
      type: String,
      default: null,
      index:{
        unique: true,
        partialFilterExpression: {
          iswUniqueId: {$type: "string"}
        }
      },
      set: (value)=> value?.length? value: null,
      get: function (value) {
        return value?.length ? value : this.serialNo;
      },
      // set: function(value: string | null){
      //    return value.length?value: null;
      // }
    },
    threeLineTid: {
      type: String,
      default: null,
      index:{
        unique: true,
        partialFilterExpression: {
          threeLineTid: {$type: "string"}
        }
      },
      set: (value)=> value?.length? value: null
    },
    threeLineParams: {
      type: Object,
      default: null,
    },
    hydrogenTID: {
      type: String,
      default: null,
      index:{
        unique: true,
        partialFilterExpression: {
          hydrogenTID: {$type: "string"}
        }
      },
      set: (value)=> value?.length? value: null
    },
    habariTID: {
      type: String,
      default: null,
      index:{
        unique: true,
        partialFilterExpression: {
          habariTID: {$type: "string"}
        }
      },
      set: (value)=> value?.length? value: null
    },
    iswISOTID: {
      type: String,
      default: null,
      index:{
        unique: true,
        partialFilterExpression: {
          iswISOTID: {$type: "string"}
        }
      },
      set: (value)=> value?.length? value: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

terminalSchema.virtual("profile", {
  ref: "ptspProfile",
  localField: "profileId",
  foreignField: "_id",
  justOne: true,
});

terminalSchema.virtual("groupTid", {
  ref: "group_tids",
  localField: "terminalGroupId",
  foreignField: "_id",
  justOne: true,
});

terminalSchema.virtual("organisation", {
  ref: "organisationProfile",
  localField: "organisationId",
  foreignField: "_id",
  justOne: true,
});

terminalSchema.virtual("parsedParams").get(function () {
  if (!this.paramdownload?.length) {
    return null;
  }

  const rawParam: string = this.paramdownload;
  const tags = {
    "02": "exchangeTime",
    "03": "mid",
    "04": "timeout",
    "05": "currencyCode",
    "06": "countryCode",
    "07": "callHomeTimeout",
    "52": "merchantNameLocation",
    "08": "mechantCategoryCode",
  };

  let message: string = rawParam + "";
  let data:{[key:string]: string} = {};
  while (message.length) {
    const tag = message.substr(0, 2);
    const length = parseInt(message.substr(2, 3));
    data = { ...data, [tags[tag]]: message.substr(5, length) };
    message = message.substring(5 + length, message.length);
  }
  data.merchantCategoryCode = data.mechantCategoryCode;
  return data;
});

terminalSchema.virtual("threeLineParsedParams").get(function () {
  //@ts-ignore
  if (!this.threeLineParams?.paramdownload?.length) {
    return null;
  }
  //@ts-ignore
  const rawParam: string = this.threeLineParams.paramdownload;
  const tags = {
    "02": "exchangeTime",
    "03": "mid",
    "04": "timeout",
    "05": "currencyCode",
    "06": "countryCode",
    "07": "callHomeTimeout",
    "52": "merchantNameLocation",
    "08": "mechantCategoryCode",
  };

  let message: string = rawParam + "";
  let data:{[key:string]:string} = {};
  while (message.length) {
    const tag = message.substr(0, 2);
    const length = parseInt(message.substr(2, 3));
    data = { ...data, [tags[tag]]: message.substr(5, length) };
    message = message.substring(5 + length, message.length);
  }
  data.merchantCategoryCode = data.mechantCategoryCode;
  return data;
});

terminalSchema.virtual("customerAddress").get(function(){
  //@ts-ignore
  return this.terminalLocation?.location
});

terminalSchema.virtual("usingGroupedTid").get(function(){
  if(this.terminalId?.length) return false;

  if(!this.terminalGroupId) return false;

  return true;
})

terminalSchema.plugin(paginate);

terminalSchema.pre('save', async function(){
  if(!this.iswISOTID?.length) {
    const iswTid = await getAvailableTid(this.id, "isw")
    this.iswISOTID = iswTid?.tid;
  }
  if(!this.hydrogenTID?.length) {
    const hyTid = await getAvailableTid(this.id, "hydrogen");
    this.hydrogenTID = hyTid?.tid;
  }
})

terminalSchema.plugin(csv, {
  headers: [
    "SerialNo",
    "TerminalId",
    "IswTid",
    "IswUniqueId",
    "Brand",
    "AppVersion",
    "DeviceModel",
    "ThreeLineTid",
  ],
  alias: {
    SerialNo: "serialNo",
    TerminalId: "terminalId",
    IswTid: "iswTid",
    IswUniqueId: "iswUniqueId",
    Brand: "brand",
    AppVersion: "appVersion",
    DeviceModel: "deviceModel",
    ThreeLineTid: "threeLineTid",
  },
});

const Terminal = mongoose.model<
  ITerminalDocument,
  PaginateModel<ITerminalDocument>
>("terminal", terminalSchema);

export default Terminal;
