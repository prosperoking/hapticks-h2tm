import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ValidationChain, validationResult } from "express-validator";

type HandlerSchema = ValidationChain[] & { run: (req: Request) => Promise<any[]>; }
type Handler = (req: Request) => Promise<any[]>
export function createValidatedRequest(validator: HandlerSchema | Handler): RequestHandler[] {
    const handleRequest = (req: Request,res: Response,next: NextFunction)=>{
        const result = validationResult(req);
        if(!result.isEmpty()) {
            return res.status(412).json({
                // @ts-ignore
                errors: result.array().reduce((acc,err)=>({...acc,[err.param?? err.path]:[...(acc[err.param ?? err.path]||[]), err.msg]}),{}),
                message: "Invalid Data"
            });
        }
        next()
    }
    return [ (validator as  (req: Request) => Promise<any[]>), handleRequest]
}