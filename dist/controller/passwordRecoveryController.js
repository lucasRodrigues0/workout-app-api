"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.resetPassword = exports.forgotPassword = void 0;
const BadRequestError_1 = __importDefault(require("../errors/BadRequestError"));
const ForgotPassword_1 = require("../model/ForgotPassword");
const User_1 = require("../model/User");
const sendEmail_1 = require("../utils/sendEmail");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const token = Math.random().toString(20).substring(2, 12);
    const user = await User_1.User.findOne({ email: email });
    if (!user) {
        throw new BadRequestError_1.default({ code: 400, message: "Email not found!" });
    }
    const tokenAlreadyCreated = await ForgotPassword_1.ForgotPassword.findOne({ email: email });
    if (tokenAlreadyCreated) {
        await ForgotPassword_1.ForgotPassword.deleteOne({ email: email });
    }
    const data = await ForgotPassword_1.ForgotPassword.create({ token: token, email: email });
    const subject = "Recuperação de senha";
    const html = `Você solicitou a troca da senha. <a href="${process.env.BASE_URL}/reset-password/${token}">Clique aqui</a> para concluir a alteração`;
    (0, sendEmail_1.sendEmail)(email, html, subject);
    return res.status(200).send({ message: token });
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    const { token, password, passwordConfirm } = req.body;
    const getToken = await ForgotPassword_1.ForgotPassword.findOne({ token: token });
    if (!getToken) {
        throw new BadRequestError_1.default({ code: 400, message: "Invalid link!" });
    }
    const user = User_1.User.findOne({ email: getToken.email });
    if (!user) {
        throw new BadRequestError_1.default({ code: 400, message: "Invalid Email!" });
    }
    if (password.length < 5) {
        throw new BadRequestError_1.default({ code: 400, message: "password must have at least 5 characters" });
    }
    if (typeof (password) !== 'string')
        return;
    const obj = { uppercase: 0, lowercase: 0, number: 0, special: 0 };
    password.trim().split('').forEach(element => {
        /[A-Z]/g.test(element) ? ++obj.uppercase :
            /[a-z]/g.test(element) ? ++obj.lowercase :
                /[0-9]/g.test(element) ? ++obj.number :
                    ++obj.special;
    });
    if (obj.uppercase === 0) {
        throw new BadRequestError_1.default({ code: 400, message: "password must have at least one uppercase character" });
    }
    if (obj.lowercase === 0) {
        throw new BadRequestError_1.default({ code: 400, message: "password must have at least one lowercase character" });
    }
    if (obj.number === 0) {
        throw new BadRequestError_1.default({ code: 400, message: "password must have at least one number" });
    }
    if (obj.special === 0) {
        throw new BadRequestError_1.default({ code: 400, message: "password must have at least one special character" });
    }
    const invalidCharacters = /[ç;:?ãõáéíóúâêôûªº~^´`à/]/gm.test(password);
    if (invalidCharacters) {
        throw new BadRequestError_1.default({ code: 400, message: "password contains invalid characters" });
    }
    if (password !== passwordConfirm) {
        throw new BadRequestError_1.default({ code: 400, message: "Passwords do not match hei hei hei" });
    }
    const updatedPassword = {
        password: await bcryptjs_1.default.hash(password, 12)
    };
    await user.updateOne(updatedPassword);
    await ForgotPassword_1.ForgotPassword.deleteOne({ token: token });
    return res.status(200).send({ message: "Success!" });
};
exports.resetPassword = resetPassword;
const checkToken = async (req, res, next) => {
    const { token } = req.params;
    const response = await ForgotPassword_1.ForgotPassword.findOne({ token: token });
    if (!response) {
        return res.status(200).send({ valid: false });
    }
    return res.status(200).send({ valid: true });
};
exports.checkToken = checkToken;
