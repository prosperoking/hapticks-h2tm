"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const { createCipher, createDecipher } = require("crypto");
const password = process.env.API_SECRET_KEY;
function encrypt(value) {
    return createCipher('aes-128-cbc', password)
        .update(value, 'utf8', 'hex')
        .digest('hex');
}
exports.encrypt = encrypt;
function decrypt(value) {
    return createDecipher('aes-128-cbc', password)
        .update(value, 'hex', 'utf8')
        .final('utf8');
}
exports.decrypt = decrypt;
//# sourceMappingURL=crypt.js.map