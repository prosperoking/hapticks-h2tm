import mongoose, { ObjectId, PaginateModel,SchemaTypes } from "mongoose";
import paginate from "mongoose-paginate-v2";
import PTSPProfileModel, { IPTSPProfile } from "./ptspProfile.model";
import OrganisationModel, { OrganisationProfile } from "./organisation.model";
import { ParsedParams } from "./terminal.model";

export type IGroupTid = {
    id?: string,
    terminalId: string,
    profileId: ObjectId,
    profile: IPTSPProfile,
    encmasterkey: string,
    encpinkey: string,
    encsesskey: string,
    clrmasterkey: string,
    clrsesskey: string,
    clrpinkey: string,
    paramdownload: string,
    parsedParams: ParsedParams,
    organisationId?: ObjectId,
    organisation?: OrganisationProfile,
 }

 const groupTidSchema = new mongoose.Schema<IGroupTid>({
     terminalId : {
        type: String,
        required: true,
        unique: true,
        sparse: true,
      },
     profileId  : {
        type: SchemaTypes.ObjectId,
        ref: PTSPProfileModel,
      },
     organisationId: {
        type: SchemaTypes.ObjectId,
        ref: OrganisationModel,
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
      paramdownload: {
        type: String,
        required: false,
        default: null,
      },
 },{
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
    },
  });

groupTidSchema.virtual("profile", {
    ref: "ptspProfile",
    localField: "profileId",
    foreignField: "_id",
    justOne: true,
});

groupTidSchema.virtual("organisation", {
    ref: "organisationProfile",
    localField: "organisationId",
    foreignField: "_id",
    justOne: true,
});

groupTidSchema.virtual("parsedParams").get(function () {
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
    let data = {};
    while (message.length) {
      const tag = message.substr(0, 2);
      const length = parseInt(message.substr(2, 3));
      data = { ...data, [tags[tag]]: message.substr(5, length) };
      message = message.substring(5 + length, message.length);
    }
    return data;
});

groupTidSchema.plugin(paginate);



 export default mongoose.model<IGroupTid, PaginateModel<IGroupTid>>("group_tids", groupTidSchema);