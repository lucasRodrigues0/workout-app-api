import { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/BadRequestError";
import { ForgotPassword } from "../model/ForgotPassword";
import { User } from "../model/User";
import { sendEmail } from "../utils/sendEmail";
import bcryptjs from 'bcryptjs';

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {

    const { email } = req.body;

    const token = Math.random().toString(20).substring(2, 12);

    const user = await User.findOne({email: email});
    
    if(!user) {
        throw new BadRequestError({code: 400, message: "Email not found!"});
    }

    const tokenAlreadyCreated = await ForgotPassword.findOne({email: email});

    if(tokenAlreadyCreated) {
        await ForgotPassword.deleteOne({email: email});
    }

    const data = await ForgotPassword.create({token: token, email: email});

    const subject: string = "Recuperação de senha";
    const html: string = `Você solicitou a troca da senha. <a href="${process.env.BASE_URL}/reset-password/${token}">Clique aqui</a> para concluir a alteração`;

    sendEmail(email, html, subject);

    return res.status(200).send({message: token});
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {

    const { token, password, passwordConfirm } = req.body;

    const getToken = await ForgotPassword.findOne({token: token});

    if(!getToken) {
        throw new BadRequestError({code: 400, message: "Invalid link!"});
    }

    const user = User.findOne({email: getToken.email});

    if(!user) {
        throw new BadRequestError({code: 400, message: "Invalid Email!"});
    }

    if(password.length < 5) {
        throw new BadRequestError({code: 400, message: "password must have at least 5 characters"});
    }

    if(typeof(password) !== 'string') return;

    const obj = {uppercase: 0, lowercase: 0, number: 0, special: 0};
    password.trim().split('').forEach(element => {
        /[A-Z]/g.test(element) ? ++obj.uppercase :
        /[a-z]/g.test(element) ? ++obj.lowercase :
        /[0-9]/g.test(element) ? ++obj.number :
        ++obj.special;
    });

    if(obj.uppercase === 0) {
        throw new BadRequestError({code: 400, message: "password must have at least one uppercase character"});
    } 
    if(obj.lowercase === 0) {
        throw new BadRequestError({code: 400, message: "password must have at least one lowercase character"});
    }
    if(obj.number === 0) {
        throw new BadRequestError({code: 400, message: "password must have at least one number"});
    }
    if(obj.special === 0) {
        throw new BadRequestError({code: 400, message: "password must have at least one special character"});
    }

    const invalidCharacters = /[ç;:?ãõáéíóúâêôûªº~^´`à/]/gm.test(password);

    if(invalidCharacters) {
        throw new BadRequestError({code: 400, message: "password contains invalid characters"});
    }

    if(password !== passwordConfirm) {
        throw new BadRequestError({code: 400, message: "Passwords do not match hei hei hei"});
    }

    const updatedPassword = {
        password: await bcryptjs.hash(password, 12)
    }

    await user.updateOne(updatedPassword);

    await ForgotPassword.deleteOne({token: token});

    return res.status(200).send({message: "Success!"});

}