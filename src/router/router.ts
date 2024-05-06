import express from "express"
import { authenticatedUser, createUser, login, logout, refresh } from "../controller/authController";
import { addWorkout } from "../controller/workoutController";
import { forgotPassword, resetPassword } from "../controller/passwordRecoveryController";

const router = express.Router();

//auth routes
router.post('/signup', createUser);
router.post('/login', login);
router.get('/user', authenticatedUser);
router.post('/refresh', refresh);
router.post('/logout', logout);

//password recovery routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

//workout routes
router.post('/add-workout', addWorkout);

module.exports = router;