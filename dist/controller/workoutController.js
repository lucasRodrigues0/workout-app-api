"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkoutDetails = exports.getWorkouts = exports.deleteWorkout = exports.addWorkout = void 0;
const Workout_1 = require("../model/Workout");
const BadRequestError_1 = __importDefault(require("../errors/BadRequestError"));
const addWorkout = async (req, res, next) => {
    const { key, userId, name, details } = req.body;
    const workout = {
        key,
        userId,
        name,
        details
    };
    const registered = await Workout_1.Workout.findOne({ key: key });
    if (registered) {
        throw new BadRequestError_1.default({ code: 400, message: "Treino já registrado" });
    }
    if (details.length === 0) {
        throw new BadRequestError_1.default({ code: 400, message: "Treino deve ter pelo menos 1 exercício" });
    }
    if (name === "") {
        throw new BadRequestError_1.default({ code: 400, message: "Nome não pode ser vazio" });
    }
    const data = await Workout_1.Workout.create(workout);
    return res.status(200).send({ message: "success!" });
};
exports.addWorkout = addWorkout;
const deleteWorkout = async (req, res, next) => {
    const { key } = req.body;
    if (!key) {
        throw new BadRequestError_1.default({ code: 400, message: "please inform a key" });
    }
    const data = await Workout_1.Workout.findOne({ key: key });
    if (!data) {
        throw new BadRequestError_1.default({ code: 400, message: "invalid" });
    }
    await Workout_1.Workout.deleteOne({ key: key });
    res.status(200).send({ message: "success!" });
};
exports.deleteWorkout = deleteWorkout;
const getWorkouts = async (req, res, next) => {
    const { userId } = req.params;
    if (!userId) {
        throw new BadRequestError_1.default({ code: 400, message: "please inform the user Id" });
    }
    const data = await Workout_1.Workout.find({ userId: userId });
    if (!data) {
        throw new BadRequestError_1.default({ code: 400, message: "invalid Id" });
    }
    res.status(200).send(data);
};
exports.getWorkouts = getWorkouts;
const getWorkoutDetails = async (req, res, next) => {
    const { key } = req.params;
    const data = await Workout_1.Workout.find({ key: key });
    if (!data) {
        throw new BadRequestError_1.default({ code: 400, message: "something went wrong" });
    }
    res.status(200).send(data);
};
exports.getWorkoutDetails = getWorkoutDetails;
