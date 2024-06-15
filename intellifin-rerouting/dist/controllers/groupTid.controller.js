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
const groupTid_model_1 = __importDefault(require("../db/models/groupTid.model"));
const lodash_1 = require("lodash");
const queue_1 = require("../queue/queue");
const cardsockethelper_1 = require("../helpers/cardsockethelper");
const cardsockethelper_2 = require("../helpers/cardsockethelper");
const ptspProfile_model_1 = __importDefault(require("../db/models/ptspProfile.model"));
const logger_1 = __importDefault(require("../helpers/logger"));
class GroupTidController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { q, limit, page, organisation } = req.query;
                let filter = {};
                if (q === null || q === void 0 ? void 0 : q.length) {
                    filter = {
                        $or: [
                            { terminalId: RegExp(`^${q}`, 'i') },
                            // { hydrogenTID: RegExp(`^${q}`,'i') },
                            // { iswISOTID: RegExp(`^${q}`,'i') },
                        ]
                    };
                }
                ;
                // @ts-ignore
                const orgId = !req.user.organisaitonId ? organisation : req.user.organisationId;
                if (orgId === null || orgId === void 0 ? void 0 : orgId.length)
                    filter = Object.assign(Object.assign({}, filter), { organisationId: orgId });
                const data = yield groupTid_model_1.default.paginate(filter, {
                    populate: [
                        { path: 'profile', select: 'title iswSwitchAmount' },
                        { path: 'organisation', select: 'name' },
                        { path: 'terminals_count' }
                    ],
                    limit: Number.parseInt(`${limit}`) || 30,
                    page: Number.parseInt(`${page}`) || 1,
                });
                res.json({ data, count: data.length });
            }
            catch (error) {
                console.log(error);
                res.status(400).json({ message: error.message });
            }
        });
    }
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { q, limit, page, organisation } = req.query;
                let filter = {};
                if (q === null || q === void 0 ? void 0 : q.length) {
                    filter = {
                        $or: [
                            { terminalId: RegExp(`^${q}`, 'i') },
                            // { hydrogenTID: RegExp(`^${q}`,'i') },
                            // { iswISOTID: RegExp(`^${q}`,'i') },
                        ]
                    };
                }
                ;
                // @ts-ignore
                const data = yield groupTid_model_1.default.find(filter).select("terminalId");
                res.json(data);
            }
            catch (error) {
                logger_1.default.error(error);
                res.status(400).json({ message: error.message });
            }
        });
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield groupTid_model_1.default.create(Object.assign({}, request.body));
                response.json({ status: true, data });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let groupTId = yield groupTid_model_1.default.findById(request.params.id);
                if (!groupTId) {
                    return response.status(404).json({ message: "Group Tid not found" });
                }
                console.log(request.body);
                const data = yield groupTId.update((0, lodash_1.pick)(request.body, [
                    "profileId",
                    "terminalId",
                    "iswISOTID",
                    "hydrogenTID",
                ]));
                try {
                    //    ProfileController.performKeyExchange(request.body, request.params.id);
                    // keyExchange.add('keyexchange', {_id: terminal.id});
                }
                catch (e) {
                    console.log("Unable to trigger key exchange", e);
                }
                response.json({ status: true, data });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    destroy(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let groupTid = yield groupTid_model_1.default.findById(request.params.id);
                if (!groupTid) {
                    return response.status(404).json({ message: "Group Tid not found" });
                }
                const data = yield groupTid.delete();
                response.json({ status: true, data });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    triggerKeyExchange(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let groupTid = yield groupTid_model_1.default.findById(request.params.id);
                if (!groupTid) {
                    return response.status(404).json({ message: "Group Tid not found" });
                }
                try {
                    // await   TerminalController.performKeyExchange(request.body, request.params.id);
                    yield queue_1.Groupkeyexchange.add('groupkeyexchange', { _id: groupTid.id });
                }
                catch (e) {
                    console.log("Unable to trigger key exchange", e);
                }
                response.json({ status: true });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    static performKeyExchange(data, terminalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield ptspProfile_model_1.default.findById(data.profileId);
            if (!profile)
                return;
            const groupTerminal = yield groupTid_model_1.default.findById(terminalId);
            let result;
            try {
                result = yield (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_2.TransactionTypes.KEY_EXCHANGE, {
                    tid: groupTerminal.terminalId,
                    component: profile.componentKey1,
                    ip: profile.isoHost,
                    ssl: String(profile.isSSL),
                    port: profile.isoPort
                });
            }
            catch (error) {
                console.log("unable to perform auto key exchange: ", error);
                return;
            }
            if (result === null || result === void 0 ? void 0 : result.status) {
                const { data } = result;
                groupTerminal.encmasterkey = data.encmasterkey;
                groupTerminal.encpinkey = data.encpinkey;
                groupTerminal.encsesskey = data.encsesskey;
                groupTerminal.clrmasterkey = data.clrmasterkey;
                groupTerminal.clrsesskey = data.clrmasterkey;
                groupTerminal.clrpinkey = data.clrpinkey;
                groupTerminal.paramdownload = data.paramdownload;
                yield groupTerminal.save();
            }
        });
    }
}
exports.default = GroupTidController;
//# sourceMappingURL=groupTid.controller.js.map