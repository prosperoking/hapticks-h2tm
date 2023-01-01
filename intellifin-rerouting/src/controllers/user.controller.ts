import userModel from "../db/models/user.model";
import { Request, Response } from "express";
import logger from "../helpers/logger";
import { createSha256Hash } from "../helpers/crypt";
import { randomUUID } from "crypto";
import { IUserData } from "../db/models/user.model";
import _ from "lodash";
import { APP_PERMISSIONS } from '../config/permissions';

export async function index(req: Request, res: Response) {
  try {
    // @ts-ignore
    const orgFilter = req.user?.organisationId === null
        ? {
            organisation_id: req.query.organisationId,
          }
        : //@ts-ingore
          { organisation_id: (req.user as IUserData).organisation_id };
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


export async function addUser(req: Request, res: Response) {
  try {
    const {body} = req;
    // @ts-ignore
    const orgFilter = req.user?.organisation_id === null
        ? {
            organisation_id: req.query.organisation_id,
          }
        : //@ts-ingore
          { organisationId: (req.user as IUserData).organisation_id };
    const user = userModel.create({...body, ...orgFilter});
    
    return res.json(user);
  } catch (error) {
    logger.error(error.message);
    return res.status(400).json({
      message: "failed to create user",
    });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    // @ts-ignore
    const orgFilter = req.user?.organisationId === null
        ? {
            organisationId: req.query.organisationId,
          }
        : //@ts-ingore
          { organisationId: (req.user as IUserData).organisation_id };
    const user = await userModel.findOne({_id: req.params.id, ...orgFilter});
    if (!user)
      return res.status(404).json({
        message: "webhook not found",
      });

    const { name, organisation_id } = req.body;
    user.organisation_id = organisation_id;

    user.fullname = name;
    await user.save();
    res.json(user);
  } catch (error) {
    logger.error(error.message);
    return res.status(400).json({
      message: "user Update failed",
    });
  }
}


export function getAllPermissions(req: Request, res: Response) {
  return res.json({
    data: APP_PERMISSIONS
  });
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const webhook = await userModel.findById(req.params.id);
    if (!webhook)
      return res.status(404).json({
        message: "user not found",
      });

    await webhook.delete();

    return res.json({
      message: "user deleted",
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(400).json({
      message: "user deletion Failed",
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
