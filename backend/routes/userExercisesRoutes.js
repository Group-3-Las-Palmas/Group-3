import express from 'express';

import {
  getUserExercises,
  createUserExercise,
  updateUserExercise,
  deleteUserExercise,
  getUserExerciseById,
  getFavouritesByUser,
  completeExercise
} from '../controllers/userExerciseController.js';

import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();
router.get('/', authenticateToken, getUserExercises);
router.post('/', authenticateToken, createUserExercise);
router.get('/:id', authenticateToken, getUserExerciseById);
router.put('/:id', authenticateToken, updateUserExercise);
router.delete('/:id', authenticateToken, deleteUserExercise);
router.get('/favourites/:userId', authenticateToken, getFavouritesByUser);
router.post('/complete', authenticateToken, completeExercise);

export default router;