"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.createDigest = createDigest;
exports.createSha256Hash = createSha256Hash;
const crypto_1 = require("crypto");
const crypto_js_1 = require("crypto-js");
const password = process.env.API_SECRET_KEY;
function encrypt(value) {
    return crypto_js_1.AES.encrypt(value, password).toString();
}
function decrypt(value) {
    return crypto_js_1.AES.decrypt(value, password).toString(crypto_js_1.enc.Utf8);
}
function createDigest(secret, data) {
    const hmac = (0, crypto_1.createHmac)('sha256', secret);
    hmac.update(data);
    return hmac.digest('hex');
}
function createSha256Hash(value) {
    return (0, crypto_1.createHash)('sha256')
        .update(value, 'utf-8')
        .digest()
        .toString('base64');
}
//# sourceMappingURL=crypt.js.map