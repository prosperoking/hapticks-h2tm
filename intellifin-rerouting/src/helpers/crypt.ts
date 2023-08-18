import { createHmac, createHash } from "crypto"
import { AES, enc } from 'crypto-js'
const password = process.env.API_SECRET_KEY;

export function encrypt (value) {
    return AES.encrypt(value, password).toString();            
}

export function decrypt(value) {
    return AES.decrypt(value, password).toString(enc.Utf8);
}

export function createDigest(secret, data) {

    const hmac = createHmac('sha256',secret)

    hmac.update(data);

    return hmac.digest('hex');
}

export function createSha256Hash(value: string) {
    return createHash('sha256')
            .update(value, 'utf-8')
            .digest()
            .toString('base64')
}
