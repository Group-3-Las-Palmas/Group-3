import express from "express";
import { authenticateToken } from '../middleware/authenticateToken.js';
import {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
} from "../controllers/exercisesController.js";

const router = express.Router();

router.get("/", authenticateToken, getExercises);
router.get("/:id", authenticateToken, getExerciseById);
router.post("/", authenticateToken, createExercise);
router.put("/:id", authenticateToken, updateExercise);
router.delete("/:id", authenticateToken, deleteExercise);

export default router;
