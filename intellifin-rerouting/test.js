var CryptoJS = require('crypto-js');
var axios = require('axios')
var https = require('https')
// Define your plaintext data
var plaintext = "53347711338122990000064000002501305061052TARAV0000000010303";

var secretKey = CryptoJS.enc.Base64.parse("IWN5KX74s6lpawonyavN1cmigmmh/xXhTVUHfewrWno=");
// Generate the AES 256 encrypted data
var encryptedData = CryptoJS.AES.encrypt(plaintext, secretKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
});


// Base 64 encryption
//var base64Result = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptedData));

var encryptedBase64 = encryptedData.ciphertext.toString(CryptoJS.enc.Base64);

console.log(encryptedBase64)

axios.get("https://ofi.zonenetwork.com/pushjournal/api/push-journal",{httpsAgent}).then(({data})=>console.log(data)).catch(e=>{
    console.log(e)
})