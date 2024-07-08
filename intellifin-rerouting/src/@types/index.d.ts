// src/index.d.ts

import { IUserData } from '../db/models/user.model';
export {}

declare global {
    interface Request{
        user?: IUserData
    }
}