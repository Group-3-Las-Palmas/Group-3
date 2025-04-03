import express from "express";
import {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
} from "../controllers/exercisesController.js";

const router = express.Router();

router.get("/", getExercises);
router.get("/:id", getExerciseById);
router.post("/", createExercise);
router.put("/:id", updateExercise);
router.delete("/:id", deleteExercise);

export default router;
