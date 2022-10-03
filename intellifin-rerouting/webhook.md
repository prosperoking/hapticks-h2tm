# Handling a webhook Request

> Sample Payload

```json
{
 "MTI": "0200",
 "amount": 2545.68,
 "terminalId": "2033CEOM",
 "responseCode": "62",
 "responseDescription": "Restricted card",
 "PAN": "506124******7431",
 "STAN": "095522",
 "authCode": "",
 "transactionTime": "2022-10-01T20:55:28.000Z",
 "reversal": false,
 "merchantId": "2033LAGPOOO8527",
 "merchantName": "HAPTICKSDATA LTD LA LANG",
 "merchantAddress": "HAPTICKSDATA LTD LA LANG",
 "rrn": "221001215522"
}
```

> Sample digest headers

```json
{
 "x-verify-string": "jdcf8auca+1g8AlQce4xihlV/Ay29lUAYKT2CrNgsDo=",
 "x-signature": "239f148eb44a7b7871d1c7896881090c8b43c4c5485f9de9244556ca7576b36d"
}

```

You are expected to validate the x-signature with your secret provided to you below is an example with php

```php
function validate($verifyString, $signature)
{

    return (boolean) hash_equals(
        hash_hmac('sha256',$verifyString, $yourSecretHere),
        $signature
    );
}
```
