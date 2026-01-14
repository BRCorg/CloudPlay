import { Request, Response } from 'express';
import Comment from '../models/Comment';

// voir commentaires pour un post
export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// créer commentaire
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user.id;

    if (!content || !content.trim()) {
      res.status(400).json({ message: 'Content is required' });
      return;
    }

    const comment = new Comment({
      content: content.trim(),
      author: userId,
      post: postId,
      likes: [],
    });

    await comment.save();
    await comment.populate('author', 'username avatar');

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// mettre à jour un commentaire
export const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (comment.author.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to update this comment' });
      return;
    }

    if (content && content.trim()) {
      comment.content = content.trim();
    }

    await comment.save();
    await comment.populate('author', 'username avatar');

    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// supprimer un commentaire
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { commentId } = req.params;
    const userId = (req as any).user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (comment.author.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this comment' });
      return;
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// like un commentaire
export const toggleLikeComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { commentId } = req.params;
    const userId = (req as any).user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    const likeIndex = comment.likes.indexOf(userId);

    if (likeIndex > -1) {
      // unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      // like
      comment.likes.push(userId);
    }

    await comment.save();
    await comment.populate('author', 'username avatar');

    res.json(comment);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// nombre de commentaires pour un post
export const getCommentCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const count = await Comment.countDocuments({ post: postId });
    res.json({ count });
  } catch (error) {
    console.error('Error getting comment count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
