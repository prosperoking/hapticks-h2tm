import { Request, Response } from "express";
import PtspProfile from "../../db/models/ptspProfile.model";
import logger from "../../helpers/logger";

export async function index(req: Request, res: Response) {
  try {
    const profiles = await PtspProfile.paginate(
        {organisationId: req.user?._id},
        {
            select:  '_id name',
            limit: 50,
        });

      return res.json(profiles);
  } catch (error) {
      logger.error(error)
      res.status(400).json({message: "Something went wrong"})
  }
}