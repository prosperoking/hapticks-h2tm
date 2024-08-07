import { createValidatedRequest } from "./index";
import { checkSchema } from "express-validator/src/middlewares/schema";
import Terminal from "../db/models/terminal.model";
import PTSPProfileModel from "../db/models/ptspProfile.model";
import OrganisationModel from "../db/models/organisation.model";

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
      custom: {
        options: async (terminalId: string, { req, location, path }) => {
          try {
            const terminal = await Terminal.findOne({
              terminalId: terminalId,
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
    "terminals.*.threelineTid": {
      in: ["body"],
      trim: true,
      notEmpty: true,
      isLength: {
        options: {
          max: 8,
          min: 8,
        },
      },
      custom: {
        options: async (threelineTid: string, { req, location, path }) => {
          try {
            const terminal = await Terminal.findOne({
              threelineTid: threelineTid,
            });
            if (terminal) return Promise.reject("Exists");
            return true;
          } catch (error) {
            return false;
          }
        },
        errorMessage: "threelineTid already exists",
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
      custom: {
        options: async (iswTid: string, { req, location, path }) => {
          if (await Terminal.findOne({ iswTid })) throw Error("Exists");
        },
        errorMessage: "IswTid alread taken",
      },
    },
    "terminals.*.iswISOTID": {
      in: ["body"],
      trim: true,
      custom: {
        options: async (iswISOTID: string, { req, location, path }) => {
          if (await Terminal.findOne({ iswISOTID })) throw Error("Exists");
        },
        errorMessage: "iswISOTID alread taken",
      },
    },
    "terminals.*.hydrogenTID": {
      in: ["body"],
      trim: true,
      custom: {
        options: async (hydrogenTID: string, { req, location, path }) => {
          if (await Terminal.findOne({ hydrogenTID })) throw Error("Exists");
        },
        errorMessage: "hydrogenTID alread taken",
      },
    },
    "terminals.*.iswUniqueId": {
      in: ["body"],
      trim: true,
      custom: {
        options: async (iswUniqueId: string, { req, location, path }) => {
          if (await Terminal.findOne({ iswUniqueId })) throw Error("Exists");
        },
        errorMessage: "Isw UniqueId taken",
      },
    },
  })
);

export default terminalBulkUploadValidator;
