import { Queue, Worker } from 'bullmq';
import logger from '../helpers/logger';
import appConfig, { AppConfig } from '../config/config';
import {keyExchangeWorker, GroupKeyExchangeWorker, RotateKeysWorker} from './processors/keyexchange';
import webhookWorker from './processors/webhook';
import { Application } from 'express';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const config: AppConfig = (new appConfig()).getConfig('');

const connection = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
};

const workers = [
    keyExchangeWorker,
    webhookWorker,
    GroupKeyExchangeWorker,
    RotateKeysWorker,
];

export const webhookQueue = new Queue('webhook', {  connection })

export const keyExchange = new Queue('keyexchange', { connection });
export const Groupkeyexchange = new Queue('groupkeyexchange', { connection });
export const RotateKeys = new Queue('rotateKeys', { connection });

export const bullQueues = [
    webhookQueue,
    keyExchange,
    Groupkeyexchange,
    RotateKeys,
];

export const startQueWorkers = async () =>{
    logger.log({message: "Starting Queues"})
    try {
        Promise.all(workers.map(worker=>worker.run()));
        logger.log({message: "QueWorkers started"})
    } catch (error) {
        logger.error({message: "QueWorkers Failed to start", error})
    }
}

export const registerQueueDashBoard =  (app: Application, path:string = '/admin/queue') => {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath(path);

    createBullBoard({
        queues: bullQueues.map(queue=>new BullMQAdapter(queue)),
        serverAdapter
    });

    return serverAdapter.getRouter()
}

