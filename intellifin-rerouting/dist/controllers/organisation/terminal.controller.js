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
exports.deleteTerminal = exports.createTerminal = exports.updateTermialTidGroupTid = exports.updateTermial = exports.getByTid = exports.getById = exports.terminalIds = exports.triggerKeyExchangeOnGroupTid = exports.getGroupedTids = void 0;
const groupTid_model_1 = __importDefault(require("../../db/models/groupTid.model"));
const terminal_model_1 = __importDefault(require("../../db/models/terminal.model"));
const logger_1 = __importDefault(require("../../helpers/logger"));
const pick_1 = __importDefault(require("lodash/pick"));
const cardsockethelper_1 = require("../../helpers/cardsockethelper");
function getGroupedTids(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const groupedTids = yield groupTid_model_1.default.paginate({
                //@ts-ignore
                organisationId: req.user._id,
            }, {
                select: "_id terminalId",
            });
            res.json(groupedTids);
        }
        catch (error) {
            logger_1.default.error(error);
            res.status(400).json({ message: "Something went wrong" });
        }
    });
}
exports.getGroupedTids = getGroupedTids;
function triggerKeyExchangeOnGroupTid(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const groupTid = yield groupTid_model_1.default.findOne({
                //@ts-ignore
                organisationId: req.user._id,
                _id: req.params.id,
            }).populate("profile");
            if (!groupTid) {
                return res.status(400).json({ message: "GroupTid not found" });
            }
            const profile = groupTid.profile;
            try {
                let result = yield (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_1.TransactionTypes.KEY_EXCHANGE, {
                    tid: groupTid.terminalId,
                    component: profile.componentKey1,
                    ip: profile.isoHost,
                    ssl: String(profile.isSSL),
                    port: profile.isoPort,
                });
                console.log("", result);
                if (!(result === null || result === void 0 ? void 0 : result.status))
                    throw Error(result.message);
                const { data } = result;
                groupTid.encmasterkey = data.encmasterkey;
                groupTid.encpinkey = data.encpinkey;
                groupTid.encsesskey = data.encsesskey;
                groupTid.clrmasterkey = data.clrmasterkey;
                groupTid.clrsesskey = data.clrsesskey;
                groupTid.clrpinkey = data.clrpinkey;
                groupTid.paramdownload = data.paramdownload;
                yield groupTid.save();
            }
            catch (e) {
                return res.status(400).json({
                    message: "Key exchange failed",
                });
            }
            res.json({
                message: "GroupTid key exchange triggered",
                data: groupTid,
            });
        }
        catch (error) {
            logger_1.default.error(error);
            res.status(400).json({ message: "Something went wrong" });
        }
    });
}
exports.triggerKeyExchangeOnGroupTid = triggerKeyExchangeOnGroupTid;
function terminalIds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const q = req.query;
            const query = (q === null || q === void 0 ? void 0 : q.length)
                ? {
                    $or: [
                        { terminalGroupId: q },
                        { terminalId: q },
                        { serialNo: q },
                        { iswISOTID: q },
                        { iswTid: q },
                        { habariTID: q },
                        { hydrogenTID: q },
                    ],
                }
                : {};
            const terminals = yield terminal_model_1.default.paginate(Object.assign({ 
                //@ts-ignore
                organisationId: req.user._id }, query), {
                select: "_id terminalId terminalGroupId serialNo ",
            });
            res.json(terminals);
        }
        catch (error) {
            logger_1.default.error(error);
            res.status(400).json({ message: "Something went wrong" });
        }
    });
}
exports.terminalIds = terminalIds;
function getById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const terminals = yield terminal_model_1.default.findOne({
                //@ts-ignore
                organisationId: req.user._id,
                _id: req.params.id,
            });
            res.json(terminals);
        }
        catch (error) {
            logger_1.default.error(error);
            res.status(400).json({ message: "Something went wrong" });
        }
    });
}
exports.getById = getById;
function getByTid(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield terminal_model_1.default.findOne({
                //@ts-ignore
                organisationId: req.user._id,
                terminalId: req.params.tid,
            }).exec();
            res.json({ status: data !== null, data });
        }
        catch (error) {
            logger_1.default.error(error);
            res.status(400).json({ message: "Something went wrong" });
        }
    });
}
exports.getByTid = getByTid;
function updateTermial(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let terminal = yield terminal_model_1.default.findOne({
                //@ts-ignore
                organisationId: req.user._id,
                _id: req.params.id,
            });
            if (!terminal || terminal == null) {
                return res.status(400).json({ message: "No data found!" });
            }
            const data = yield terminal.update((0, pick_1.default)(req.body, [
                "serialNo",
                "terminalId",
                "profileId",
                "iswTid",
                "iswUniqueId",
                "threeLineTid",
                "brand",
                "deviceModel",
                "iswISOTID",
                "hydrogenTID",
                "terminalLocation",
                "terminalGroupId",
            ]));
            terminal = yield terminal_model_1.default.findOne({
                //@ts-ignore
                organisationId: req.user._id,
                _id: req.params.id,
            });
            res.json({ status: true, data: terminal });
        }
        catch (error) {
            logger_1.default.error(error);
            res.status(400).json({ message: "Something went wrong" });
        }
    });
}
exports.updateTermial = updateTermial;
function updateTermialTidGroupTid(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let terminal = yield terminal_model_1.default.findOne({
                //@ts-ignore
                organisationId: req.user._id,
                _id: req.params.id,
            });
            if (!terminal || terminal == null) {
                return res.status(400).json({ message: "No data found!" });
            }
            const data = yield terminal.update((0, pick_1.default)(req.body, ["terminalId", "terminalGroupId"]));
            terminal = yield terminal_model_1.default.findOne({
                //@ts-ignore
                organisationId: req.user._id,
                _id: req.params.id,
            });
            res.json({ status: true, data: terminal });
        }
        catch (error) {
            logger_1.default.error(error);
            res.status(400).json({ message: "Something went wrong" });
        }
    });
}
exports.updateTermialTidGroupTid = updateTermialTidGroupTid;
function createTerminal(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield terminal_model_1.default.create(Object.assign(Object.assign({}, request.body), { 
                //@ts-ignore
                organisationId: request.user._id }));
            response.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            response.status(400).json({ message: error.message });
        }
    });
}
exports.createTerminal = createTerminal;
function deleteTerminal(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield terminal_model_1.default.deleteOne({
                _id: request.params.id,
                //@ts-ignore
                organisationId: request.user._id,
            });
            response.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            response.status(400).json({ message: error.message });
        }
    });
}
exports.deleteTerminal = deleteTerminal;
//# sourceMappingURL=terminal.controller.js.map