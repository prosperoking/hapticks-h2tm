import { Job, Worker, QueueScheduler } from "bullmq";
import { webhookQueue } from '../queue';
import axios from 'axios';
import { IWebhookRequest } from '../../db/models/webhook_request.model';
import appConfig, { AppConfig } from '../../config/config';

const config: AppConfig = (new appConfig()).getConfig('');

const connection = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
};


export const webhookWorker = new Worker<IWebhookRequest>('webhook',async (job: Job) => {
    
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