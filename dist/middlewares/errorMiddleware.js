"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlingMiddleware = void 0;
const CustomError_1 = require("../errors/CustomError");
const ErrorHandlingMiddleware = (err, req, res, next) => {
    if (err instanceof CustomError_1.CustomError) {
        const { statusCode, errors, logging } = err;
        if (logging) {
            console.error(JSON.stringify({
                code: err.statusCode,
                errors: err.errors,
                stack: err.stack
            }, null, 2));
        }
        return res.status(statusCode).send({ errors });
    }
    //console.error(JSON.stringify(err, null, 2));
    return res.status(500).send({ message: "Something went wrong." });
};
exports.ErrorHandlingMiddleware = ErrorHandlingMiddleware;
