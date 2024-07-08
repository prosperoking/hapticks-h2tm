import { Request, Response } from "express";
import GroupTidModel from "../../db/models/groupTid.model";
import TerminalModel from "../../db/models/terminal.model";
import logger from "../../helpers/logger";
import pick from "lodash/pick";
import { Groupkeyexchange } from "../../queue/queue";
import { TransactionTypes, sendSocketMessage } from "../../helpers/cardsockethelper";

export async function getGroupedTids(req: Request, res: Response) {
  try {
    const groupedTids = await GroupTidModel.paginate(
      {
        //@ts-ignore
        organisationId: req.user._id,
      },
      {
        select: "_id terminalId",
      }
    );
    res.json(groupedTids);
  } catch (error) {
    logger.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}

export async function triggerKeyExchangeOnGroupTid(
  req: Request,
  res: Response
) {
  try {
    const groupTid = await GroupTidModel.findOne({
      //@ts-ignore
      organisationId: req.user._id,
      _id: req.params.id,
    }).populate('profile');
    if (!groupTid) {
      return res.status(400).json({ message: "GroupTid not found" });
    }
    const profile = groupTid.profile;
    try {
        let result = await sendSocketMessage(TransactionTypes.KEY_EXCHANGE, {
            tid: groupTid.terminalId,
            component: profile.componentKey1,
            ip: profile.isoHost,
            ssl: String(profile.isSSL),
            port: profile.isoPort
        });

        console.log("", result);

        if (!result?.status)  throw Error(result.message);

        const { data } = result;
        groupTid.encmasterkey = data.encmasterkey;
        groupTid.encpinkey = data.encpinkey;
        groupTid.encsesskey = data.encsesskey;
        groupTid.clrmasterkey = data.clrmasterkey;
        groupTid.clrsesskey = data.clrsesskey;
        groupTid.clrpinkey = data.clrpinkey;
        groupTid.paramdownload = data.paramdownload;
        await groupTid.save();
    } catch (e) {
      return res.status(400).json({
        message: "Key exchange failed",
      });
    }

    res.json({
      message: "GroupTid key exchange triggered",
    });
  } catch (error) {
    logger.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}

export async function terminalIds(req: Request, res: Response) {
  try {
    const terminals = await TerminalModel.paginate(
      {
        //@ts-ignore
        organisationId: req.user._id,
      },
      {
        select: "_id terminalId",
      }
    );
    res.json(terminals);
  } catch (error) {
    logger.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const terminals = await TerminalModel.findOne({
      //@ts-ignore
      organisationId: req.user._id,
      _id: req.params.id,
    });
    res.json(terminals);
  } catch (error) {
    logger.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}

export async function getByTid(req: Request, res: Response) {
  try {
    const data = await TerminalModel.findOne({
      //@ts-ignore
      organisationId: req.user._id,
      terminalId: req.params.tid,
    }).exec();
    res.json({ status: data !== null, data });
  } catch (error) {
    logger.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}

export async function updateTermial(req: Request, res: Response) {
  try {
    let terminal = await TerminalModel.findOne({
      //@ts-ignore
      organisationId: req.user._id,
      _id: req.params.id,
    });
    if (!terminal || terminal == null) {
      return res.status(400).json({ message: "No data found!" });
    }

    const data = await terminal.update(
      pick(req.body, [
        "serialNo",
        "terminalId",
        "profileId",
        "iswTid",
        "iswUniqueId",
        "threeLineTid",
        "brand",
        "deviceModel",
        "iswISOTID",
        "hydrogenTID",
        "terminalLocation",
        "terminalGroupId",
      ])
    );
    terminal = await TerminalModel.findOne({
      //@ts-ignore
      organisationId: req.user._id,
      _id: req.params.id,
    });
    res.json({ status: true, data: terminal });
  } catch (error) {
    logger.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}

export async function createTerminal(request: Request, response: Response) {
  try {
    const data = await TerminalModel.create({
      ...request.body,
      //@ts-ignore
      organisationId: request.user._id,
    });

    response.json({ status: true, data });
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: error.message });
  }
}

export async function deleteTerminal(request: Request, response: Response) {
  try {
    const data = await TerminalModel.deleteOne({
      _id: request.params.id,
      //@ts-ignore
      organisationId: request.user._id,
    });

    response.json({ status: true, data });
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: error.message });
  }
}
