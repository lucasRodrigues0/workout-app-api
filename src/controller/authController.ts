import { NextFunction, Request, Response } from "express"
import { User } from "../model/User";
import BadRequestError from "../errors/BadRequestError";
import bcryptjs from 'bcryptjs';
import { sign, verify } from "jsonwebtoken";
import { ForgotPassword } from "../model/ForgotPassword";
import { sendEmail } from "../utils/sendEmail";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {

    const { name, email, password, passwordConfirm, admin } = req.body;

    const user = {
        name,
        email,
        password: await bcryptjs.hash(req.body.password, 12),
        admin
    }

    if(!name) {
        throw new BadRequestError({code: 400, message: "Name is Required"});
    }
    if(!email) {
        throw new BadRequestError({code: 400, message: "Email is Required"});
    }
    if(!password) {
        throw new BadRequestError({code: 400, message: "Password is Required"});
    }
    if(password !== passwordConfirm) {
        throw new BadRequestError({code: 400, message: "Password and confirmation do not match"});
    }

    const emailCheck = await User.findOne({email: email});

    if(emailCheck) {
        throw new BadRequestError({code: 400, message: "Email already registered"});
    }

    const data = await User.create(user);

    res.status(200).send(data);
}

export const login = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body;
    
    const user = await User.findOne({email: email});

    if(!user) {
        throw new BadRequestError({code: 400, message: "User not found!"});
    }

    if(!await bcryptjs.compare(password, user.password)) {
        throw new BadRequestError({code: 400, message: "Incorrect Password!"});
    }

    const token = sign(
        {id: user._id},
        process.env.ACCESS_SECRET || '',
        {expiresIn: '30s'}
    );

    const refreshToken = sign(
        {id: user._id},
        process.env.REFRESH_SECRET || '',
        {expiresIn: '1w'}
    )

    res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 //1d
    });

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 * 7 //7d
    });
    
    res.status(200).send({
        message: "success!"
    })

}

export const authenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
    
    const cookie = req.cookies['access_token'];

    if(!cookie) {
        throw new BadRequestError({code: 401, message: "unauthorized"});
    }
    
    const payload: any = verify(cookie, process.env.ACCESS_SECRET || '');
    
    if(!payload) {
        throw new BadRequestError({code: 401, message: "unauthorized"});
    }

    const user = await User.findOne({_id: payload.id});

    if(!user) {
        throw new BadRequestError({code: 401, message: "unauthorized"});
    }

    const data = {
        name: user.name,
        email: user.email,
        id: user._id
    }

    return res.status(200).json(data);
}

export const refresh = (req: Request, res: Response, next: NextFunction) => {

    const cookie = req.cookies['refresh_token'];

    const payload: any = verify(cookie, process.env.REFRESH_SECRET || '');
    
    if(!payload) {
        throw new BadRequestError({code: 401, message: "unauthorized"});
    }

    const token = sign(
        {id: payload.id},
        process.env.ACCESS_SECRET || '',
        {expiresIn: '30s'}
    );

    res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 //1d
    });

    return res.status(200).send({message: "success!"});
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    res.cookie('access_token', '', {maxAge: 0});
    res.cookie('refresh_token', '', {maxAge: 0});

    return res.status(200).send({message: "success!"});
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {

    const { email } = req.body;

    const token = Math.random().toString(20).substring(2, 12);

    const user = await User.findOne({email: email});
    
    if(!user) {
        throw new BadRequestError({code: 400, message: "Email not found!"});
    }

    await ForgotPassword.create({token: token, email: email});

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

    return res.status(200).send({message: "Success!"});

}