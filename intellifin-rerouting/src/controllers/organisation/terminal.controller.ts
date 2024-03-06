import { Request, Response } from "express";
import GroupTidModel from "../../db/models/groupTid.model";
import TerminalModel from "../../db/models/groupTid.model";
import logger from "../../helpers/logger";
import { pick } from "lodash-es";

export async function getGroupedTids(req: Request, res: Response) {
    try{
        const groupedTids = await GroupTidModel.paginate({
            organisationId: req.user._id
        }, {
            select: "_id terminalId"
        })
        res.json(groupedTids)
    }catch (error){
        logger.error(error)
        res.status(400).json({message:"Something went wrong"})
    }
}

export async function terminalIds(req: Request, res: Response) {
    try{
        const terminals = await TerminalModel.paginate({
            organisationId: req.user._id
        }, {
            select: "_id terminalId"
        })
        res.json(terminals)
    }catch (error){
        logger.error(error)
        res.status(400).json({message:"Something went wrong"})
    }
}

export async function getById(req: Request, res: Response) {
    try{
        const terminals = await TerminalModel.findOne({
            organisationId: req.user._id,
            _id: req.params.id,
        })
        res.json(terminals)
    }catch (error){
        logger.error(error)
        res.status(400).json({message:"Something went wrong"})
    }
}

export async function getByTid(req: Request, res: Response) {
    try{
        const terminals = await TerminalModel.findOne({
            organisationId: req.user._id,
            terminalId: req.params.tid,
        })
        res.json(terminals)
    }catch (error){
        logger.error(error)
        res.status(400).json({message:"Something went wrong"})
    }
}

export async function updateTermial(req: Request, res: Response) {
    try{
        const terminal = await TerminalModel.findOne({
            organisationId: req.user._id,
            _id: req.params.id,
        })
        if(!terminal || terminal == null ){
            return  res.status(400).json({ message: "No data found!" });
        }

        const data = await terminal.update(pick(req.body,[
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
            "terminalGroupId"
        ]));

        res.json({status: true, data: terminal})
    }catch (error){
        logger.error(error)
        res.status(400).json({message:"Something went wrong"})
    }
}


export  async function createTerminal(request: Request, response: Response) {
    try {
        const data = await TerminalModel.create({
            ...request.body,
            organisationId: request.user._id
        });

        response.json({status: true, data})
    } catch (error) {
        console.log(error)
        response.status(400).json({message: error.message})
    }
}

export  async function deleteTerminal(request: Request, response: Response) {
    try {
        const data = await TerminalModel.deleteOne({
            ...request.params.id,
            organisationId: request.user._id
        });

        response.json({status: true, data})
    } catch (error) {
        console.log(error)
        response.status(400).json({message: error.message})
    }
}