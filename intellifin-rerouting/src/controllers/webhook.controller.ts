import webhookModel, { IWebhook, IWebhookData } from "../db/models/webhook.model";
import webhookRequestModel from "../db/models/webhook_request.model";
import { Request, Response } from 'express';
import logger from '../helpers/logger';
import { createSha256Hash } from '../helpers/crypt';
import { randomUUID } from "crypto";
import { IUserData } from '../db/models/user.model';
import  _  from "lodash";
import IsoCardContoller from "./iso_card.controller";
import { webhookQueue } from '../queue/queue';

export async function getWebhooks(req: Request, res: Response){
    try {
        // @ts-ignore
        const orgFilter = [null, undefined].includes(req.user?.organisation_id) ? {
            ...  req.query?.organisationId?.length ? { organisationId: req.query?.organisationId }: {} ,
        }:
        //@ts-ingore
        {organisationId: (req.user as IUserData).organisation_id};
        const webhooks = await webhookModel.paginate({
            ...filterGen(req.query),
            ... orgFilter,
        },{
            sort: {name: -1},
            limit: Number(req.query.limit || 50),
            page: Number(req.query.page || 1),
            populate: [
                // { path: 'organisation', select: 'name',  foreignField:"_id", localField:"organisationId", },
                // { path: 'request_count', model: webhookRequestModel, localField: '_id', foreignField: 'webhookId', count: true },
            ]
        });

        return res.json(webhooks)
    } catch (error) {
        logger.error(error.message);
        res.status(400).json({
            message: "An error occured"
        })
    }
}

export async function createWebhook(req: Request, res: Response){
    try {
        const secret = req.body.secret ?? createSha256Hash(randomUUID());
        const webhook = await webhookModel.create({
            ...req.body,
            secret,
            urls:  Array.from(new Set(
                (req.body.urls ?? [])
                .filter((url)=> url?.length)
                .map(url=>url.toLowerCase())
            ))
        });
        return res.json(webhook)
    } catch (error) {
        logger.error(error.message)
        return res.status(400).json({
            message: "Secret recreation failed",
        })
    }
}

export async function updateWebhook(req: Request, res: Response){
    try {
        /**@var {IWebhook & IWebhookData} webhook */
        const webhook = await webhookModel.findById(req.params.id);
        if(!webhook) return res.status(404).json({
            message: "webhook not found"
        })

        const {urls, name } = req.body;
        //@ts-ignore
        webhook.urls = Array.from(new Set(
            urls
            .filter((url)=> url?.length)
            .map(url=>url.toLowerCase())
        ));
        //@ts-ignore
        webhook.name = name;
        await webhook.save();
        res.json(webhook);
    } catch (error) {
        logger.error(error.message)
        return res.status(400).json({
            message: "Webhook Update failed",
        })
    }
}

export async function reCreateSecret(req: Request, res: Response) {
    try {
        const webhook = await webhookModel.findById(req.params.id);
        if(!webhook) return res.status(404).json({
            message: "webhook not found"
        })
        //@ts-ignore
        webhook.secret = req.body.secret ?? createSha256Hash( randomUUID())
        await webhook.save()
        return res.json(webhook)
    } catch (error) {
        logger.error(error.message)
        return res.status(400).json({
            message: "Secret recreation failed",
        })
    }
}

export async function deleteWebhook(req: Request, res: Response){
    try {
        const webhook = await webhookModel.findById(req.params.id);
        if(!webhook) return res.status(404).json({
            message: "webhook not found"
        })

        await webhook.deleteOne();

        return res.json({
            message: "Webhook deleted",
        })
    } catch (error) {
        logger.error(error.message)
        return res.status(400).json({
            message: "Webhook deletion Failed",
        })
    }
}

export async function webhookRequests(req: Request, res: Response) {
    try {
        // @ts-ignore
        const orgFilter = [null, undefined].includes(req.user?.organisation_id) ? {
            organisationId: req.query.organisationId ?? undefined,
        }:

        {organisationId: (req.user as IUserData).organisation_id};
        const webhookRequests = await webhookRequestModel.paginate({
            ...filterRequest(req.query),
            ... _.omitBy(orgFilter, _.isUndefined),
        },{
            sort: {_id: -1},
            limit: Number(req.query.limit || 50),
            page: Number(req.query.page || 1),
            populate: [
                { path: 'organisation', select: 'name', foreignField:"_id", localField:"organisationId", },
                { path: 'webhook', model: webhookModel, foreignField:"_id", localField:"webhookId", },
            ]
        });

        return res.json(webhookRequests)
    } catch (error) {
        logger.error(error.message)
        return res.status(400).json({
            message: "Webhook deletion Failed",
        })
    }
}

export async function retryWebhook(req: Request, res: Response) {
    try {

        const webhookRequest = await webhookRequestModel.findById(req.params.id);
        if(!webhookRequest) return res.status(404).json({
            mesage: "Webhook Request Not found"
        })
        await webhookQueue.add('sendNotification',{
            tranactionId: webhookRequest.journalId,
            webhookId: webhookRequest.webhookId,
            organisationId: webhookRequest.organisationId,
            retry: true,
            url: webhookRequest.url,
        }, {
            attempts: 5,
            backoff: {
            type: "exponential",
            delay: 1000 * 5
            }
        })
        return res.json(webhookRequests)
    } catch (error) {
        logger.error(error.message)
        return res.status(400).json({
            message: "Webhook deletion Failed",
        })
    }
}

function filterGen({q}: any) {
    let query = {};
    if(q?.length) {
        query = {
            ...query,
            $or: [
                {
                    name: RegExp(`^${q}`,'i'),
                },
                {
                    url: RegExp(`^${q}`,'i'),
                },
            ]
        }
    }

    return query
}

function filterRequest({q, organisation, webhook}: any) {
    let query = {};
    if(q?.length) {
        query = {
            ...query,
            $or: [
                {
                    terminalId: RegExp(`^${q}`,'i'),
                },
                {
                    "payload.merchantName":  RegExp(`^${q}`,'i'),

                },
            ]
        }
    }

    if(webhook?.length) {
        query = {
            ...query,
            webhookId: organisation
        }
    }

    return query
}