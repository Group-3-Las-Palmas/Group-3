import express from 'express';
import { register, login } from '../controllers/authController.js';
import { authenticateBasicCredentials  } from '../middleware/authenticateBasic.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', authenticateBasicCredentials,  login);

export default router;