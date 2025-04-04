import express from 'express';

import {
  getRewards,
  createReward,
  updateReward,
  deleteReward,
  getRewardById
} from '../controllers/rewardsController.js';

import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/', authenticateToken, getRewards);
router.post('/', authenticateToken, createReward);
router.get('/:id', authenticateToken, getRewardById);
router.put('/:id', authenticateToken, updateReward);
router.delete('/:id', authenticateToken, deleteReward);

export default router;