import mongoose from "mongoose";


const ForgotPasswordSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

export const ForgotPassword = mongoose.model('fgPasswords', ForgotPasswordSchema);