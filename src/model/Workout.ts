import mongoose, { Schema } from "mongoose";

const WorkoutSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    details: {
        type: Array<{img: string, name: string, category: string, reps: string, obs: string}>,
        default: []
    }
})

export const Workout = mongoose.model('workouts', WorkoutSchema);