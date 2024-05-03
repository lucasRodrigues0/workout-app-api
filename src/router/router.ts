import express from "express"
import { authenticatedUser, createUser, forgotPassword, login, logout, refresh, resetPassword } from "../controller/authController";
import { addWorkout } from "../controller/workoutController";

const router = express.Router();

//auth routes
router.post('/signup', createUser);
router.post('/login', login);
router.get('/user', authenticatedUser);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

//workout routes
router.post('/add-workout', addWorkout);

module.exports = router;