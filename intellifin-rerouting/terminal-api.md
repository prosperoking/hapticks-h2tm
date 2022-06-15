# API Doc

## Profile download

```http
GET /api/v1/card/perform-key-exchange HTTP/1.1
Host: 165.227.166.27:5010
x-serial: 00052000387
x-brand: PAX
x-device-model: s90
x-app-version: 2.0.1
```

> NB: Terminal must be registered on the tms with serial and tid

## Key Exchange

```http
GET /api/v1/card/perform-key-exchange/ HTTP/1.1
Host: 165.227.166.27:5010
x-serial-no: 00052000387
x-brand: PAX
x-device-model: s90
x-app-version: 2.0.1
```

> Response

```json
{"encpinkey":"B05B184CE6A8A5D4A513E13F8537A54A","encsesskey":"98EEC0A35FB1908E458B2310317A2FBB","clrpinkey":"0DE3F1D5E91A4AFB51809E54F80B62A8","port":"5024","ip":"196.6.103.18","clrsesskey":"CB83CD79794F0E46F14A011A640B9E43","encmasterkey":"347D739A8B9F2964F8A5071BD394BE94","paramdownload":"0201420220227154723030152214LA2450520120400245050035660600356607001108004533152040KARABO FINANCIAL SOLUTILA           LANG","tid":"22141O64","clrmasterkey":"AE5849F1E68AB573D6EFD99191FE0240"}
```

## Iso Txn (Postbridge and Nibss Payload)

```HTTP
POST /api/v1/card/processCard HTTP/1.1
Host: 165.227.166.27:5010
x-serial: 00052000387
x-brand: PAX
x-device-model: s90
x-app-version: 2.0.1
```

> Request

```json
{"field18":"5814","ssl":true,"tid":"2214U822","field22":"051","field23":"002","field26":"06","field25":"00","host":"196.6.103.18","field11":"000373","field55":"9F2608321BA08576B9B5C79F2701809F10120110A74003020000000000000000000000FF9F3704FA3AE3C89F36020361950500800088009A032205019C01009F02060000003500005F2A020566820239009F1A0205669F34034403029F3303E0F8C89F350122","field12":"110838","port":"5024","field13":"0501","field14":"2206","field52":"null","field42":"2214LA642732153","field43":"EAT N GO LIMITED       LA           LANG","field49":"566","sn":"3D651413","field40":"221","field41":"2214U822","amount":"3500.00","field128":"D611660480937F940F6201F4D0F185D5D3A1D8EE369EA20CEF6B695037EAC17C","field123":"510101511344101","field28":"C00000000","field0":"0200","field32":"111129","field37":"000000000373","field35":"5327320103164361D22062210022896887","clrsesskey":"2A9D0D437F4568DC251C43942A626D37","field7":"0501110838","field3":"002000","field2":"5327320103164361","transaction":"ISO","field4":"000000350000"}
```

> PACKING ORDER OF FIELD 55 (EMV TAG)

```json
["9F26", "9F27", "9F10", "9F37", "9F36", "95", "9A", "9C", "9F02", "5F2A", "5F34", "82", "9F1A", "9F03", "9F33", "84", "9F34", "9F35", "9F41"]
```

> Response

```json
{"resp":"00","auth":"005814","icc":"910A", "meaning": "APPROVED...."}
```

## Api Txn (Kimono)

```http
POST /api/v1/card/processCard HTTP/1.1
Host: 165.227.166.27:5010
x-serial: 00052000387
x-brand: PAX
x-device-model: s90
x-app-version: 2.0.1
```

>Request

```json
{"transaction":"KIMONO", "tid": "", "mid": "", "sn": "", "account": "Default", "clrpin": "clear pin key for pinblock", 
"pinblock": "if its online card", "panseqno": "emv tag", "amount": "000000000000", "aip": "emv tag", "atc": "emv tag",
"cryptogram": "emv tag", "cip": "emv tag", "cvm": "emv tag", "iad": "emv tag", "tvr": "emv tag", "capabilities": "emv tag",
"unpredictable": "emv tag", "filename": "emv tag", "pan": "emv tag", "expirydate": "emv tag", "track": "emv tag", "stan": "000000",
"rrn": "000000000000", "totalamount": "30.00"}
```

> NB: Account can be Savings, Default or Current

>Response

```json
{"resp":"00","auth":"005814","icc":"910A", "meaning": "APPROVED...."}
```

## API Unison (Kimono/NIBSS)

> Request

```json
{
    "tid": "2214U822",
    "mid": "", // can be read from field 42 or online
    "sn": "3D651413", // not required as I can read it from the backend
    "account": "Default",
    "clrpin": "clear pin key for pinblock",
    "pinblock": "if its online card",
    "panseqno": "emv tag",
    "amount": "3500.00",// can be read from field4
    "aip": "emv tag",// can be read from field55 as Application Interchange Profile
    "atc": "emv tag", // can be read from field55 as  Application Transaction Counter
    "cryptogram": "emv tag",// can be read from field55 as Application Cryptogram
    "cip": "emv tag",// can be read from field55 as Cryptogram Information Data
    "cvm": "emv tag", // can be read from field55 as Cardholder Verification Method
    "iad": "emv tag", // can be read from field55
    "tvr": "emv tag", // can be read from field55 as Terminal Verification Results
    "capabilities": "emv tag", // can be read from field55 as Terminal Capabilities
    "unpredictable": "emv tag", // can be read from field55 as Unpredictable Number
    "filename": "emv tag",
    "pan": "emv tag",// can be read from field35
    "expirydate": "emv tag",// can be read from field35
    "track": "emv tag",// field field35
    "stan": "000000", // same as field 11
    "rrn": "000000000000", 
    "totalamount": "30.00", // is this the same as amount and field4
    "field18": "5814",
    "ssl": true,
    "field22": "051",
    "field23": "002",
    "field26": "06",
    "field25": "00",
    "host": "196.6.103.18",
    "field11": "000373",
    "field55": "9F2608321BA08576B9B5C79F2701809F10120110A74003020000000000000000000000FF9F3704FA3AE3C89F36020361950500800088009A032205019C01009F02060000003500005F2A020566820239009F1A0205669F34034403029F3303E0F8C89F350122",
    "field12": "110838",
    "port": "5024",
    "field13": "0501",
    "field14": "2206",
    "field52": "null",
    "field42": "2214LA642732153",
    "field43": "EAT N GO LIMITED       LA           LANG",
    "field49": "566",
    "field40": "221",
    "field41": "2214U822",
    "field128": "D611660480937F940F6201F4D0F185D5D3A1D8EE369EA20CEF6B695037EAC17C",
    "field123": "510101511344101",
    "field28": "C00000000",
    "field0": "0200",
    "field32": "111129",
    "field37": "000000000373",
    "field35": "5327320103164361D22062210022896887",
    "clrsesskey": "2A9D0D437F4568DC251C43942A626D37",
    "field7": "0501110838",
    "field3": "002000",
    "field2": "5327320103164361",
    "field4": "000000350000"
}

```

>Response

```json
{"resp":"00","auth":"005814","icc":"910A", "meaning": "APPROVED...."}