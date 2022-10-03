"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSha256Hash = exports.createDigest = exports.decrypt = exports.encrypt = void 0;
const crypto_1 = require("crypto");
const crypto_js_1 = require("crypto-js");
const password = process.env.API_SECRET_KEY;
function encrypt(value) {
    return crypto_js_1.AES.encrypt(value, password).toString();
}
exports.encrypt = encrypt;
function decrypt(value) {
    return crypto_js_1.AES.decrypt(value, password).toString();
}
exports.decrypt = decrypt;
function createDigest(secret, data) {
    const hmac = (0, crypto_1.createHmac)('sha256', secret);
    hmac.update(data);
    return hmac.digest('hex');
}
exports.createDigest = createDigest;
function createSha256Hash(value) {
    return (0, crypto_1.createHash)('sha256')
        .update(value, 'utf-8')
        .digest()
        .toString('base64');
}
exports.createSha256Hash = createSha256Hash;
//# sourceMappingURL=crypt.js.map