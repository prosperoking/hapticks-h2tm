"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paysurecoreCredentials = exports.paysurecoreEndpoints = exports.dateGroup = exports.weekThreshold = exports.threshold = exports.apiStatusCodes = void 0;
require("dotenv/config");
const apiStatusCodes = {
    success: 200,
    created: 201,
    noContent: 204,
    badRequest: 400,
    unAuthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    serverError: 500,
};
exports.apiStatusCodes = apiStatusCodes;
const threshold = {
    A: Number(process.env.BandA_threshold) || 100000000,
    B: Number(process.env.BandB_threshold) || 20000000,
    C: Number(process.env.BandC_threshold) || 15000000,
};
exports.threshold = threshold;
const weekThreshold = {
    A: Number(process.env.BandA_threshold_Weekly) || 1000000000,
    B: Number(process.env.BandB_threshold_Weekly) || 200000000,
    C: Number(process.env.BandC_threshold_Weekly) || 50000000,
};
exports.weekThreshold = weekThreshold;
const dateGroup = {
    daily: "daily",
    weekly: "week",
    monthly: "month",
    biAnnual: "bi",
    annual: "year",
    range: "range",
};
exports.dateGroup = dateGroup;
const paysurecoreCredentials = {
    superadminuser: process.env.PAYSURECORE_superusername,
    superadminpassword: process.env.PAYSURECORE_superadminpassword,
    testmerchantuser: process.env.PAYSURECORE_testmerchantusername,
    testmerchantpassword: process.env.PAYSURECORE_testmerchantpassword
};
exports.paysurecoreCredentials = paysurecoreCredentials;
const paysurecoreEndpoints = {
    gettoken: `${process.env.PAYSURECOREBASEURL}/login/auth`,
    addterminals: `${process.env.PAYSURECOREBASEURL}/merchants/addterminals`,
    getTerminalsByMerchantCode: `${process.env.PAYSURECOREBASEURL}/merchants/`, // to be added to this url /:merchantCode/terminals
};
exports.paysurecoreEndpoints = paysurecoreEndpoints;
//# sourceMappingURL=constants.js.map