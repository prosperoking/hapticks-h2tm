import { Schema, model, Document, PaginateModel } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import paginate from 'mongoose-paginate-v2';
import argon2 from 'argon2';
import * as mongoose from 'mongoose';

export interface OrganisationProfileData {
    name: String,
    apiKey: string,
    hasApiKey: boolean,
}

export interface OrganisationProfile extends Document, OrganisationProfileData { }

const orgSchema = new mongoose.Schema<OrganisationProfileData>({
    name: {
        type: String,
        unique: true,
        set: (value)=>String(value).toUpperCase(),
    },
    apiKey: {
        type: String,
        select: false,
        default: null,
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
})

orgSchema.virtual('hasApiKey').get(function(){
    return this.apiKey !== null;
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

orgSchema.virtual('users', {
    ref: 'user',
    localField: '_id',
    foreignField: 'organisationId',
});

orgSchema.virtual('users_count', {
    ref: 'user',
    localField: '_id',
    foreignField: 'organisationId',
    count: true,
});

orgSchema.virtual('transactions_count', {
    ref: 'journal',
    localField: '_id',
    foreignField: 'organisationId',
    count: true,
});

orgSchema.plugin(paginate);
orgSchema.plugin(uniqueValidator);


const OrganisationModel = mongoose.model<OrganisationProfile, PaginateModel<OrganisationProfile>>("organisationProfile", orgSchema);
export default OrganisationModel