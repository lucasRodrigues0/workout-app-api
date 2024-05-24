"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPassword = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ForgotPasswordSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
});
exports.ForgotPassword = mongoose_1.default.model('fgPasswords', ForgotPasswordSchema);
