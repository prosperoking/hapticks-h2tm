import { Schema, model, Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import paginate from 'mongoose-paginate-v2';

export interface OrganisationProfileData {
    name: string,
}

export interface OrganisationProfile extends Document, OrganisationProfileData { }

const orgSchema = new Schema<OrganisationProfileData>({
    name: {
        type: String,
        unique: true,
        set: (value)=>String(value).toUpperCase(),
    },
}, {
    timestamps: true, toJSON: {
        virtuals: true
    }
})

orgSchema.virtual('terminals', {
    ref: 'terminal',
    localField: '_id',
    foreignField: 'organisationId',
});

orgSchema.virtual('terminals_count', {
    ref: 'terminal',
    localField: '_id',
    foreignField: 'organisationId',
    count: true,
});

orgSchema.plugin(paginate);
orgSchema.plugin(uniqueValidator);


const OrganisationModel = model<OrganisationProfile>("organisaionProfile", orgSchema);
export default OrganisationModel