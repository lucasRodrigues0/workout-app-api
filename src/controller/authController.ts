import { NextFunction, Request, Response } from "express"
import { User } from "../model/User";
import BadRequestError from "../errors/BadRequestError";
import bcryptjs from 'bcryptjs';
import { sign, verify } from "jsonwebtoken";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {

    const { name, secondName, email, password, passwordConfirm, admin } = req.body;

    const user = {
        name,
        secondName,
        email,
        password: await bcryptjs.hash(password, 12),
        admin
    }

    if(!name) {
        throw new BadRequestError({code: 400, message: "Name is Required"});
    }
    if(!secondName) {
        throw new BadRequestError({code: 400, message: "Second name is Required"});
    }
    if(!email) {
        throw new BadRequestError({code: 400, message: "Email is Required"});
    }
    if(!password) {
        throw new BadRequestError({code: 400, message: "Password is Required"});
    }

    const emailIsValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/gm.test(email);

    if(!emailIsValid) {
        throw new BadRequestError({code: 400, message: "invalid email format"});
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
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 //1d
    });

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
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
        secondName: user.secondName,
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
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 //1d
    });

    return res.status(200).send({message: "success!"});
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    res.cookie('access_token', '', 
    {sameSite: 'none',
    httpOnly: true,
    secure: true,
    maxAge: 0});
    
    res.cookie('refresh_token', '', 
    {sameSite: 'none',
    httpOnly: true,
    secure: true,
    maxAge: 0});

    return res.status(200).send({message: "success!"});
}

export const checkEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const response = await User.findOne({email: email});
    if(!response) {
        return res.status(200).send(false);
    }

    return res.status(200).send(true);
}

