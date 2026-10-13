import { Job, Worker, QueueScheduler } from "bullmq";
import { webhookQueue } from '../queue';
import axios, { AxiosResponse } from 'axios';
import { IWebhookRequest } from '../../db/models/webhook_request.model';
import appConfig, { AppConfig } from '../../config/config';
import { ObjectId } from 'mongoose';
import TransactionModel from "../../db/models/transaction.model";
import WebhookModel from "../../db/models/webhook.model";
import OrganisationModel from "../../db/models/organisation.model";
import WebhookRequestModel from "../../db/models/webhook_request.model";
import { createSha256Hash, createDigest } from '../../helpers/crypt';
import { AxiosError } from 'axios';

const config: AppConfig = (new appConfig()).getConfig('');

const connection = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
};

interface WebhookJobData {
    tranactionId: ObjectId,
    webhookId: ObjectId,
    organisationId: ObjectId,
    url: string,
    retry?: boolean,
}
export const webhookWorker = new Worker<IWebhookRequest>('webhook',
async (job: Job) => {
    const data: WebhookJobData = job.data;
    const journal = await TransactionModel.findById(data.tranactionId);
    const webhook = await WebhookModel.findById(data.webhookId);
    const organisation = await OrganisationModel.findById(data.organisationId);
    if(!webhook || !journal) return;
    const payloadObject = {
         MTI: journal.MTI,
         amount: journal.amount / 100,
         terminalId: journal.terminalId,
         responseCode: journal.responseCode?.length? journal.responseCode: '06',
         responseDescription: journal.responseDescription,
         PAN: journal.PAN,
         STAN: journal.STAN ,
         reversalSent: journal.reversal,
         processor: journal.processor,
         authCode: journal.authCode,
         transactionTime: journal.transactionTime,
         reversal: false,
         cardHolderName: journal.cardHolderName,
         cardIssuerName: journal.issuer,
         merchantId: journal.merchantId,
         merchantName: journal.merchantName,
         merchantAddress: journal.merchantAddress,
         cardExpiration: journal.cardExpiration,
         rrn: journal.rrn,
         metaData: journal.webhookData,
         geolocation: journal.geolocation,
    };

    const verifyString = createSha256Hash(JSON.stringify(payloadObject));
    //@ts-ignore
    const signature = createDigest(webhook.secret, verifyString);
    let response: AxiosResponse<unknown, any, {}> | null = null;
    let isSuccess = false;
    try {
        response = await axios.post(data.url, payloadObject, {
            headers:{
                'x-verify-string': verifyString,
                'x-signature': signature,
            }
        })
        isSuccess = true;
    } catch (error) {
        if(!error.isAxiosError){
           throw error
        }
        response = (error as AxiosError).response
    }

    const webhookRequest =  WebhookRequestModel.create({
        journalId: journal.id,
        payload: payloadObject,
        webhookId: webhook.id,
        organisationId: data.organisationId,
        responseCode: response!!.status,
        responseType: response!!.headers['content-type'],
        responseBody: response!!.headers['content-type'] === 'application/json'? JSON.stringify(response!!.data): response!!.data,
        status: isSuccess ? 'success': 'fail',
        isRetry: data.retry ??  false,
        terminalId: journal.terminalId,
        verifyString,
        verifySignature: signature,
        url: data.url
    });

    if(!isSuccess) {
        throw new Error(response?.statusText);
    }
    return true;
},{
    autorun: false,
    limiter:{
        max: 10,
        duration: 1000 * 60,
        groupKey: 'url'
    },
    connection
})

export const webhookWorkerScheduler = new QueueScheduler('webhook', {connection});

export default webhookWorker;