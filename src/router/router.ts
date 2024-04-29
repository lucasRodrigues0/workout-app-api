import express from "express"
import { addUser } from "../controller/authController";
import { addWorkout } from "../controller/workoutController";

const router = express.Router();

router.post('/add-user', addUser);
router.post('/add-workout', addWorkout);

module.exports = router;