"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (email, html, subject) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT, 10),
            secure: false,
            // auth: {
            //     user: process.env.MAIL_USER,
            //     pass: process.env.MAIL_PASS
            // }
        });
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            html: html
        });
        console.log("email sent!");
    }
    catch (error) {
        console.error(error.message);
    }
};
exports.sendEmail = sendEmail;
