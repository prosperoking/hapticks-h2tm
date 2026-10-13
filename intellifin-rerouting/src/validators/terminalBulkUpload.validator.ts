import { createValidatedRequest } from "./index";
import { checkSchema } from "express-validator";
import Terminal from "../db/models/terminal.model";
import PTSPProfileModel from "../db/models/ptspProfile.model";
import OrganisationModel from "../db/models/organisation.model";
import isoStates from "../helpers/statesIso";

const terminalBulkUploadValidator = createValidatedRequest(
  checkSchema({
    organisationId: {
      in: ["body"],
      optional: true,
      custom: {
        options: async (value: string, { req, location, path }) => {
          try {
            if (!OrganisationModel.findById(value)) return Promise.reject();
            return true;
          } catch (error) {
            return false;
          }
        },
        errorMessage: "Organisation not Found",
        bail: true,
      },
    },
    profileId: {
      in: ["body"],
      custom: {
        options: async (value: string, { req, location, path }) => {
          try {
            if (!(await PTSPProfileModel.findById(value)))
              return Promise.reject();
            return true;
          } catch (error) {
            return false;
          }
        },
        errorMessage: "Profile not Found",
        bail: true,
      },
      notEmpty: true,
    },
    terminals: {
      isArray: {
        bail: true,
        options: {
          min: 1,
        },
      },
    },
    "terminals.*.terminalId": {
      in: ["body"],
      trim: true,
      notEmpty: true,
      isLength: {
        options: {
          max: 8,
          min: 8,
        },
      },
      customSanitizer: {
        options: (value) => value.length? value.toUpperCase(): null,
      },
      custom: {
        options: async (terminalId: string, { req, location, path }) => {
          try {
            const terminal = await Terminal.findOne({
              $and: [
                { terminalId: terminalId },
                { terminalId: { $type: "string" } },
              ]
            });
            if (terminal) return Promise.reject("Exists");
            return true;
          } catch (error) {
            return false;
          }
        },
        errorMessage: "Terminal Id already exists",
      },
    },
    "terminals.*.threeLineTid": {
      in: ["body"],
      trim: true,
      notEmpty: true,
      isLength: {
        options: {
          max: 8,
          min: 8,
        },
      },
      customSanitizer: {
        options: (value) => value.length? value.toUpperCase(): null,
      },
      custom: {
        options: async (threelineTid: string, { req, location, path }) => {
          if(!threelineTid.length) return true;
          try {
            const terminal = await Terminal.findOne({
              $and: [
                { threeLineTid: threelineTid },
                { threeLineTid: { $type: "string" } },
              ]
            });
            if (terminal) return Promise.reject("Exists");
          } catch (error) {
            return false;
          }
        },
        errorMessage: "ThreeLineTid already exists",
      },
    },

    "terminals.*.serialNo": {
      in: ["body"],
      trim: true,
      notEmpty: true,
      custom: {
        options: async (serialNo: string, { req, location, path }) => {
          try {
            const index = path.split(".")[0].split("[")[1].split("]")[0];
            const accData = req.body.terminals[index];
            const terminalSerial = await Terminal.findOne({
              serialNo,
              deviceModel: accData.deviceModel,
              brand: accData.brand,
            });

            if (terminalSerial) return Promise.reject("Exists");
            return true;
          } catch (error) {
            return false;
          }
        },
        errorMessage: "Terminal Exists",
      },
    },
    "terminals.*.brand": {
      in: ["body"],
      trim: true,
      notEmpty: true,
    },
    "terminals.*.deviceModel": {
      in: ["body"],
      trim: true,
      notEmpty: true,
    },
    "terminals.*.iswTid": {
      in: ["body"],
      trim: true,
      optional: true,
      customSanitizer: {
        options: (value) => value.length? value.toUpperCase(): null,
      },
      custom: {
        options: async (iswTid: string, { req, location, path, ...others }) => {
          if(!iswTid.length) return true;
          if (iswTid && await Terminal.findOne({
            $and:[
              { iswTid },
              { iswTid: { $type: "string" } },
            ]
           })) throw Error("Exists");
        },
        errorMessage: "Kimono already taken",
      },
    },
    "terminals.*.iswISOTID": {
      in: ["body"],
      trim: true,
      optional: true,
      customSanitizer: {
        options: (value) => value.length? value.toUpperCase(): null,
      },
      custom: {
        options: async (iswISOTID: string, { req, location, path }) => {
          if(!iswISOTID.length) return true;
          if (await Terminal.findOne({
            $and:[
              { iswISOTID },
              { iswISOTID: { $type: "string" } },
            ]
           })) throw Error("Exists");
        },
        errorMessage: "iswISOTID already taken",
      },
    },
    "terminals.*.hydrogenTID": {
      in: ["body"],
      trim: true,
      optional: true,
      customSanitizer: {
        options: (value) => value.length? value.toUpperCase(): null,
      },
      custom: {
        options: async (hydrogenTID: string, { req, location, path }) => {
          if (!hydrogenTID?.length) return true;
          if (await Terminal.findOne({
            $and:[
              { hydrogenTID },
              { hydrogenTID: { $type: "string" } },
            ]
           })) throw Error("Exists");
        },
        errorMessage: "hydrogenTID already taken",
      },
    },
    "terminals.*.zoneTID": {
      in: ["body"],
      trim: true,
      optional: true,
      customSanitizer: {
        options: (value) => value.length? value.toUpperCase(): null,
      },
      custom: {
        options: async (zoneTID: string, { req, location, path }) => {
          if(!zoneTID.length) return true;
          if (await Terminal.findOne({
            $and:[
              { zoneTID },
              { zoneTID: { $type: "string" } },
            ]
           })) throw Error("Exists");
        },
        errorMessage: "zoneTID already taken",
      },
    },
    "terminals.*.julianaTID": {
      in: ["body"],
      trim: true,
      optional: true,
      customSanitizer: {
        options: (value) => value.length? value.toUpperCase(): null,
      },
      custom: {
        options: async (julianaTID: string, { req, location, path }) => {
          if(!julianaTID.length) return true;
          if (await Terminal.findOne({
            $and:[
              { julianaTID },
              { julianaTID: { $type: "string" } },
            ]
           })) throw Error("Exists");
        },
        errorMessage: "julianaTID already taken",
      },
    },
    "terminals.*.iswUniqueId": {
      in: ["body"],
      trim: true,
      customSanitizer: {
        options: (value) => value.length? value.toUpperCase(): null,
      },
      custom: {
        options: async (iswUniqueId: string, { req, location, path }) => {
          if(!iswUniqueId?.length) return true;
          if (await Terminal.findOne({ iswUniqueId })) throw Error("Exists");
        },
        errorMessage: "Isw UniqueId  already taken",
      },
    },
    "terminals.*.address": {
      in: ["body"],
      trim: true,
      isLength: {
        options: {
          max: 26,
        },
      },
      custom: {
        options: async (address: string, { req, location, path }) => {
          if (address.length > 26) throw Error("Exists");
        },
        errorMessage: "Address too long",
      },
    },
    "terminals.*.city": {
      in: ["body"],
      trim: true,
    },
    "terminals.*.state": {
      in: ["body"],
      trim: true,
      isLength: {
        options: {
          max: 10,
        }
      },
      custom: {
        options: async (state: string, { req, location, path }) => {
          const states = isoStates.map(s=>s.code);
          if (!states.includes(state.toUpperCase())) return Promise.reject();
          return true;
        },
        errorMessage: "Invalid State",
      }
    },
  })
);

export default terminalBulkUploadValidator;
