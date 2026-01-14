import { Request, Response, NextFunction } from "express";
import Comment from "../models/Comment";
import { z, ZodError } from "zod";

// ----- Validation Zod avec trim
const commentSchema = z.object({
  content: z.string().trim().min(1, { message: "Le contenu du commentaire est requis" }),
});

// ----- Récupérer tous les commentaires d'un post
export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// ----- Créer un commentaire
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = commentSchema.parse(req.body);
    const { postId } = req.params;
    const userId = (req as any).user.id;

    const comment = await Comment.create({
      ...data,
      author: userId,
      post: postId,
      likes: [],
    });

    await comment.populate("author", "username avatar");
    res.status(201).json(comment);
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
};

// ----- Mettre à jour un commentaire
export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = commentSchema.partial().parse(req.body);
    const { commentId } = req.params;
    const userId = (req as any).user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Commentaire non trouvé" });
    if (comment.author.toString() !== userId) return res.status(403).json({ error: "Non autorisé" });

    Object.assign(comment, data);
    await comment.save();
    await comment.populate("author", "username avatar");

    res.json(comment);
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
};

// ----- Supprimer un commentaire
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const userId = (req as any).user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Commentaire non trouvé" });
    if (comment.author.toString() !== userId) return res.status(403).json({ error: "Non autorisé" });

    await comment.deleteOne();
    res.json({ message: "Commentaire supprimé avec succès" });
  } catch (err) {
    next(err);
  }
};

// ----- Toggle like sur un commentaire
export const toggleLikeComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const userId = (req as any).user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Commentaire non trouvé" });

    const likeIndex = comment.likes.indexOf(userId);
    if (likeIndex > -1) comment.likes.splice(likeIndex, 1);
    else comment.likes.push(userId);

    await comment.save();
    await comment.populate("author", "username avatar");

    res.json(comment);
  } catch (err) {
    next(err);
  }
};

// ----- Récupérer le nombre de commentaires pour un post
export const getCommentCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const count = await Comment.countDocuments({ post: postId });
    res.json({ count });
  } catch (err) {
    next(err);
  }
};
