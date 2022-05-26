import Utils from "./utils";

class Mappers {

    static mapRequestDataToDbSchema(requestData: any, vasProduct: string) {

        let productKey = vasProduct.toLowerCase();

        requestData.transactionTime = new Date;
        requestData.product = vasProduct.toUpperCase();

        switch (productKey) {
            case "airtimevtu":
                return requestData;
            case "fundtransfer":
                requestData.beneficiaryAccountNumber = requestData.beneficiaryNumber;
                return requestData;
            case "data":
                requestData.phoneNumber = requestData.beneficiaryNumber;
                return requestData;
            case "electricity":
                requestData.accountNumber = requestData.beneficiaryNumber;
                return requestData;
            case "utility":
                requestData.accountNumber = requestData.beneficiaryNumber;
                return requestData;
            case "cabletv":
                requestData.accountNumber = requestData.beneficiaryNumber;
                return requestData;
            default:
                break;
        }

    }

    static mapTransRequestDataToDbSchema(requestData: any, product: string) {

        let productKey = product;
        requestData.transactionTime = new Date();  
        requestData.terminalId = requestData.terminalid;   
        requestData.merchantId = requestData.merchantid;   
        requestData.merchantCategoryCode = requestData.merchant_category_code;   
        requestData.merchantAddress = requestData.merchant_address;   
        requestData.MTI = productKey == "1" ? "0200": "";
        requestData.product = productKey == "1" ? "purchase": "refund";
        requestData.currencyCode = requestData.currency_code;
        requestData.PAN = Utils.getMaskPan(requestData.track2.split('D')[0]);
        return requestData;
    }

    static mapTransResponseDataToDbSchema(responseData: any, product: string) {

        let productKey = product;
        responseData.authCode = responseData.authid;
        responseData.reversal = false;
        responseData.responseCode = responseData.response;
        responseData.STAN = responseData.stan;
        responseData.responseDescription = responseData.description;    
        return responseData;
    }
    
}

export default Mappers;