// src/index.d.ts

import { IUserData } from '../db/models/user.model';
export {}

declare global {
    interface Request{
        user?: IUserData
    }
}


export type ZoneBinsResponse = {
    message: string,
    status: boolean,
    data: {
        bankCode: string,
        cardProfiles: {
            cardPrefix: string,
            bankCode: string,
            shortName: string,
            cardScheme: string,
        }[]
    }[]
}