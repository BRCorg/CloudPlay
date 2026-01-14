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

//---- voir les commentaires pour un post
router.get('/posts/:postId/comments', getComments);

//--- nombre de commentaires pour un post
router.get('/posts/:postId/comments/count', getCommentCount);

//--- ajouter un commentaire (auth required)
router.post('/posts/:postId/comments', authMiddleware, createComment);

//--- mettre à jour un commentaire (auth required)
router.put('/comments/:commentId', authMiddleware, updateComment);

//--- supprimer un commentaire (auth required)
router.delete('/comments/:commentId', authMiddleware, deleteComment);

//--- like un commentaire (auth required)
router.post('/comments/:commentId/like', authMiddleware, toggleLikeComment);

export default router;
