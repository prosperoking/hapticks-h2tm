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
                        { path: 'organisation', select: 'name' }
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
                    "organisationId",
                    "brand",
                    "deviceModel"
                ]));
                try {
                    //    ProfileController.performKeyExchange(request.body, request.params.id);
                    queue_1.keyExchange.add('keyexchange', { _id: terminal.id });
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
                result = yield (0, cardsockethelper_1.performCardSocketTranaction)(cardsockethelper_1.TransactionTypes.KEY_EXCHANGE, {
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
}
exports.default = TerminalController;
//# sourceMappingURL=terminal.controller.js.map