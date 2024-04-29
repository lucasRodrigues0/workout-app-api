import { NextFunction, Request, Response } from "express"
import { User } from "../model/User";
import BadRequestError from "../errors/BadRequestError";

export const addUser = async (req: Request, res: Response, next: NextFunction) => {

    const { name, email, password } = req.body;

    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    if(!name) {
        throw new BadRequestError({code: 400, message: "Name is Required", logging: true});
    }
    if(!email) {
        throw new BadRequestError({code: 400, message: "Email is Required", logging: true});
    }
    if(!password) {
        throw new BadRequestError({code: 400, message: "Password is Required", logging: true});
    }

    const data = await User.create(user);

    res.status(200).send(data);
}