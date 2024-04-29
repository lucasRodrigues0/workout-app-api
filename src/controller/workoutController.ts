import { NextFunction, Request, Response } from "express";
import { Workout } from "../model/Workout";
import BadRequestError from "../errors/BadRequestError";

export const addWorkout = async (req: Request, res: Response, next: NextFunction) => {

    const { key, userId, name, details } = req.body;

    const workout = {
        key,
        userId,
        name,
        details
    }

    const registered = await Workout.findOne({key: key});

    if(registered) {
        throw new BadRequestError({code: 400, message: "Treino já registrado"});
    }

    if(details.length === 0) {
        throw new BadRequestError({code: 400, message: "Treino deve ter pelo menos 1 exercício"})
    }

    const data = await Workout.create(workout);

    return res.status(200).send(data);

}