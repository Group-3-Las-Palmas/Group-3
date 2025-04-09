import express from 'express';
import { register, login, getLoginHistory } from '../controllers/authController.js';
import { authenticateBasicCredentials  } from '../middleware/authenticateBasic.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', authenticateBasicCredentials,  login);
router.get('/login-history', authenticateToken, getLoginHistory);

export default router;