import { Schema, model, SchemaTypes } from "mongoose";
import { OrganisationProfile } from './organisation.model';
import OrganisationModel from './organisation.model';
import argon2 from 'argon2';
import crypto from "crypto"

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

export interface IUserData extends Document {
    _id?:string,
    id?:string,
    username: string,
    email: string,
    password: string,
    fullname: string,
    rememberToken?: string,
    organisation_id?: OrganisationProfile,
    role: string,
    imageUrl?: string,
    permissions: string[],
    createdAt: string,
    updatedAt: string,
}


const UserSchema = new Schema<IUserData>({
    username: {
        unique: true,
        type: String,
        required: true,
    },
    email: {
        unique: true,
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,

    },
    rememberToken: {
        type: String,
        default: null,
    },
    organisation_id: {
        default: null,
        type: SchemaTypes.ObjectId,
        ref: OrganisationModel
    },
    role: {
        type: SchemaTypes.String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    permissions: {
        type: [SchemaTypes.String],
        default: []
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: ['organisation','imageUrl']
    }
});

UserSchema.virtual('organisation', {
    localField: 'organisation_id',
    foreignField: '_id',
    ref: 'organisation',
    justOne: true,
});

UserSchema.virtual('imageUrl').get(function(){
    const hashedEmail = crypto.createHash('md5').update(this.email).digest("hex");
    return "https://www.gravatar.com/avatar/"+hashedEmail;
});

UserSchema.pre("save", async function () {
    this.password = await argon2.hash(this.password);
})

const User = model<IUserData>('user', UserSchema);

export default User;