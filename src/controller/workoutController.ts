import { NextFunction, Request, Response } from "express";
import { Workout } from "../model/Workout";

export const addWorkout = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const workout = {
            key: req.body.key,
            userId: req.body.userId,
            name: req.body.name,
            details: req.body.details
        }

        const registered = await Workout.findOne(workout);

        if(registered) {
            throw new Error("treino já registrado!");
        }

        const data = await Workout.create(workout);

        return res.status(200).send(data);

    } catch (error: any) {
        next(error);
    }
}