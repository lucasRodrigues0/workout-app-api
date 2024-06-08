import { NextFunction, Request, Response } from "express";
import { Workout } from "../model/Workout";
import BadRequestError from "../errors/BadRequestError";
import { Exercise } from "../model/Exercise";

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

    if(name === "") {
        throw new BadRequestError({code: 400, message: "Nome não pode ser vazio"})
    }

    const data = await Workout.create(workout);

    return res.status(200).send({message: "success!"});

}

export const deleteWorkout = async (req: Request, res: Response, next: NextFunction) => {

    const { key } = req.body;

    if(!key) {
        throw new BadRequestError({code: 400, message: "please inform a key"});
    }

    const data = await Workout.findOne({key: key});

    if(!data) {
        throw new BadRequestError({code: 400, message: "invalid"});
    }

    await Workout.deleteOne({key: key});

    res.status(200).send({message: "success!"});
}

export const getWorkouts = async (req: Request, res: Response, next: NextFunction) => {

    const { userId } = req.params;

    if(!userId) {
        throw new BadRequestError({code: 400, message: "please inform the user Id"});
    }

    const data = await Workout.find({userId: userId});

    if(!data) {
        throw new BadRequestError({code: 400, message: "invalid Id"});
    }

    res.status(200).send(data);
}

export const getWorkoutDetails = async (req: Request, res: Response, next: NextFunction) => {

    const { key } = req.params;

    const data = await Workout.find({key: key});

    if(!data) {
        throw new BadRequestError({code: 400, message: "something went wrong"});
    }

    res.status(200).send(data);
}

export const createExercise = async (req: Request, res: Response, next: NextFunction) => {
    const { img, name, category, series, reps, obs } = req.body;

    if(!name) {
        throw new BadRequestError({code: 400, message: "name is required"});
    }

    if(!category) {
        throw new BadRequestError({code: 400, message: "category is required"});
    }

    if(!series) {
        throw new BadRequestError({code: 400, message: "series is required"});
    }

    if(!reps) {
        throw new BadRequestError({code: 400, message: "reps is required"});
    }

    const exercise = {
        img,
        name,
        category,
        series,
        reps,
        obs
    }

    await Exercise.create(exercise);

    return res.status(200).send(exercise);    

}

export const getAllExercises = async (req: Request, res: Response, next: NextFunction) => {

    const data = await Exercise.find({});

    return res.status(200).send(data);
}