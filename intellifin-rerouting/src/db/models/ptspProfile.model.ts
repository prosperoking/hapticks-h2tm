import { Schema, model, Document, SchemaTypes, PaginateModel } from "mongoose";
import paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';
import { decrypt, encrypt } from '../../helpers/crypt';
export interface IPTSPProfileData {
    title: string,
    isoHost: string,
    isoPort: string,
    isSSL: boolean,
    componentKey1: string,
    componentKey2: string,
    iswSwitchAmount: Number,
    terminals_count?: number,
    iswMid?: string,
    type: 'generic' | 'intelliffin',
    allowProcessorOverride: boolean,
    iswInstitutionCode?: string,
    iswDestinationAccount?: string,
    organisationId?: string | any,
    threeLineKey?: string,
    threeLineHost?: string,
    threeLinePort?: string,
    threeLineHostSSL?: boolean,
    hasthreelineSupport: boolean,
    webhookId?: string | any,
    isInteliffin: boolean,
    blueSaltTID: string | null,
    blueSaltKey: string | null,
    blueSaltEnv: "staging" | "live"  | null,
    processorSettings?: {
        minAmount: number,
        maxAmount: number,
        processor: 'nibss' | 'kimono' | 'bluesalt' | '3line',
    }[]
}

export interface IPTSPProfile extends Document, IPTSPProfileData { }

const ptspProfileSchema = new mongoose.Schema<IPTSPProfileData>({
    title: {
        type: String,
        unique: true,
    },
    isoHost: {
        type: String,
        default: null,
    },
    isoPort: {
        type: String,
        default: null,
    },
    isSSL: {
        type: Boolean,
        default: false,
    },
    componentKey1: {
        type: String,
        default: null
    },
    componentKey2: {
        type: String,
        default: null,
    },
    iswSwitchAmount: {
        type: Number,
        default: null,
    },
    iswMid: {
        type: String,
        default: null,
    },
    iswInstitutionCode: {
        type: String,
        default: null,
    },
    iswDestinationAccount: {
        type: String,
        default: null,
    },
    allowProcessorOverride: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'generic',
    },
    organisationId: {
        type: SchemaTypes.ObjectId,
        default: null,
    },
    threeLineKey: {
        type: String,
        default: null,
    },
    threeLineHost: {
        type: String,
        default: null,
    },
    threeLinePort: {
        type: String,
        default: null,
    },
    threeLineHostSSL:{
        type: Boolean,
        default: null,
    },
    hasthreelineSupport:{
        type: Boolean,
        default: false,
    },
    webhookId: {
        type: SchemaTypes.ObjectId,
        default: null,
    },
    blueSaltTID: {
        type: String,
        default: null,
    },
    blueSaltKey: {
        type: String,
        default: null,
        set: (value: string)=> (value !== null && value?.length) ? encrypt(value) : null,
        get: (value: string)=> (value !== null && value?.length) ? decrypt(value) : null,
    },
    blueSaltEnv: {
        type: String,
        default: null,
    },
    processorSettings: [SchemaTypes.Mixed]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true,
    }
})

ptspProfileSchema.virtual('terminals', {
    ref: 'terminal',
    localField: '_id',
    foreignField: 'profileId',
});

ptspProfileSchema.virtual('isInteliffin').get(function(){
    return this.type === 'intelliffin';
})

ptspProfileSchema.virtual('organisation', {
    ref: 'organisationProfile',
    localField: 'organisationId',
    foreignField: '_id',
    justOne: true,
});

ptspProfileSchema.virtual('terminals_count', {
    ref: 'terminal',
    localField: '_id',
    foreignField: 'profileId',
    count: true,
});

ptspProfileSchema.virtual('webhook', {
    ref: 'webhooklistener',
    localField: 'webhookId',
    foreignField: '_id',
    justOne: true,
});

ptspProfileSchema.virtual('blueSaltUrl').get(function(){
    return this.blueSaltEnv === 'staging' ? 'https://dev-wallets.bluesalt.net' : undefined;
})

// @ts-ignore
ptspProfileSchema.plugin(paginate);

const PTSPProfileModel = mongoose.model<IPTSPProfile, PaginateModel<IPTSPProfile>>("ptspProfile", ptspProfileSchema);
export default PTSPProfileModel