import { Application, NextFunction } from "express";
import cookeParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import cookieSession from "cookie-session";
import passport, { use } from "passport";
import LocalStrategy from "passport-local";
import RememeberMeStrategy from "passport-remember-me";
import User from "../db/models/user.model";
import logger from "../helpers/logger";
import crypto from "crypto";
import argon2 from 'argon2';
import { IUserData } from '../db/models/user.model';
import {RequestHandler} from 'express';


passport.use(new LocalStrategy.Strategy(function (username, password, done) {
    User.findOne({
        $or: [
            { email: username },
            { username }
        ]
    }).then(async (user) => {
        if (!user) return done(null, false);
        
        if(! await argon2.verify(user.password, password)) {
            return done("Invalid password",null);
        }
        done(null, user)
    }).catch(err => {
        logger.error(err);
        done("An Error occured");
    })
}))


passport.use(new RememeberMeStrategy.Strategy(
    function (token, done) {
        User.findOne({ rememberToken: token }).populate('organisation')
            .then(user => {
                if (!user) return done(null, false);
                done(null,user);
            }).catch(err => done(err))
    },

    function (user, done) {
        const token = crypto.randomUUID();
        User.updateOne({ _id: user.id, }, { rememberToken: Buffer.from(token).toString('base64') })
            .then(() => {
                done(null, token);
            })
            .catch(err => done(err))
    }
));

passport.serializeUser(function (user: any, done) {
    done(null, {id: user.id});
});

passport.deserializeUser(function (user: any, done) {
    User.findById(user.id).then(user=>{
        if(!user) return done("Unknown User",);
        done(null, user);
    }).catch(e=>done(e))
});

export default function applyAuthSetup(app: Application) {

    app.use(cookeParser());
    app.use(cookieSession({
        name: 'h2tm',
        maxAge: 60 * 60 * 1000,
        secret: process.env.APP_SECRET
    }));
    // app.use(session({  }))
    app.use(passport.initialize());
    app.use(passport.session())
    app.use(passport.authenticate('remember-me'))

    app.post('/api/v1/login',
        passport.authenticate(
            'local',
            {
                session: true,
                failureMessage: "Incorrect credentials"
            }
        ),(err, req,res,next)=>{
            if(err) return res.status(422).json({message: err});
            next();
        }, (req, res) => {
            // 

            if (req.body.rember_me) {
                const token = crypto.randomUUID();
                const id: string = (req.user as any).id
                User.updateOne({ _id: id, }, { rememberToken: Buffer.from(token).toString('base64') }).exec()
            }
            const {username, email,fullname, role, permissions} = req.user as IUserData
            res.json({
                message: "Successful",
                user: {
                    username,
                    email,
                    fullname,
                    role,
                    permissions
                }
            })
        })
}

export const authMiddleware: (roles?:string[])=> RequestHandler = (roles:string[]=[]) => (req,res, next)=>{
    if(!req.user) {
        return res.status(401).json({
            message: "Not Authenticated"
        });
    }
    // Todo: handle permissions
    // @ts-ignore
    if(roles.length && !(roles || []).includes(req.user?.role)) {
        return res.status(403).json({
            message: "Your not authorized to view this page"
        });
    }
    next();
};