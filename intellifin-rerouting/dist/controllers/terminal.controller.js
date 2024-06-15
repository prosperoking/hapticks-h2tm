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
const logger_1 = __importDefault(require("../helpers/logger"));
const terminal_model_1 = __importDefault(require("../db/models/terminal.model"));
const cardsockethelper_1 = require("../helpers/cardsockethelper");
const lodash_1 = require("lodash");
const ptspProfile_model_1 = __importDefault(require("../db/models/ptspProfile.model"));
const queue_1 = require("../queue/queue");
const terminalIds_model_1 = __importDefault(require("../db/models/terminalIds.model"));
const appUtils_1 = require("../helpers/appUtils");
const config_1 = __importDefault(require("../config/config"));
class TerminalController {
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { q, limit, page, organisation } = request.query;
                let filter = {};
                if (q === null || q === void 0 ? void 0 : q.length) {
                    filter = {
                        $or: [
                            { terminalId: RegExp(`^${q}`, 'i') },
                            { hydrogenTID: RegExp(`^${q}`, 'i') },
                            { habariTID: RegExp(`^${q}`, 'i') },
                            { iswISOTID: RegExp(`^${q}`, 'i') },
                            { serialNo: RegExp(`^${q}`, 'i') },
                            { brand: RegExp(`^${q}`, 'i') },
                            { deviceModel: RegExp(`^${q}`, 'i') },
                        ]
                    };
                }
                ;
                // @ts-ignore
                const orgId = !request.user.organisaitonId ? organisation : request.user.organisationId;
                if (orgId === null || orgId === void 0 ? void 0 : orgId.length)
                    filter = Object.assign(Object.assign({}, filter), { organisationId: orgId });
                const data = yield terminal_model_1.default.paginate(filter, {
                    populate: [
                        { path: 'profile', select: 'title iswSwitchAmount' },
                        { path: 'organisation', select: 'name' },
                        { path: 'groupTid', select: 'terminalId paramdownload parsedParams', populate: { path: 'profile', select: "title" } },
                    ],
                    limit: Number.parseInt(`${limit}`) || 30,
                    page: Number.parseInt(`${page}`) || 1,
                });
                response.json({ data, count: data.length });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield terminal_model_1.default.create(Object.assign({}, request.body));
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
                let terminal = yield terminal_model_1.default.findById(request.params.id);
                if (!terminal) {
                    return response.status(404).json({ message: "Terminal not found" });
                }
                const data = yield terminal.update((0, lodash_1.pick)(request.body, [
                    "serialNo",
                    "terminalId",
                    "profileId",
                    "iswTid",
                    "iswUniqueId",
                    "threeLineTid",
                    "organisationId",
                    "brand",
                    "deviceModel",
                    "iswISOTID",
                    "hydrogenTID",
                    "habariTID",
                    "terminalLocation",
                    "terminalGroupId"
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
                let terminal = yield terminal_model_1.default.findById(request.params.id);
                if (!terminal) {
                    return response.status(404).json({ message: "Terminal not found" });
                }
                const data = yield terminal.delete();
                response.json({ status: true, data });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    bulkUpload(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { terminals, profileId, organisationId } = request.body;
                let data = yield terminal_model_1.default.insertMany(terminals.map(terminal => (Object.assign(Object.assign({}, terminal), { profileId,
                    organisationId }))));
                return response.json({
                    data
                });
            }
            catch (error) {
                logger_1.default.error(error);
                response.status(400).json({ message: "Import failed" });
            }
        });
    }
    triggerKeyExchange(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let terminal = yield terminal_model_1.default.findById(request.params.id);
                if (!terminal) {
                    return response.status(404).json({ message: "Terminal not found" });
                }
                try {
                    // await   TerminalController.performKeyExchange(request.body, request.params.id);
                    yield queue_1.keyExchange.add('keyexchange', { _id: terminal.id });
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
            const terminal = yield terminal_model_1.default.findById(terminalId);
            let result;
            try {
                result = yield (0, cardsockethelper_1.sendSocketMessage)(cardsockethelper_1.TransactionTypes.KEY_EXCHANGE, {
                    tid: terminal.terminalId,
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
                terminal.encmasterkey = data.encmasterkey;
                terminal.encpinkey = data.encpinkey;
                terminal.encsesskey = data.encsesskey;
                terminal.clrmasterkey = data.clrmasterkey;
                terminal.clrsesskey = data.clrmasterkey;
                terminal.clrpinkey = data.clrpinkey;
                terminal.paramdownload = data.paramdownload;
                yield terminal.save();
            }
        });
    }
    export(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { q, organisation } = request.query;
                let filter = {};
                if (q === null || q === void 0 ? void 0 : q.length) {
                    filter = {
                        $or: [
                            { terminalId: RegExp(`^${q}`, 'i') },
                            { serialNo: RegExp(`^${q}`, 'i') },
                            { brand: RegExp(`^${q}`, 'i') },
                            { deviceModel: RegExp(`^${q}`, 'i') },
                        ]
                    };
                }
                ;
                // @ts-ignore
                const orgId = !request.user.organisaitonId ? organisation : request.user.organisationId;
                if (orgId === null || orgId === void 0 ? void 0 : orgId.length)
                    filter = Object.assign(Object.assign({}, filter), { organisationId: orgId });
                response.header('Content-Type', 'text/csv; charset=utf-8');
                response.attachment(`terminals-${Date.now()}.csv`);
                terminal_model_1.default.find(filter).cursor()
                    .pipe(terminal_model_1.default.csvTransformStream()).pipe(response);
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    generatedTidStat(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield terminalIds_model_1.default.aggregate([
                    {
                        $group: {
                            "count": { $sum: 1 },
                            _id: {
                                type: "$type",
                                linkedTo: "$linkedTo",
                            }
                        },
                    },
                    {
                        $group: {
                            _id: "$_id.type",
                            total: {
                                $sum: 1,
                            },
                            assigned: {
                                $sum: {
                                    $cond: {
                                        if: { $ne: ["$_id.linkedTo", null] },
                                        else: 0,
                                        then: 1
                                    }
                                }
                            },
                            unAssined: {
                                $sum: {
                                    $cond: {
                                        if: { $eq: ["$_id.linkedTo", null] },
                                        else: 0,
                                        then: 1
                                    }
                                }
                            }
                        }
                    },
                ]);
                response.json({ data });
            }
            catch (error) {
                response.status(400).json({ message: error.message });
            }
        });
    }
    generatedTids(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { q, limit, page, organisation } = request.query;
                let filter = {};
                if (q === null || q === void 0 ? void 0 : q.length) {
                    filter = {
                        $or: [
                            { tid: RegExp(`^${q}`, 'i') },
                            { type: RegExp(`^${q}`, 'i') },
                        ]
                    };
                }
                ;
                // @ts-ignore
                const orgId = !request.user.organisaitonId ? organisation : request.user.organisationId;
                if (orgId === null || orgId === void 0 ? void 0 : orgId.length)
                    filter = Object.assign(Object.assign({}, filter), { organisationId: orgId });
                const data = yield terminalIds_model_1.default.paginate(filter, {
                    populate: [
                        { path: 'terminal', select: 'serialNo brand deviceModel' },
                    ],
                    limit: Number.parseInt(`${limit}`) || 30,
                    page: Number.parseInt(`${page}`) || 1,
                    sort: {
                        _id: -1,
                    }
                });
                response.json({ data, count: data.length });
            }
            catch (error) {
                console.log(error);
                response.status(400).json({ message: error.message });
            }
        });
    }
    generateTids(request, response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { start, end,
                // iswPrefix,
                // hydrogenPrefix
                 } = request.body;
                if ((start === null || start === void 0 ? void 0 : start.length) !== 4 || (end === null || end === void 0 ? void 0 : end.length) !== 4)
                    return response.json({ message: "Invalid start and end" });
                start = start.toUpperCase();
                end = end.toUpperCase();
                const rangeGenerated = `${start}-${end}`;
                let tids = [];
                const mapForSave = (tids, type) => {
                    return tids.map(tid => ({
                        tid,
                        type,
                        rangeGenerated,
                    }));
                };
                const { processorPrefixes } = (new config_1.default()).configObject;
                console.log(processorPrefixes);
                if (!((_a = processorPrefixes.isw) === null || _a === void 0 ? void 0 : _a.length) || !((_b = processorPrefixes.hydrogen) === null || _b === void 0 ? void 0 : _b.length))
                    return response.status(400).json({
                        message: "Processor Prefix not configured"
                    });
                tids = tids.concat(mapForSave((0, appUtils_1.generateTidRange)(start, end, processorPrefixes.isw), 'isw')).concat(mapForSave((0, appUtils_1.generateTidRange)(start, end, processorPrefixes.hydrogen), 'hydrogen'));
                try {
                    yield terminalIds_model_1.default.insertMany(tids, { ordered: false, });
                }
                catch (e) {
                }
                return response.json({
                    data: {
                        totalGenerated: tids.length,
                    },
                });
            }
            catch (error) {
                response.status(400).json({ message: error.message });
            }
        });
    }
}
exports.default = TerminalController;
//# sourceMappingURL=terminal.controller.js.map