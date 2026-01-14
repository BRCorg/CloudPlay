import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment,
  getCommentCount,
} from '../controllers/commentsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Get comments for a post
router.get('/posts/:postId/comments', getComments);

// Get comment count for a post
router.get('/posts/:postId/comments/count', getCommentCount);

// Create comment (auth required)
router.post('/posts/:postId/comments', authMiddleware, createComment);

// Update comment (auth required)
router.put('/comments/:commentId', authMiddleware, updateComment);

// Delete comment (auth required)
router.delete('/comments/:commentId', authMiddleware, deleteComment);

// Toggle like on comment (auth required)
router.post('/comments/:commentId/like', authMiddleware, toggleLikeComment);

export default router;
