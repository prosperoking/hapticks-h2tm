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
    type: 'generic' | 'intelliffin' | '3line' | 'bluesalt',
    allowProcessorOverride: boolean,
    iswInstitutionCode?: string,
    iswDestinationAccount?: string,
    organisationId?: string | any,
    linkedProfileId: mongoose.ObjectId | null,
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
    hydrogenEnabled: boolean,
    habariEnabled: boolean,
    iswISOEnabled: boolean,
    linkedProfile?: IPTSPProfileData,
    iswISOConfig?: {
        zmk: string,
        host: string,
        port: number,
        ssl: boolean,
        zpk: string | null,
        lastRotate: Date | null,
        mid: string,
        ett: string,
        mcc: string,
        rid: string,
        oRid: string,
        settlementAccount: string
        kcv: string | null,
    }
    hydrogenConfig?: {
        zmk: string,
        host: string,
        port: number,
        ssl: boolean,
        zpk: string | null,
        kcv: string | null
        lastRotate: Date | null,
        mcc: string,
        mid: string,
        acqId: string,
        tidPrefix: string,
    },
    habariConfig?: {
        zmk: string,
        host: string,
        port: number,
        ssl: boolean,
        zpk: string | null,
        kcv: string | null
        lastRotate: Date | null,
        mcc: string,
        mid: string,
        acqId: string,
        tidPrefix: string,
    },
    processorSettings?: {
        minAmount: number,
        maxAmount: number,
        processor: 'nibss' | 'kimono' | 'bluesalt' | '3line' | 'isw' | 'hydrogen' | 'habari',
    }[],
    isLinked: boolean,
}

export interface IPTSPProfile extends Document, IPTSPProfileData { }

const ptspProfileSchema = new mongoose.Schema<IPTSPProfileData>({
    title: {
        type: String,
        unique: true,
        required: true,
        set: (value: string)=>value.toUpperCase()
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
    iswISOConfig: {
        zmk: {
            type: String,
            set: (value: string)=> (value !== null && value?.length) ? encrypt(value) : null,
            get: (value: string)=> (value !== null && value?.length) ? decrypt(value) : null,
        },
        host: {
            type: String,
        },
        port: {
            type: Number,
        },
        ssl: {
            type: Boolean,
        },
        zpk: {
            type: String,
            default: null,
            set: (value: string)=> (value !== null && value?.length) ? encrypt(value) : null,
            get: (value: string)=> (value !== null && value?.length) ? decrypt(value) : null,
        },
        lastRotate: {
            type: Date,
            default: null
        },
        mid: {
            type: String,
        },
        ett: {
            type: String,
        },
        mcc: {
            type: String,
        },
        kcv:{
            type: String,
            default: null,
        },
        rid: {
            type: String,
            default: null,
            set: (value: string)=> (value !== null && value?.length) ? encrypt(value) : null,
            get: (value: string)=> (value !== null && value?.length) ? decrypt(value) : null,
        },
        oRid: {
            type: String,
            default: null,
            set: (value: string)=> (value !== null && value?.length) ? encrypt(value) : null,
            get: (value: string)=> (value !== null && value?.length) ? decrypt(value) : null,
        },
        settlementAccount: {
            type: String,
            default: null,
            set: (value: string)=> (value !== null && value?.length) ? encrypt(value) : null,
            get: (value: string)=> (value !== null && value?.length) ? decrypt(value) : null,
        },
        tidPrefix: {
            type: String,
            default: null,
            maxlength: 4,
            minlength: 4
        },
    },
    hydrogenConfig: {
        zmk: {
            type: String,
            set: (value: string)=> (value !== null && value?.length) ? encrypt(value) : null,
            get: (value: string)=> (value !== null && value?.length) ? decrypt(value) : null,
        },
        host: {
            type: String,
        },
        port: {
            type: Number,
        },
        ssl: {
            type: Boolean,
        },
        zpk: {
            type: String,
            default: null,
            set: (value: string)=> (value !== null && value?.length) ? encrypt(value) : null,
            get: (value: string)=> (value !== null && value?.length) ? decrypt(value) : null,
        },
        kcv:{
            type: String,
            default: null,
        },
        lastRotate: {
            type: Date,
            default: null
        },
        mid: {
            type: String,
        },
        mcc: {
            type: Number,
        },
        acqId: {
            type: String,
        },
        tidPrefix: {
            type: String,
            default: null,
            maxlength: 4,
            minlength: 4
        },
    },
    habariConfig: {
        zmk: {
            type: String,
            set: (value: string)=> (value !== null && value?.length) ? encrypt(value) : null,
            get: (value: string)=> (value !== null && value?.length) ? decrypt(value) : null,
        },
        host: {
            type: String,
        },
        port: {
            type: Number,
        },
        ssl: {
            type: Boolean,
        },
        zpk: {
            type: String,
            default: null,
            set: (value: string)=> (value !== null && value?.length) ? encrypt(value) : null,
            get: (value: string)=> (value !== null && value?.length) ? decrypt(value) : null,
        },
        kcv:{
            type: String,
            default: null,
        },
        lastRotate: {
            type: Date,
            default: null
        },
        mid: {
            type: String,
        },
        mcc: {
            type: Number,
        },
        acqId: {
            type: String,
        },
        tidPrefix: {
            type: String,
            default: null,
            maxlength: 4,
            minlength: 4
        },
    },
    processorSettings: [SchemaTypes.Mixed],
    linkedProfileId: {
        type: SchemaTypes.ObjectId,
        default: null
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true,
    },
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

ptspProfileSchema.virtual('linkedProfile', {
    ref: 'ptspProfile',
    localField: 'linkedProfileId',
    foreignField: '_id',
    justOne: true,
});

ptspProfileSchema.virtual('iswISOEnabled').get(function(){
    return this.iswISOConfig?.host?.length > 0
})

ptspProfileSchema.virtual('hydrogenEnabled').get(function(){
    return this.hydrogenConfig?.host?.length > 0
})

ptspProfileSchema.virtual('habariEnabled').get(function(){
    return this.habariConfig?.host?.length > 0
})

ptspProfileSchema.virtual('isLinked').get(function(){
    return this.linkedProfileId !== null
})


ptspProfileSchema.virtual('blueSaltUrl').get(function(){
    return this.blueSaltEnv === 'staging' ? 'https://dev-wallets.bluesalt.net' : undefined;
})

// @ts-ignore
ptspProfileSchema.plugin(paginate);

const PTSPProfileModel = mongoose.model<IPTSPProfile, PaginateModel<IPTSPProfile>>("ptspProfile", ptspProfileSchema);
export default PTSPProfileModel