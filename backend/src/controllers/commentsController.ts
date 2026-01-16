//-------------------------- COMMENTS CONTROLLER -------------------------//
import { Request, Response, NextFunction } from "express";
import Comment from "../models/Comment";
import { z } from "zod";
import mongoose from "mongoose";


/*************************************************************************
 *                    Récupérer tous les commentaires d'un post
 **************************************************************************/
export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    // Récupérer les commentaires par postId
    // Populate pour inclure les infos de l'auteur
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate("author", "username avatar")
      .sort({ createdAt: -1 }); // Trier par date décroissante

    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};



/*************************************************************************
 *                        Créer un commentaire
 ************************************************************************/

// ----- Validation Zod avec trim
const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Le contenu du commentaire est requis" }),
});

// ----- Créer un commentaire
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupérer les données depuis req.body et valider avec Zod
    const data = commentSchema.parse(req.body);

    // Récupérer le postId depuis les paramètres de la route
    const { postId } = req.params;

    // Récupérer l'ID de l'utilisateur authentifié
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié" });

    // Créer le commentaire
    const comment = await Comment.create({
      ...data,
      author: new mongoose.Types.ObjectId(userId),
      post: postId,
      likes: [],
    });

    await comment.populate("author", "username avatar");
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};


/*************************************************************************
 *                      Mettre à jour un commentaire
 ************************************************************************/
export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Valider les données avec Zod (validation partielle)
    const data = commentSchema.partial().parse(req.body);

    // Récupérer le commentId depuis les paramètres de la route
    const { commentId } = req.params;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié" });

    // Trouver le commentaire à mettre à jour
    const comment = await Comment.findById(commentId);

    if (!comment)
      return res.status(404).json({ error: "Commentaire non trouvé" });
    if (comment.author.toString() !== userId)
      return res.status(403).json({ error: "Non autorisé" });

    // Object .assign 
    Object.assign(comment, data);

    await comment.save();
    await comment.populate("author", "username avatar");

    res.status(200).json({ message: "Commentaire mis à jour avec succès", comment });
  } catch (err) {
    next(err);
  }
};

/*************************************************************************
 *                      Supprimer un commentaire
 ************************************************************************/
export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié" });

    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(404).json({ error: "Commentaire non trouvé" });
    if (comment.author.toString() !== userId)
      return res.status(403).json({ error: "Non autorisé" });

    await comment.deleteOne();
    res.status(200).json({ message: "Commentaire supprimé avec succès" });
  } catch (err) {
    next(err);
  }
};

/*************************************************************************
 *                      Like / Unlike un commentaire
 ************************************************************************/
// NOTE: on utilise Promise<void> car on gère les réponses HTTP ici
export const toggleLikeComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ error: "Utilisateur non authentifié" });
      return;
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404).json({ message: "Commentaire non trouvé" });
      return;
    }

    const likeIndex = comment.likes.findIndex(
      (id) => id.toString() === userId
    );

    if (likeIndex > -1) {
      // unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      // like
      comment.likes.push(new mongoose.Types.ObjectId(userId));
    }

    await comment.save();
    await comment.populate("author", "username avatar");

    res.status(200).json(comment);
  } catch (error) {
    console.error("Erreur lors du basculement du like :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/*************************************************************************
 *              Récupérer le nombre de commentaires pour un post
 ************************************************************************/
export const getCommentCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    // Récupérer le postId depuis les paramètres de la route
    const { postId } = req.params;

    // Compter le nombre de commentaires pour le postId donné
    // countDocuments est plus efficace que find().length ici
    // car on n'a pas besoin des documents eux-mêmes
    const count = await Comment.countDocuments({ post: postId });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre de commentaires :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
