"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const workoutController_1 = require("../controller/workoutController");
const passwordRecoveryController_1 = require("../controller/passwordRecoveryController");
const router = express_1.default.Router();
//auth routes
router.post('/signup', authController_1.createUser);
router.post('/login', authController_1.login);
router.get('/user', authController_1.authenticatedUser);
router.post('/refresh', authController_1.refresh);
router.post('/logout', authController_1.logout);
//password recovery routes
router.post('/forgot-password', passwordRecoveryController_1.forgotPassword);
router.post('/reset-password', passwordRecoveryController_1.resetPassword);
router.get('/check-token/:token', passwordRecoveryController_1.checkToken);
//workout routes
router.post('/add-workout', workoutController_1.addWorkout);
router.get('/get-workouts/:userId', workoutController_1.getWorkouts);
router.post('/delete-workout', workoutController_1.deleteWorkout);
router.get('/details/:key', workoutController_1.getWorkoutDetails);
//misc routes
router.post('/check-email', authController_1.checkEmail);
module.exports = router;
