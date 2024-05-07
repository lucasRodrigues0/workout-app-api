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
        type: Array<{name: string, obs: string}>,
        default: []
    }
})

export const Workout = mongoose.model('workouts', WorkoutSchema);