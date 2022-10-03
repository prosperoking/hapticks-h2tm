// src/@types/express/index.d.ts

import { IUserData } from '../db/models/user.model';
export {}

declare global {
    declare namespace Express {
        export interface Request{
            user?: IUserData
        }
    }
}