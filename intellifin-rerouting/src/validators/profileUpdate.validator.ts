import { createValidatedRequest } from './index';
import { checkSchema } from 'express-validator/src/middlewares/schema';
import PTSPProfileModel from '../db/models/ptspProfile.model';
import OrganisationModel from '../db/models/organisation.model';
import webhookModel from '../db/models/webhook.model';
import { body } from 'express-validator';

const profileUpdateValidator = createValidatedRequest(checkSchema({
    id: {
        in: ['params'],
        custom: {
            options: async (value: string, {req, location, path}) =>{
                try {
                    if(!PTSPProfileModel.findById(value)) return false;
                    return true;
                } catch (error) {
                    return false;
                }
            },
            errorMessage: "Terminal not Found"
        }
    },
    componentKey1: {
        in: ['body'],
        trim: true,
        optional: {
            options:{
                nullable: true
            }
        },
    },
    isoHost: {
        in: ['body'],
        trim: true,
        customSanitizer: {
            options: (value: string) => {
                if(!value?.length) return null;
                return value;
            }
        },
        optional:{
            options:{
                nullable: true,
            }
        },
        isIP: true,
    },
    isoPort: {
        in: ['body'],
        trim: true,
        customSanitizer: {
            options: (value: string) => {
                console.log("Port: ", value)
                if(!value?.length) return null;
                return parseInt(value);
            }
        },
        optional:{
            options:{
                nullable: true,
            }
        },
        isPort: true,
    },
    allowProcessorOverride: {
        in: ['body'],
        isBoolean: true,
        customSanitizer: {
            options:
                value => ['true','false','1','0'].includes(String(value)
                            .toLowerCase())
        },
        optional:{
            options:{
                nullable: true,
            }
        },
    },
    isSSl: {
        in: ['body'],
        toBoolean: true,
        optional:{
            options:{
                nullable: true,
            }
        },
    },
    iswDestinationAccount: {
        in: ['body'],
        trim: true,
        optional: true,
    },
    iswInstitutionCode: {
        in: ['body'],
        trim: true,
        optional: true,
    },
    iswMid: {
        in: ['body'],
        trim: true,
        optional: true,
        isLength: {
            errorMessage: "invalid MID",
            if: (value)=>value?.length,
            options:{
                min: 15,
                max: 15
            }
        }
    },
    iswSwitchAmount: {
        in: ['body'],
        trim: true,
    },
    title: {
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
    type: {
        in: ['body'],
        matches: {
            options: [/\b(?:generic|intelliffin|3line)\b/],
            errorMessage: "Invalid Profile type"
        }
    },
    webhookId: {
        in: ['body'],
        optional: true,
        custom: {
            options: async (value: string, {req, location, path}) =>{
                if(!value?.length) return;
                if(!await webhookModel.findById(value)) return Promise.reject();
            },
            errorMessage: "Webhook not found",
            bail: true,
        }
    },
    iswISOConfig: {
        in: ['body'],
        optional: {
            options: {
                nullable: false
            }
        },
        isObject: {
            options: {
                strict: false,
            }
        }
    },
    "iswISOConfig.host":{
        in: ["body"],
        isIP: {
            if: body("iswISOConfig").exists({ checkNull: false })
        },
        exists: {
            if: body("iswISOConfig").exists({ checkNull: false })
        }
    },
    "iswISOConfig.zmk":{
        exists: {
            if: body("iswISOConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isString: true,

    },
    "iswISOConfig.port":{
        exists: {
            if: body("iswISOConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isNumeric: true,
    },
    "iswISOConfig.mcc":{
        exists: {
            if: body("iswISOConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isNumeric: true,
    },
    "iswISOConfig.mid":{
        exists: {
            if: body("iswISOConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isString: true,
    },
    "iswISOConfig.rid":{
        exists: {
            if: body("iswISOConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isString: true,
    },
    "iswISOConfig.oRid":{
        exists: {
            if: body("iswISOConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isString: true,
    },
    hydrogenConfig: {
        in: ['body'],
        optional: {
            options: {
                nullable: true,
            }
        },
        isObject: {
            options: {
                strict: false,
            }
        }
    },
    "hydrogenConfig.host":{
        exists: {
            if: body("hydrogenConfig").exists({ checkNull: false })
        },
        in: ["body"],

    },
    "hydrogenConfig.zmk":{
        exists: {
            if: body("hydrogenConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isString: true
    },
    "hydrogenConfig.port":{
        exists: {
            if: body("hydrogenConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isNumeric: true,
    },
    "hydrogenConfig.mcc":{
        exists: {
            if: body("hydrogenConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isNumeric: true,
    },
    "hydrogenConfig.mid":{
        exists: {
            if: body("hydrogenConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isString: true,
    },
    habariConfig: {
        in: ['body'],
        optional: {
            options: {
                nullable: true,
            }
        },
        isObject: {
            options: {
                strict: false,
            }
        }
    },
    "habariConfig.host":{
        exists: {
            if: body("habariConfig").exists({ checkNull: false })
        },
        in: ["body"],

    },
    "habariConfig.zmk":{
        exists: {
            if: body("habariConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isString: true
    },
    "habariConfig.port":{
        exists: {
            if: body("habariConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isNumeric: true,
    },
    "habariConfig.mcc":{
        exists: {
            if: body("habariConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isNumeric: true,
    },
    "habariConfig.mid":{
        exists: {
            if: body("habariConfig").exists({ checkNull: false })
        },
        in: ["body"],
        isString: true,
    },
    "processorSettings.*.processor":{
        in: ['body'],
        custom: {
            options: async (value: string, {req, location, path}) =>{
                return ['nibss','kimono','blueSalt'].includes(value);
            }
        }
    },
    "processorSettings.*.minAmount":{
        in: ['body'],
        isNumeric: true,
        exists: true,
    },
    "processorSettings.*.maxAmount":{
        in: ['body'],
        isNumeric: true,
        exists: true,
    }
}),);

export default profileUpdateValidator;