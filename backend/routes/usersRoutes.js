import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById
} from '../controllers/userController.js';


const router = express.Router();

router.get('/', authenticateToken, getUsers);
router.post('/', authenticateToken, createUser);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);

router.delete('/:id', authenticateToken, deleteUser);


export default router;