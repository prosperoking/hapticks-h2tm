import { Schema, model, Document } from "mongoose";
import { paginate } from 'mongoose-paginate-v2';

export interface IPTSPProfileData {
    title: string,
    isoHost: string,
    isoPort: string,
    isSSL: boolean,
    componentKey1: string,
    componnentKey2: string,
    iswSwitchAmount: Number,
    terminals_count?: number,
}

export interface IPTSPProfile extends Document, IPTSPProfileData { }

const ptspProfileSchema = new Schema<IPTSPProfileData>({
    title: {
        type: String,
        unique: true,
    },
    isoHost: {
        type: String,
        unique: true,
    },
    isoPort: {
        type: String,
        unique: true,
    },
    isSSL: {
        type: Boolean,
        default: false,
    },
    componentKey1: {
        type: String,
        unique: true,
    },
    componentKey2: {
        type: String,
        unique: true,
    },
    iswSwitchAmount: {
        type: Number,
        default: null,
    },
}, {
    timestamps: true, toJSON: {
        virtuals: true
    }
})

ptspProfileSchema.virtual('terminals', {
    ref: 'terminal',
    localField: '_id',
    foreignField: 'profileId',
});

ptspProfileSchema.virtual('terminals_count', {
    ref: 'terminal',
    localField: '_id',
    foreignField: 'profileId',
    count: true,
});

// ptspProfileSchema.plugin(paginate);

const PTSPProfileModel = model<IPTSPProfile>("ptspProfile", ptspProfileSchema);
export default PTSPProfileModel