import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    workouts: {
        type: Array<{key: string, name: string, obs: string}>,
        required: true,
        default: []
    }
});

export const User = mongoose.model('users', UserSchema);