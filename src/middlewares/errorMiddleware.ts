import { NextFunction, Request, Response } from "express"
import { CustomError } from "../errors/CustomError"

export const ErrorHandlingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof CustomError) {
        const {statusCode, errors, logging} = err;
        if(logging) {
            console.error(JSON.stringify({
                code: err.statusCode,
                errors: err.errors,
                stack: err.stack
            }, null, 2));
        }

        return res.status(statusCode).send({errors});
    }

    console.error(JSON.stringify(err, null, 2));
    return res.status(500).send({message: "Something went wrong."});
}