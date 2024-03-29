import { Request, Response } from 'express';
import  moment from 'moment';
import logger from '../helpers/logger';
import OrganisationModel from '../db/models/organisation.model';


export async function getOrganisations(req: Request, res: Response) {
    try {
        const organisations = await OrganisationModel.paginate({
            ...filterGen(req.query),
        },{
            sort: {name: -1},
            limit: Number(req.query.limit || 50),
            page: Number(req.query.page || 1),
            populate: [
                { path: 'users_count' },
                { path: 'terminals_count' },
                { path: 'transactions_count' },
            ]
        });

        return res.json(organisations)
    } catch (error) {
        logger.error(error.message);
        res.status(400).json({
            message: "An error occured"
        })
    }
}

export async function getAllOrganisations(req: Request, res: Response) {
    try {

        const data = await OrganisationModel.find(filterGen(req.query)).select('name');

        return res.json({data})
    } catch (error) {
        logger.error(error.message);
        res.status(400).json({
            message: "An error occured"
        })
    }
}

export async function create(req: Request, res: Response) {
    try {
        const {body} = req
        const organisation = await (new OrganisationModel(body)).save();

        return res.json(organisation)
    } catch (error) {
        logger.error(error.message);
        res.status(400).json({
            message: "An error occured"
        })
    }
}

export async function update(req: Request, res: Response) {
    try {
        const {body} = req
        const organisation = await OrganisationModel.findById(req.params.id);

        if(!organisation) return res.status(404).json({message: "Organisation not found"})
        organisation.name = body.name;
        organisation.save()

        return res.json(organisation)
    } catch (error) {
        logger.error(error.message);
        res.status(400).json({
            message: "An error occured"
        })
    }
}

export async function destroy(req: Request, res: Response) {
    try {
        const organisation = await OrganisationModel.findById(req.params.id);

        if(!organisation) return res.status(404).json({message: "Organisation not found"})
        organisation.delete();

        return res.json(organisation)
    } catch (error) {
        logger.error(error.message);
        res.status(400).json({
            message: "An error occured"
        })
    }
}


function filterGen({q}: any) {
    let query = {};
    if(q !== undefined) {
        query = {
            ...query,
            $or: [
                {
                    name: RegExp(`^${q}`,'i'),
                },
            ]
        }
    }

    return query
}