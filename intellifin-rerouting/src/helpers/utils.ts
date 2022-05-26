import moment from "moment";
import path from "path";
import fs from "fs";

const SimpleNodeLogger = require('simple-node-logger');

class Utils {

    static getVasProduct(url: any, payloadData: any, refrenceId): any {


        if (url.includes('airtimevtu')) return { 'airtimevtu': 'airtimevtu', 'url': `${process.env.AIRTIME_URL}?phone=${payloadData['vasData'].phone}&amount=${payloadData['amount'] / 100}&service_type=${payloadData['vasData'].service_type}&plan=${payloadData['vasData'].plan}&agentId=${process.env.AGENT_ID}&agentReference=${refrenceId}` };

        if (url.includes('fundtransfer')) return 'fundtransfer';

        if (url.includes('data')) return { 'data': 'data', 'url': `${process.env.DATA_URL}?phone=${payloadData['vasData'].phone}&amount=${(payloadData['amount']) / 100}&service_type=${payloadData['vasData'].service_type}&datacode=${payloadData['vasData'].datacode}&agentId=${process.env.AGENT_ID}&agentReference=${refrenceId}` };

        if (url.includes('electricity'))
            return {
                'electricity': "electricity", 'url': `${process.env.ELETRICITY_URL}`,
                body: {
                    "account_number": `${payloadData['vasData'].account_number}`,
                    "amount": payloadData['amount'] / 100,
                    "phone": payloadData['vasData'].phone,
                    "service_type": payloadData['vasData'].service_type,
                    "agentId": process.env.AGENT_ID,
                    "agentReference": refrenceId
                }
            };

        if (url.includes('utility')) return 'utility';

        if (url.includes('cabletv/subscription'))
            return {
                'cabletv': "cabletv",
                'url': `${process.env.CABLETV_URL_SUB}?smartcard_number=${payloadData.smart_card}&total_amount=${payloadData.total_amount}&product_code=${payloadData.product_code}&product_monthsPaidFor=${payloadData.product_monthsPaidFor}&addon_code=${payloadData.addon_code}&addon_monthsPaidFor=${payloadData.addon_monthsPaidFor}&service_type=${payloadData.service_type}&agentId=${process.env.AGENT_ID}&agentReference=${refrenceId}`
            };


        if (url.includes('cabletv')) return {
            'cabletv': "cabletv",
            'url': `${process.env.CABLETV_URL}`
        };

        return false;

    }

    static getVasLookUp(url: any, payloadData: any) {


        if (url.includes('airtimevtu')) return {
            'airtimevtu': 'airtimevtu',
            'method': "GET",
            'url': `${process.env.AIRTIME_URL_LOOKUP}`
        };

        if (url.includes('fundtransfer')) return 'fundtransfer';

        if (url.includes('data/provider')) return {
            'data': 'data',
            'method': "GET",
            'url': `${process.env.DATA_URL_LOOKUP_PROVIDER}?service_type=${payloadData.service_type}`
        };


        if (url.includes('data/databundles')) return {
            'data': 'data',
            'method': "POST",
            'url': `${process.env.DATA_URL_LOOKUP_BUNDLE}?service_type=${payloadData.service_type}`
        };

        if (url.includes('electricity/biller'))
            return {
                'electricity': "electricity",
                "method": "GET",
                'url': `${process.env.ELETRICITY_URL_LOOKUP_BILLER}`,
            };

        if (url.includes('electricity/verify'))
            return {
                'electricity': "electricity",
                "method": "POST",
                'url': `${process.env.ELETRICITY_URL_LOOKUP_VERIFY}`,
                body: {
                    "service_type": payloadData.service_type,
                    "account_number": payloadData.account_number
                }
            };

        if (url.includes('utility')) return 'utility';

        if (url.includes('cabletv/provider')) return {
            'cabletv': "cabletv",
            "method": "GET",
            'url': `${process.env.CABLETV_URL_LOOKUP_PROVIDER}`
        };

        if (url.includes('cabletv/multichoice')) return {
            'cabletv': "cabletv",
            "method": "POST",
            'url': `${process.env.CABLETV_URL_LOOKUP_MULTI}?service_type=${payloadData.service_type}`
        };

        if (url.includes('cabletv/nameenquiry')) return {
            'cabletv': "cabletv",
            "method": "POST",
            'url': `${process.env.CABLETV_URL_LOOKUP_NAMEENQUIRY}?service_type=${payloadData.service_type}`
        };
        if (url.includes('cabletv/addon')) return {
            'cabletv': "cabletv",
            'url': `${process.env.CABLETV_URL_LOOKUP_ADDON}`
        };

        return false;

    }


    static getTransProduct(url: string) {

        if (url.includes('purchase')) return '1';

        if (url.includes('cashadvance')) return '45';

        if (url.includes('refund')) return '5';

        if (url.includes('reversal')) return '4';

        if (url.includes('balance')) return '7';

        if (url.includes('preauth')) return '33';
        if (url.includes('salescompletion')) return '34';

        return false;

    }

    static getMaskPan(pan: string) {
        const totalLength = pan.length;
        const firstSix = pan.substr(0, 6);
        const lastFour = pan.substr(totalLength - 4, totalLength);
        const maskPart = totalLength - 10;
        const mask = "*".repeat(maskPart);
        return `${firstSix}${mask}${lastFour}`;

    }

    /**
     * 
     * @param terminalId 
     * @param data 
     * @returns 
     */
    static fileDataLogger(terminalId, data) {
        let enable = process.env.file_log;
        if (enable != "true") return;

        let filesPath = path.join(`mw-logs/${moment().format("YYYY-MM-DD")}`, terminalId + `-logfile.log`);
        let pathDir = path.dirname(filesPath);
        if (fs.existsSync(pathDir) == false) {
            console.log("fikle  not exists create", pathDir);

            fs.mkdirSync(pathDir)
        } else {
            // let logger = SimpleNodeLogger.createSimpleLogger({
            //     logFilePath: filesPath,
            //     timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
            // });


            // logger.log('info', data);
        }


    }


}

export default Utils;