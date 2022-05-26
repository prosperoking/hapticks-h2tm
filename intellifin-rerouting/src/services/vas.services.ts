import Webservice from './web.services';
import DbServices, { IDBServices } from './db.services';
import Utils from '../helpers/utils';
import RoutingServices from './routing.services';

interface IVasServices {

    processTransaction(headers: object, payload: object, requestUrl: string): any;

    processLookup(headers: object, payload: object, requestUrl: string): any;

}

class VasServices implements IVasServices {

    private dbServices: IDBServices;
    private notifcationUrl: string;

    constructor() {

        this.dbServices = new DbServices();
        this.notifcationUrl = process.env.NOTIFICATION_URL;
    }

    public async processLookup(headers: object, payload: object, requestUrl: string) {
        let endpointUrl = this.prepareGeneralEndpoint(requestUrl);
        let vasLookupUrl = Utils.getVasLookUp(endpointUrl, payload);
        let reguestUrl = `${process.env.BAXI_URL}${vasLookupUrl['url']}`;
        let requetMethod = vasLookupUrl['method'];
        console.log("baxi url ", JSON.stringify(vasLookupUrl))
        const headerRequest = {
            'x-api-key': `${process.env.BAXI_TOKEN}`
        }
        let response;
        try {
            response = await Webservice.lookupVasRequest(headerRequest, payload, reguestUrl, requetMethod);
        } catch (error) {
            console.log("response error : ", error?.data);
            response = error?.data.message
        }

        return response;

    }


    public async processTransaction(headers: object, payload: object, requestUrl: string) {

        const purchaseUrl: string = 'transaction/purchase'

        let endpointUrl = this.prepareVasEndpoint(requestUrl);

        const dataForRequest = JSON.stringify(payload);
        const refrenceId = this.randomStr(20, '1234567890bvsfdabcde');
        let vasProduct = Utils.getVasProduct(endpointUrl, JSON.parse(dataForRequest), refrenceId);

        if (!vasProduct) return { error: true, data: null };



        // save initial record
        // call purchase first for transaction flow

        let proccessPurchase;
        try {
            proccessPurchase = await RoutingServices.processTransaction(headers, payload, purchaseUrl);
        } catch (error) {
            proccessPurchase = error
        }
        console.log(":: proccessPurchase :: ", proccessPurchase);
        let purchaseresponse = proccessPurchase?.data.response;

        // proccess the vas transaction if purchase transaction is successful    
        if (purchaseresponse?.responseCode == '00') {

            const payloadData = JSON.parse(dataForRequest) || {};
            //mapper for url builder

            const vasUrl = `${process.env.BAXI_URL}${vasProduct['url']}`;
            let requestBody = {};
            const headerRequest = {
                'x-api-key': `${process.env.BAXI_TOKEN}`
            }
            let vasResponse:any = {};
            try {
                // console.log("vas URL :: ", vasUrl);
                let response;
                if (vasProduct.body) {
                    requestBody = vasProduct.body;
                }
                try {
                    response = await Webservice.rerouteVasRequest(headerRequest, requestBody, vasUrl);
                } catch (error) {
                    response = error.data
                }

                console.log("vas response", response);
                
                vasResponse = response;
                if(vasResponse.status == "error" || vasResponse.status == "pending"){
                    // console.log("error found got here");
                    response["statusCode"] = "99"
                }
                return { error: false, data: { purchaseresponse, vasResponse } }
            } catch (error) {
                console.log("Error from server :: ", error);
                vasResponse = error?.data.errors
                error["statusCode"] =  "99";
                //implement reversal
                //todo
                return { error: true, data: { purchaseresponse, error } }

            }
        } else {
            return { error: true,  data: { purchaseresponse }  }
        }


    }

    private prepareVasEndpoint(requestUrl: string): string {
        console.log("original Url :: ", requestUrl);

        let urlPath = requestUrl.split("vas");
        // console.log("urlPath :: ", urlPath);

        return `${process.env.BASEURL}${urlPath}`;
    }

    private prepareGeneralEndpoint(requestUrl: any): string {
        let urlPath = requestUrl.split("lookup/vas/");
        return urlPath;
    }

    private randomStr(len, arr) {
        var ans = '';
        for (var i = len; i > 0; i--) {
            ans +=
                arr[Math.floor(Math.random() * arr.length)];
        }
        return ans;
    }
}


export default new VasServices();