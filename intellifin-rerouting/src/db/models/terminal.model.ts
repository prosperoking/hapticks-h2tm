import {Schema, model, SchemaTypes, ObjectId} from "mongoose";
import PTSPProfileModel, { IPTSPProfile,  } from "./ptspProfile.model";

export interface ITerminal {
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
}


const terminalSchema = new Schema<ITerminal>({
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
    brand: {
        type: String,
        default: null,
    },
    appVersion: {
        type: String,
        default: null
    },
    deviceModel: {
        type: String,
        default: null,
    }
},{
    timestamps: true,
    toJSON: {
        virtuals: true
    }
})


terminalSchema.virtual('profile',{
    ref: 'ptspProfile',
    localField: 'profileId',
    foreignField: '_id',
    justOne: true,
})

terminalSchema.virtual('parsedParams').get(function(){
    console.log(this)
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

const Termninal = model<ITerminal>('terminal', terminalSchema);

export default Termninal;