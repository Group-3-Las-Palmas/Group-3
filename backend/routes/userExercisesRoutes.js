import express from 'express';

import {
  getUserExercises,
  createUserExercise,
  updateUserExercise,
  deleteUserExercise,
  getUserExerciseById
} from '../controllers/userExerciseController.js';

import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();
router.get('/', authenticateToken, getUserExercises);
router.post('/', authenticateToken, createUserExercise);
router.get('/:id', authenticateToken, getUserExerciseById);
router.put('/:id', authenticateToken, updateUserExercise);
router.delete('/:id', authenticateToken, deleteUserExercise);

export default router;