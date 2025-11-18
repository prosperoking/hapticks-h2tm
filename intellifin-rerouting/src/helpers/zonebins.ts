import axios from "axios";
import { ZoneBinsResponse } from "index";
import logger from "./logger";

export let zoneSupportedBins = [
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

export const loadZoneBins = async () => {
  try {
    const { data } = await axios.get<ZoneBinsResponse>(
      "https://sandbox.zonenetwork.com/gateway/api/banks/bins"
    );
    zoneSupportedBins = data.data.reduce((acc, bank) => {
      return [
        ...acc,
        ...bank.cardProfiles
          .filter((item) => !["fbn", "keystone"].includes(item.shortName))
          .map((item) => item.cardPrefix),
      ];
    }, []);
  } catch (error) {
    console.log(error);
    logger.error("failed to load zone bins");
  }
  return zoneSupportedBins;
};

/**
 *
 * @param ttl time to reload in seconds, default 6 minutes
 */

export const loadZoneBinsPeriodically = async (ttl: number = 360) => {
  await loadZoneBins();
  const totalTTl = ttl * 1000;
  setTimeout(loadZoneBinsPeriodically, totalTTl);
};

export const isZoneSupportedBin = (pan: string): boolean => {
  const bin = pan.startsWith("564000")
    ? pan.substring(0, 9)
    : pan.substring(0, 6);
  return zoneSupportedBins.includes(bin);
};
