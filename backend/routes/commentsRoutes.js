import express from "express";
import { authenticateToken } from '../middleware/authenticateToken.js';
import {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentsController.js";

const router = express.Router();

router.get("/", authenticateToken, getComments);
router.get("/:id", authenticateToken, getCommentById);
router.post("/", authenticateToken, createComment);
router.put("/:id", authenticateToken, updateComment);
router.delete("/:id", authenticateToken, deleteComment);

export default router;
