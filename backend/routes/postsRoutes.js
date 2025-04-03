import express from 'express';

import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getPostById
} from '../controllers/postsController.js';

import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/', authenticateToken, getPosts);
router.post('/', authenticateToken, createPost);
router.get('/:postId', authenticateToken, getPostById);
router.put('/:postId', authenticateToken, updatePost);

router.delete('/:postId', authenticateToken, deletePost);

export default router;