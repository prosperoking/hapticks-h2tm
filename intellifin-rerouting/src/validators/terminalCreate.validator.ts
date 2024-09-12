import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import Terminal from '../db/models/terminal.model';
import OrganisationModel from '../db/models/organisation.model';
import PTSPProfileModel from '../db/models/ptspProfile.model';
import { body } from 'express-validator';
import groupTidModel from '../db/models/groupTid.model';

const terminalCreateValidator = createValidatedRequest(checkSchema({
    terminalId: {
        in: ['body'],
        trim: true,
        custom: {
            options: async (terminalId: string, {req, location, path}) =>{
                try {
                    if(
                        ! await Terminal.findOne({terminalId: terminalId}) &&
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
                if(await Terminal.findOne({serialNo})) return Promise.reject();
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
                if(!value?.length) return;

                if(! await OrganisationModel.findById(value)) return Promise.reject();
            },
            errorMessage: "Organisation not Found",
            bail: true,
        }
    },
    groupTidId: {
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
    profileId: {
        in: ['body'],
        notEmpty: true,
        custom: {
            options: async (value: string, {req, location, path}) =>{
                if(! await PTSPProfileModel.findById(value)) return Promise.reject();
            },
            errorMessage: "Profile not Found",
            bail: true,
        },
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
    maxTransAmount: {
        in: ["body"],
        isNumeric: {
            bail:true,

        },
        optional: true,
        errorMessage:"Invalid Max Transaction Amount",
        toInt: true
    }
}),);

export default terminalCreateValidator;