const {createCipher, createDecipher} = require("crypto")

const password = process.env.API_SECRET_KEY;

export function encrypt (value) {
    return createCipher('aes-128-cbc', password)
            .update(value, 'utf8','hex')
            .digest('hex')
}

export function decrypt(value) {
    return createDecipher('aes-128-cbc', password)
                .update(value, 'hex','utf8')
                .final('utf8')
}




