"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = require("./CustomError");
class BadRequestError extends CustomError_1.CustomError {
    constructor(params) {
        const { code, message, logging } = params || {};
        super(message || "Bad Request");
        this._code = code || BadRequestError._statusCode;
        this._logging = logging || false;
        this._context = params?.context || {};
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    get errors() {
        return [{ message: this.message, context: this._context }];
    }
    get statusCode() {
        return this._code;
    }
    get logging() {
        return this._logging;
    }
}
BadRequestError._statusCode = 400;
exports.default = BadRequestError;
