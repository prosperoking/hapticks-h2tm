import { checkSchema, ValidatorsSchema } from "express-validator/src/middlewares/schema";
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ValidationChain, validationResult } from "express-validator";
import { ResultWithContext } from "express-validator/src/chain";

type HandlerSchema = ValidationChain[] & { run: (req: Request) => Promise<ResultWithContext[]>; }
type Handler = (req: Request) => Promise<ResultWithContext[]>
export function createValidatedRequest(validator: HandlerSchema | Handler): RequestHandler[] {
    const handleRequest = (req: Request,res: Response,next: NextFunction)=>{
        const result = validationResult(req);
        if(!result.isEmpty()) {
            return res.status(412).json({
                errors: result.array().reduce((acc,err)=>({...acc,[err.param]:[...(acc[err.param]||[]), err.msg]}),{}),
                message: "Invalid Data"
            });
        }
        next()
    }
    return [ (validator as  (req: Request) => Promise<ResultWithContext[]>), handleRequest]
}