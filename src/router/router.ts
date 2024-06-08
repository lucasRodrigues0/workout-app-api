import express from "express"
import { authenticatedUser, checkEmail, createUser, login, logout, refresh } from "../controller/authController";
import { addWorkout, createExercise, deleteWorkout, getAllExercises, getWorkoutDetails, getWorkouts } from "../controller/workoutController";
import { checkToken, forgotPassword, resetPassword } from "../controller/passwordRecoveryController";

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
router.get('/check-token/:token', checkToken);

//workout routes
router.post('/add-workout', addWorkout);
router.get('/get-workouts/:userId', getWorkouts);
router.post('/delete-workout', deleteWorkout);
router.get('/details/:key', getWorkoutDetails);
router.post('/create-exercise', createExercise);
router.get('/exercises', getAllExercises);

//misc routes
router.post('/check-email', checkEmail);

module.exports = router;