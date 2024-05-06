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

    const data = await ForgotPassword.create({token: token, email: email});

    const subject: string = "Recuperação de senha";
    const html: string = `<a href="${process.env.BASE_URL}/${token}">Clique aqui para alterar sua senha</a>`;

    sendEmail(email, html, subject);

    return res.status(200).send({message: "success!"});
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {

    const { token, password, password_confirmation } = req.body;

    const getToken = await ForgotPassword.findOne({token: token});

    if(!getToken) {
        throw new BadRequestError({code: 400, message: "Invalid link!"});
    }

    const user = User.findOne({email: getToken.email});

    if(!user) {
        throw new BadRequestError({code: 400, message: "Invalid link!"});
    }

    if(password !== password_confirmation) {
        throw new BadRequestError({code: 400, message: "Passwords do not match"});
    }

    const updatedPassword = {
        password: await bcryptjs.hash(password, 12)
    }

    await user.updateOne(updatedPassword);

    await ForgotPassword.deleteOne({token: token});

    return res.status(200).send({message: "Success!"});

}