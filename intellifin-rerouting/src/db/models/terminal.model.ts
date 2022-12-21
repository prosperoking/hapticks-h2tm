import {Schema, model, SchemaTypes, ObjectId, PaginateModel} from "mongoose";
import PTSPProfileModel, { IPTSPProfile,  } from "./ptspProfile.model";
import OrganisationModel from './organisation.model';
import { OrganisationProfile } from './organisation.model';
import paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';

export interface ITerminal {
    _id?: string,
    serialNo: string,
    terminalId: string,
    clrmasterkey: string,
    encmasterkey: string,
    encsesskey: string,
    clrsesskey: string,
    encpinkey: string,
    clrpinkey: string,
    profileId: ObjectId,
    paramdownload: string,
    appVersion?: string,
    brand?: string,
    createdAt: Date,
    updatedAt: Date,
    profile?: IPTSPProfile,
    organisationId?: ObjectId,
    iswTid?: string,
    iswUniqueId?: string,
    parsedParams?: {
        callHomeTimeout: string,
        countryCode: string,
        currencyCode: string,
        exchangeTime: string,
        mechantCategoryCode: string,
        merchantNameLocation: string,
        mid: string,
        timeout: string,
    },
    deviceModel?: string,
    organisation?: OrganisationProfile,
}

export interface ITerminalDocument extends Document, ITerminal {}

const terminalSchema = new mongoose.Schema<ITerminal>({
    serialNo: {
        type: String,
        required: true,
        unique: true,
    },
    terminalId: {
        type: String,
        required: true,
        unique: true,
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
    profileId: {
        type: SchemaTypes.ObjectId,
        ref: PTSPProfileModel
    },
    organisationId: {
        type: SchemaTypes.ObjectId,
        ref: OrganisationModel,
    },
    brand: {
        type: String,
        default: null,
        set: (value: string)=> value.toUpperCase()
    },
    appVersion: {
        type: String,
        default: null,
        set: (value: string)=> value.toUpperCase()
    },
    deviceModel: {
        type: String,
        default: null,
        set: (value: string)=> value.toUpperCase()
    },
    iswTid: {
        type: String,
        unique: true,
        default: null,
        sparse: true,
        get: function(value){
          return value?.length ? value : this.terminalId
        },
        // set: function(value: string | null){
        //     return value.length?value: null;
        // }
    },
    iswUniqueId: {
        type: String,
        default: null,
        unique: true,
        sparse: true,
        get: function(value){
            return value?.length ? value : this.serialNo
        },
        // set: function(value: string | null){
        //    return value.length?value: null;
        // }
    },
},{
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true
    }
})


terminalSchema.virtual('profile',{
    ref: 'ptspProfile',
    localField: 'profileId',
    foreignField: '_id',
    justOne: true,
})

terminalSchema.virtual('organisation',{
    ref: 'organisationProfile',
    localField: 'organisationId',
    foreignField: '_id',
    justOne: true,
})

terminalSchema.virtual('parsedParams').get(function(){
    if(!this.paramdownload?.length) {
        return null;
    }

    const rawParam:string = this.paramdownload;
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

    let message:string = rawParam + '';
    let data = {}
    while(message.length){
        const tag = message.substr(0,2);
        const length = parseInt(message.substr(2,3));
        data = {...data, [tags[tag]]:message.substr(5,length)}
        message = message.substring(5+length, message.length)
    }
    return data;
});


terminalSchema.plugin(paginate)

const Termninal = mongoose.model<ITerminalDocument, PaginateModel<ITerminalDocument>>('terminal', terminalSchema);

export default Termninal;