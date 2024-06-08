import mongoose, { Schema } from "mongoose";

const ExerciseSchema = new Schema({
    img: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    series: {
        type: String,
        required: true
    },
    reps: {
        type: String,
        required: true
    },
    obs: {
        type: String,
        required: false
    }
});

export const Exercise = mongoose.model('exercises', ExerciseSchema);