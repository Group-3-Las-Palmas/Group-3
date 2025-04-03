import express from 'express';
// import { authenticateToken } from '../middleware/authenticateToken.js';

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById
} from '../controllers/userController.js';


const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

router.delete('/:id', deleteUser);


export default router;