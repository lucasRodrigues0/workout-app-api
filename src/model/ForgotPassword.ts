import mongoose from "mongoose";


const ForgotPasswordSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
});

export const ForgotPassword = mongoose.model('fgPasswords', ForgotPasswordSchema);