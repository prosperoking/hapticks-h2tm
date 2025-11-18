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
exports.isZoneSupportedBin = exports.loadZoneBinsPeriodically = exports.loadZoneBins = exports.zoneSupportedBins = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("./logger"));
exports.zoneSupportedBins = [
    "404905",
    "407591",
    "420358",
    "420359",
    "422500",
    "422522",
    "422584",
    "422594",
    "428223",
    "444581",
    "444582",
    "444585",
    "444586",
    "445493",
    "482132",
    "492069",
    "521090",
    "525634",
    "528655",
    "531165",
    "538956",
    "539586",
    "557581",
    "517868",
    "519863",
    "519885",
    "519911",
    "545993",
    "506108",
    "400691",
    "416919",
    "462516",
    "462517",
    "467874",
    "467875",
    "485483",
    "506123",
    "536024",
    "524289",
    "517214",
    "517294",
    "518539",
    "537691",
    "549479",
    "419760",
    "419761",
    "419762",
    "419764",
    "419765",
    "419767",
    "419768",
    "420332",
    "420333",
    "420334",
    "420335",
    "428272",
    "433960",
    "469023",
    "539983",
    "541569",
    "517455",
    "522340",
    "532732",
    "533853",
    "533856",
    "540746",
    "540761",
    "541508",
    "552264",
    "553396",
    "553415",
    "559754",
    "468588",
    "412053",
    "413103",
    "413183",
    "413185",
    "413197",
    "443862",
    "450075",
    "450090",
    "450091",
    "450092",
    "450093",
    "471449",
    "506109",
    "521982",
    "529720",
    "539941",
    "512336",
    "536579",
    "559443",
    "527282",
    "530519",
    "521952",
    "515803",
    "542231",
    "533301",
    "547160",
    "549970",
    "513469",
    "506115",
    "460055",
    "446965",
    "468219",
    "412583",
    "405030",
    "410373",
    "458792",
    "458793",
    "460053",
    "460054",
    "514585",
    "517897",
    "524271",
    "506119",
    "559441",
    "536902",
    "521958",
    "521963",
    "559453",
    "559466",
    "457803",
    "457804",
    "457805",
    "457806",
    "463958",
    "428270",
    "472491",
    "564000656",
];
const loadZoneBins = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get("https://sandbox.zonenetwork.com/gateway/api/banks/bins");
        exports.zoneSupportedBins = data.data.reduce((acc, bank) => {
            return [
                ...acc,
                ...bank.cardProfiles
                    .filter((item) => !["fbn", "keystone"].includes(item.shortName))
                    .map((item) => item.cardPrefix),
            ];
        }, []);
    }
    catch (error) {
        console.log(error);
        logger_1.default.error("failed to load zone bins");
    }
    return exports.zoneSupportedBins;
});
exports.loadZoneBins = loadZoneBins;
/**
 *
 * @param ttl time to reload in seconds, default 6 minutes
 */
const loadZoneBinsPeriodically = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (ttl = 360) {
    yield (0, exports.loadZoneBins)();
    const totalTTl = ttl * 1000;
    setTimeout(exports.loadZoneBinsPeriodically, totalTTl);
});
exports.loadZoneBinsPeriodically = loadZoneBinsPeriodically;
const isZoneSupportedBin = (pan) => {
    const bin = pan.startsWith("564000")
        ? pan.substring(0, 9)
        : pan.substring(0, 6);
    return exports.zoneSupportedBins.includes(bin);
};
exports.isZoneSupportedBin = isZoneSupportedBin;
//# sourceMappingURL=zonebins.js.map