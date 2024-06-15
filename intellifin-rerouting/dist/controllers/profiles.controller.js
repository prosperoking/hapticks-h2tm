"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ptspProfile_model_1 = __importDefault(require("../db/models/ptspProfile.model"));
const lodash_1 = require("lodash");
const cardsockethelper_1 = require("../helpers/cardsockethelper");
const terminal_model_1 = __importDefault(require("../db/models/terminal.model"));
class ProfileController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(request.body);
                const data = yield ptspProfile_model_1.default.create(request.body);
                response.json({ status: true, data });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { q, limit, page } = request.query;
                let filter = {};
                if (q === null || q === void 0 ? void 0 : q.length) {
                    filter = {
                        $or: [
                            { title: RegExp(`^${q}`, 'i') },
                            { isoHost: RegExp(`^${q}`, 'i') },
                            { type: RegExp(`^${q}`, 'i') },
                        ]
                    };
                }
                ;
                const data = yield ptspProfile_model_1.default.paginate(filter, {
                    limit: Number.parseInt(`${limit}`) || 30,
                    page: Number.parseInt(`${page}`) || 1,
                    populate: [
                        { path: 'terminals_count' },
                        { path: 'organisation', select: 'name' },
                        { path: 'webhook', select: 'name' },
                    ],
                });
                response.json(data);
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    edit(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield ptspProfile_model_1.default.findById((_a = request.params) === null || _a === void 0 ? void 0 : _a.id);
                if (!profile)
                    return response.status(404).json({ message: "Profile not found" });
                let { body } = request;
                body.iswISOConfig = body.iswISOConfig === undefined ? null : body.iswISOConfig;
                body.hydrogenConfig = body.hydrogenConfig === undefined ? null : body.hydrogenConfig;
                body.habariConfig = body.habariConfig === undefined ? null : body.habariConfig;
                const data = yield profile.update((0, lodash_1.pick)(body, [
                    "title",
                    "isoHost",
                    "isoPort",
                    "isSSL",
                    "type",
                    "componentKey1",
                    "componentKey2",
                    "iswSwitchAmount",
                    "terminals_count",
                    "iswMid",
                    "iswInstitutionCode",
                    "allowProcessorOverride",
                    "iswDestinationAccount",
                    "organisationId",
                    "threeLineKey",
                    "threeLineHost",
                    "threeLinePort",
                    "threeLineHostSSL",
                    "hasthreelineSupport",
                    "webhookId",
                    "blueSaltTID",
                    "blueSaltKey",
                    "blueSaltEnv",
                    "processorSettings",
                    "iswISOConfig",
                    "hydrogenConfig",
                    "habariConfig",
                    "zpk",
                ]));
                response.json({ status: true, data });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    delete(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield ptspProfile_model_1.default.findById((_a = request.params) === null || _a === void 0 ? void 0 : _a.id);
                if (!profile)
                    return response.status(404).json({ message: "Profile not found" });
                const inUse = yield terminal_model_1.default.countDocuments({ profileId: profile._id });
                if (inUse > 0)
                    return response.status(400).json({ message: "Profile in use." });
                profile.deleteOne();
                response.json({ status: true, data: { _id: profile.id }, message: "Profile deleted successfully" });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    rotateZpk(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield ptspProfile_model_1.default.findById((_a = request.params) === null || _a === void 0 ? void 0 : _a.id);
                if (!profile)
                    return response.status(404).json({ message: "Profile not found" });
                if (profile.linkedProfileId !== null)
                    return response.status(422).json({ message: "Sorry you can't rotate keys on a linked profile" });
                const type = request.body.type;
                const details = {
                    isw: [cardsockethelper_1.TransactionTypes.ISW_KEY_EXCHANGE, {
                            host: profile.iswISOConfig.host,
                            port: profile.iswISOConfig.port,
                            ssl: profile.iswISOConfig.ssl,
                            zmk: profile.iswISOConfig.zmk
                        }],
                    hydrogen: [cardsockethelper_1.TransactionTypes.HYDROGEN_KEY_EXCHANGE, {
                            host: profile.hydrogenConfig.host,
                            port: profile.hydrogenConfig.port,
                            ssl: profile.hydrogenConfig.ssl,
                            zmk: profile.hydrogenConfig.zmk
                        },],
                    habari: [cardsockethelper_1.TransactionTypes.HABARI_KEY_EXCHANGE, {
                            host: profile.habariConfig.host,
                            port: profile.habariConfig.port,
                            ssl: profile.habariConfig.ssl,
                            zmk: profile.habariConfig.zmk
                        },],
                }[type];
                const getConfigKey = (type) => ({
                    isw: "iswISOConfig",
                    hydrogen: "hydrogenConfig",
                    habari: "habariConfig",
                })[type];
                const configKey = getConfigKey(type);
                if (!(configKey === null || configKey === void 0 ? void 0 : configKey.length)) {
                    return response.status(400).json({
                        message: "Invalid type"
                    });
                }
                const result = yield (0, cardsockethelper_1.sendSocketMessage)(...details);
                if (!result.status) {
                    return response.status(400).json(result.data);
                }
                profile[configKey].zpk = result.data.clearZPK;
                profile[configKey].lastRotate = new Date();
                profile[configKey].kcv = result.data.kcv;
                yield profile.save();
                let oProfile = profile.toJSON();
                yield ptspProfile_model_1.default.updateMany({ linkedProfileId: profile._id }, { $set: {
                        [configKey]: oProfile[configKey],
                    } });
                return response.json({
                    status: true,
                    message: "Key exchange successfull"
                });
            }
            catch (error) {
                console.trace(error);
                response.status(400).json({
                    message: "Something went wong"
                });
            }
        });
    }
    cloneProfile(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield ptspProfile_model_1.default.findById((_a = request.body) === null || _a === void 0 ? void 0 : _a.profileId);
                if (!profile)
                    return response.status(404).json({ message: "Profile not found" });
                let oldData = JSON.parse(JSON.stringify(profile));
                delete oldData._id;
                delete oldData.id;
                delete oldData.__v;
                console.log("old data: ", oldData);
                const newProfile = new ptspProfile_model_1.default(Object.assign(Object.assign({}, oldData), { title: request.body.title, linkedProfileId: request.body.profileId }));
                newProfile.save();
                return response.json({ message: "Profile cloned" });
            }
            catch (error) {
                console.trace(error);
                response.json({
                    status: false,
                    message: "Something went wrong"
                });
            }
        });
    }
    unlink(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield ptspProfile_model_1.default.findById((_a = request.params) === null || _a === void 0 ? void 0 : _a.id);
                if (!profile)
                    return response.status(404).json({ message: "Profile not found" });
                profile.linkedProfileId = null;
                yield profile.save();
                return response.json({ message: "Profile Unlinked" });
            }
            catch (error) {
                console.trace(error);
                response.json({
                    status: false,
                    message: "Something went wrong"
                });
            }
        });
    }
}
exports.default = ProfileController;
//# sourceMappingURL=profiles.controller.js.map