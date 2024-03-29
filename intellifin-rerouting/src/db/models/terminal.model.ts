import {Schema, model, SchemaTypes, ObjectId, PaginateModel} from "mongoose";
import PTSPProfileModel, { IPTSPProfile,  } from "./ptspProfile.model";
import OrganisationModel from './organisation.model';
import { OrganisationProfile } from './organisation.model';
import paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';
import csv from "mongoose-csv-export";

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
    threeLineTid?: string,
    threeLineParams?: {
        clrpinkey: string;
        clrMasterKey: string,
        encMasterKey: string,
        encSessionKey: string,
        clrSessionKey: string,
        encPinKey: string,
        clrPinKey: string,
        paramdownload: string,
    } | null
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
    threeLineParsedParams?:{
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
    threeLineTid: {
        type: String,
        unique: true,
        default: null,
        sparse: true,
    },
    threeLineParams: {
        type: Object,
        default: null
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

terminalSchema.virtual('threeLineParsedParams').get(function(){
    if(!this.threeLineParams?.paramdownload?.length) {
        return null;
    }

    const rawParam:string = this.threeLineParams.paramdownload;
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
})


terminalSchema.plugin(paginate)

terminalSchema.plugin(csv, {
    headers: ['SerialNo', 'TerminalId',  'IswTid', 'IswUniqueId', 'Brand', 'AppVersion', 'DeviceModel','ThreeLineTid'],
    alias: {
        'SerialNo': 'serialNo',
        'TerminalId': 'terminalId',
        'IswTid': 'iswTid',
        'IswUniqueId': 'iswUniqueId',
        'Brand': 'brand',
        'AppVersion': 'appVersion',
        'DeviceModel': 'deviceModel',
        'ThreeLineTid': 'threeLineTid'
    }
})

const Termninal = mongoose.model<ITerminalDocument, PaginateModel<ITerminalDocument>>('terminal', terminalSchema);

export default Termninal;