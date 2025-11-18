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
exports.generateTidRange = generateTidRange;
exports.generateTids = generateTids;
exports.getAvailableTid = getAvailableTid;
exports.getRanges = getRanges;
exports.totalPossibleGeneration = totalPossibleGeneration;
exports.generateTDESKey = generateTDESKey;
exports.getPTSPNibssToken = getPTSPNibssToken;
const terminalIds_model_1 = __importDefault(require("../db/models/terminalIds.model"));
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const availableCharacters = Array(10).fill(null).map((_, i) => i.toString()).concat(Array(26).fill(null).map((_, i) => String.fromCharCode(i + 65)));
function generateTidRange(start, end, prefix = '') {
    const alphaNum = /^[a-zA-Z0-9]+$/;
    if (start.length !== 4 || end.length !== 4)
        throw Error("Parameters must be of length four");
    if (!alphaNum.test(start) || !alphaNum.test(end))
        throw Error("Parameters mus be alpha numberic");
    const ranges = getRanges(start, end);
    return generateTids(prefix, ranges);
}
function generateTids(prefix = '', ranges) {
    const tids = [];
    for (let i = ranges.i.start; i <= ranges.i.end; i++) {
        for (let j = ranges.j.start; j <= ranges.j.end; j++) {
            for (let k = ranges.k.start; k <= ranges.k.end; k++) {
                for (let l = ranges.l.start; l <= ranges.l.end; l++) {
                    tids.push(`${prefix}${charForIndex(i)}${charForIndex(j)}${charForIndex(k)}${charForIndex(l)}`);
                }
            }
        }
    }
    return tids;
}
function getAvailableTid(id, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const terminalId = yield terminalIds_model_1.default.findOneAndUpdate({ linkedTo: null, type }, {
            linkedTo: id
        });
        if (!terminalId)
            return null;
        return terminalId;
    });
}
function charForIndex(index) {
    if (index < 10) {
        return index.toString();
    }
    else {
        return String.fromCharCode(index + 55);
    }
}
function getRanges(start, end) {
    var ranges = {};
    return ['i', 'j', 'k', 'l'].reduce((acc, letter, index) => {
        const first = availableCharacters.indexOf(start[index]);
        const last = availableCharacters.indexOf(end[index]);
        if (last < first)
            throw new Error('Invalid range');
        return Object.assign(Object.assign({}, acc), { [letter]: {
                start: first,
                end: last
            } });
    }, ranges);
}
function totalPossibleGeneration(ranges) {
    return Object.keys(ranges).reduce((accumulator, letter) => {
        const range = ranges[letter];
        const dif = range.end - range.start + 1;
        return accumulator ? accumulator * dif : dif;
    }, 0);
}
function generateTDESKey(bytes = 16) {
    return crypto_1.default.randomBytes(bytes)
        .toString('hex')
        .toUpperCase();
}
function getPTSPNibssToken(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.post(payload.url, {
                client_id: payload.clientId,
                client_secret: payload.clientSecret,
                grant_type: "client_credentials",
                scope: `${payload.clientId}/.default`
            }, {
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded",
                    'Accept': "application/json",
                    apiKey: payload.apiKey
                }
            });
            return data;
        }
        catch (error) {
            return null;
        }
    });
}
//# sourceMappingURL=appUtils.js.map