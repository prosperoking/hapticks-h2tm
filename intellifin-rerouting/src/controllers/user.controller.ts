import userModel from "../db/models/user.model";
import { Request, Response } from "express";
import logger from "../helpers/logger";
import { createSha256Hash } from "../helpers/crypt";
import { randomUUID } from "crypto";
import { IUserData } from "../db/models/user.model";
import _ from "lodash";

export async function index(req: Request, res: Response) {
  try {
    // @ts-ignore
    const orgFilter = req.user?.organisationId === null
        ? {
            organisationId: req.query.organisationId,
          }
        : //@ts-ingore
          { organisationId: (req.user as IUserData).organisation_id };
    const webhooks = await userModel.paginate(
      {
        ...filterGen(req.query),
        ...orgFilter,
      },
      {
        sort: { name: -1 },
        limit: Number(req.query.limit || 50),
        page: Number(req.query.page || 1),
        populate: [{ path: "organisation", select: "name" }],
      }
    );

    return res.json(webhooks);
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      message: "An error occured",
    });
  }
}


export async function updateUser(req: Request, res: Response) {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user)
      return res.status(404).json({
        message: "webhook not found",
      });

    const { url, name } = req.body;
    // user.url = url;
    user.email = name;
    await user.save();
    res.json(user);
  } catch (error) {
    logger.error(error.message);
    return res.status(400).json({
      message: "Webhook Update failed",
    });
  }
}


export async function deleteUser(req: Request, res: Response) {
  try {
    const webhook = await userModel.findById(req.params.id);
    if (!webhook)
      return res.status(404).json({
        message: "webhook not found",
      });

    await webhook.delete();

    return res.json({
      message: "Webhook deleted",
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(400).json({
      message: "Webhook deletion Failed",
    });
  }
}


function filterGen({ q }: any) {
  let query = {};
  if (q !== undefined) {
    query = {
      ...query,
      $or: [
        {
          name: RegExp(`^${q}`, "i"),
        },
        {
          username: RegExp(`^${q}`, "i"),
        },
        {
          email: RegExp(`^${q}`, "i"),
        },
      ],
    };
  }

  return query;
}

function filterRequest({ q, organisation, webhook }: any) {
  let query = {};
  if (q !== undefined) {
    query = {
      ...query,
      $or: [
        {
          terminalId: RegExp(`^${q}`, "i"),
        },
        {
          "payload.merchantName": RegExp(`^${q}`, "i"),
        },
      ],
    };
  }

  if (webhook?.length) {
    query = {
      ...query,
      webhookId: organisation,
    };
  }

  return query;
}
