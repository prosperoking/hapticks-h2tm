import Webservice from './web.services';
import DbServices, { IDBServices } from './db.services';
import Utils from '../helpers/utils';

interface IRoutingServices {

    processTransaction(headers: object, payload: object, requestUrl: string): any;
    processReversalTransaction(headers: object, payload: object, requestUrl: string): any;

    processLookup(headers: object, payload: object, requestUrl: string): any;

    processNotifications(headers: object, payload: object, requestUrl: string): any;

}

class RoutingServices implements IRoutingServices {

    private dbServices: IDBServices;
    public notifcationUrl: string;

    constructor() {

        this.dbServices = new DbServices();
        this.notifcationUrl = process.env.NOTIFICATION_URL;
    }

    public async processLookup(headers: object, payload: object, requestUrl: string) {
        console.log("endpointUrl :: ", requestUrl);

        // let endpointUrl = this.prepareGeneralEndpoint(requestUrl);

        let endpointUrl = `${process.env.BASEURL}/${requestUrl}`;
        const response = await Webservice.rerouteVasRequest(headers, payload, endpointUrl);

        return response;

    }

    public async processNotifications(headers: object, payload: object, requestUrl: string) {
        const payloadObject = {
            "MTI": payload['MTI'],
            "amount": (parseInt(payload['amount']) / 100),
            "terminalId": payload['terminalId'],
            "responseCode": payload['responseCode'],
            "responseDescription": payload["responseDescription"],
            "PAN": payload["PAN"] || " ",
            "STAN": payload["STAN"] || " ",
            "authCode": payload["authCode"],
            "transactionTime": payload["transactionTime"],
            "reversal": false,
            "merchantId": payload["merchantId"],
            "merchantName": payload["merchantAddress"],
            "merchantAddress": payload["merchantAddress"],
            "rrn": payload["rrn"],
        };


        console.log("Request Payload :: ", payloadObject);

        const notificationResponse = await Webservice.sendNotificationRequest(headers, payloadObject, requestUrl);
        console.log(JSON.stringify("notificationResponse", notificationResponse));

        return notificationResponse;
    }


    public async processTransaction(headers: object, payload: object, requestUrl: string) {

        let endpointUrl = this.prepareVasEndpoint(requestUrl);

        let vasProduct = Utils.getTransProduct(endpointUrl);

        if (!vasProduct) return { error: true, data: null };

        // console.log("vasProduct ::", vasProduct)
        // save initial record
        const dataForRequest = JSON.stringify(payload);
        const savedRecord = await this.dbServices.createTransactionRecord(payload, vasProduct);
        console.log(":: savedRecord ::", savedRecord);
        if (savedRecord.saved) {

            const requestBody = JSON.parse(dataForRequest) || [];
            delete requestBody['vasData'];
            requestBody['transtype'] = vasProduct;

            const url = `${process.env.BASEURL}/transaction_posvas`;
            console.log("result : ", JSON.stringify(url));

            const response = await Webservice.rerouteVasRequest(headers, requestBody, url);
            // console.log("Response from intelifin :: ", response);
            if (response) {
                const updateRecord = await this.dbServices.updateTransactionRecord(response, endpointUrl);
                if (updateRecord.saved) {
                    const payloadData = updateRecord.DbrecordInstance;
                    const notificationHeader = {
                        'Authorization': 'Bearer vBCP1CGReJAqY3IDZ2Rs64Eb1uJ5rIXTO7oZceIn',
                        terminalId: payloadData['terminalId']
                    };
                    try {
                        const notificationResponse = await this.processNotifications(notificationHeader, payloadData, this.notifcationUrl);
                        console.log(JSON.stringify("response from notification", notificationResponse))
                        await this.dbServices.updateTransactionStatus(true, JSON.stringify(notificationResponse))
                    } catch (error) {
                        console.log(JSON.stringify("response error", error.message))
                        await this.dbServices.updateTransactionStatus(false, JSON.stringify("error"))
                    }
                    return {
                        error: false, data: { response, updateRecord }
                    }
                }
            }

            return { error: true, data: null }
        } else {
            return { error: true, data: null }
        }
    }

    public async processReversalTransaction(headers: object, payload: object, requestUrl: string) {

        let endpointUrl = this.prepareVasEndpoint(requestUrl);

        let vasProduct = Utils.getTransProduct(endpointUrl);

        if (!vasProduct) return { error: true, data: null };

        console.log('requestUrl', requestUrl);

        // save initial record
        const dataForRequest = JSON.stringify(payload);
        const savedRecord = await this.dbServices.createTransactionRecord(payload, vasProduct);
        // console.log(":: savedRecord ::", savedRecord);

        if (savedRecord.saved) {

            const requestBody = JSON.parse(dataForRequest) || []
            requestBody['transtype'] = vasProduct;

            const url = `${process.env.BASEURL}/transaction`;
            // console.log("url intelifin :: ", url);
            const response = await Webservice.rerouteVasRequest(headers, requestBody, url);
            // console.log("Response from intelifin :: ", response);
            const updateRecord = await this.dbServices.updateTransactionRecord(response, endpointUrl);
            if (updateRecord.saved) {
                return { error: false, data: response }
            }

        }

        return { error: true, data: null }
    }

    private prepareVasEndpoint(requestUrl: string): string {

        let urlPath = requestUrl.split("transaction")[1];
        return `${process.env.BASEURL}${urlPath}`;
    }

    private prepareGeneralEndpoint(requestUrl: string): any {

        console.log(":: -> ", requestUrl);

        let urlPath = requestUrl.split("intellifin")[0]
        console.log(":end : -> ", urlPath);
        return `${process.env.BASEURL}/${requestUrl}`;

    }

}


export default new RoutingServices();