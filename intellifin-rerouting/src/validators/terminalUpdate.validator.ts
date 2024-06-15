import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import Terminal from '../db/models/terminal.model';
import PTSPProfileModel from '../db/models/ptspProfile.model';
import OrganisationModel from '../db/models/organisation.model';
import { body } from 'express-validator';
import groupTidModel from '../db/models/groupTid.model';

const terminalUpdateValidator = createValidatedRequest(checkSchema({
    id: {
        in: ['params'],
        custom: {
            options: async (value: string, {req, location, path}) =>{
                try {
                    if(! await Terminal.findById(value)) return Promise.reject();
                    return true;
                } catch (error) {
                    return false;
                }
            },
            errorMessage: "Terminal not Found",
            bail: true,
        }
    },
    terminalId: {
        in: ['body'],
        trim: true,
        custom: {
            options: async (terminalId: string, {req, location, path}) =>{
                try {
                    if(
                        ! await Terminal.findOne({terminalId: terminalId, _id: {$ne: req.body._id}}) &&
                        ! req.body.terminalGroupId?.length
                    ) return false;
                    return true;
                } catch (error) {
                    return false;
                }
            },
            errorMessage: "Invalid/Existing Terminal ID",
        }
    },
    terminalGroupId: {
        in: ['body'],
        optional: true,
        custom: {
            options: async (value: string, {req, location, path}) =>{
                if(!value?.length) return;

                if(! await groupTidModel.findById(value)) return Promise.reject();
            },
            errorMessage: "Group Tid not Found",
            bail: true,
        }
    },
    serialNo: {
        in: ['body'],
        trim: true,
        notEmpty: true,
        custom: {
            options: async (serialNo: string, {req, location, path}) =>{
                try {
                    if(await Terminal.findOne({serialNo})) return false;
                    return true;
                } catch (error) {
                    return false;
                }
            },
            errorMessage: "Terminal not Found",
        }
    },
    brand: {
        in: ['body'],
        trim: true,
        notEmpty: true
    },
    deviceModel: {
        in: ['body'],
        trim: true,
        notEmpty: true
    },
    iswTid: {
        in: ['body'],
        trim: true,
    },
    hydrogenTID: {
        in: ['body'],
        trim: true,
    },
    habariTID: {
        in: ['body'],
        trim: true,
    },
    iswISOTID:{
        in: ['body'],
        trim: true,
    },
    organisationId: {
        in: ['body'],
        optional: true,
        custom: {
            options: async (value: string, {req, location, path}) =>{
                try {
                    if(value === null) return Promise.resolve();
                    if(value.length && ! await OrganisationModel.findById(value)) return Promise.reject();
                    return true;
                } catch (error) {
                    return Promise.reject();
                }
            },
            errorMessage: "Organisation not Found",
            bail: true,
        }
    },
    profileId: {
        in: ['body'],
        custom: {
            options: async (value: string, {req, location, path}) =>{
                try {
                    console.log("Param ID: ",value,)
                    if(! await PTSPProfileModel.findById(value)) return Promise.reject();
                    return true;
                } catch (error) {
                    return Promise.reject();
                }
            },
            errorMessage: "Profile not Found",
            bail: true,
        },
        notEmpty: true
    },
    terminalLocation: {
        in: ['body'],
        isObject: true,
    },
    "terminalLocation.name": {
        in: ["body"],
        exists: {
            if: body("terminalLocation").exists({ checkNull: false })
        },
        trim:true,
        toUpperCase: true,
        isLength:{
            if: (value)=> value.length,
            errorMessage:  "Name must be less than or equal to  22",
            options:{
                max: 22,
                min: 3
            }
        }
    },
    "terminalLocation.city": {
        in: ["body"],
        exists: {
            if: body("terminalLocation").exists({ checkNull: false })
        },
        trim:true,
        toUpperCase: true,
        isLength:{
            if: (value)=> value.length,
            errorMessage:  "City must be less than or equal to  12",
            options:{
                max: 12,
                min: 3
            }
        }
    },
    "terminalLocation.stateCountry": {
        in: ["body"],
        exists: {
            if: body("terminalLocation").exists({ checkNull: false })
        },
        trim:true,
        toUpperCase:  true,
        isLength:{
            if: (value)=> value.length,
            errorMessage:  "State/Country must be exactly of length 4",
            options:{
                max: 4,
                min: 4,
            }
        }
    },
}),);

export default terminalUpdateValidator;