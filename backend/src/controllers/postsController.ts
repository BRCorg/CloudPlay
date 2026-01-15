//------------------------- POSTS CONTROLLER ----------------------------//
import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
import Comment from "../models/Comment";
import { z, ZodError } from "zod";
import mongoose from "mongoose";

// ----- Regex sécurisé pour autoriser uniquement les caractères souhaités
const allowedRegex = /^[a-zA-Z0-9 éèàùâêîôûçÉÈÀÙÂÊÎÔÛÇ'"()\-_.?!]+$/;

// ----- Schema Zod pour valider les posts
const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: "Le titre doit contenir au moins 2 caractères" })
    .regex(allowedRegex, {
      message: "Le titre ne doit contenir que des lettres, chiffres, espaces, accents ou ponctuation (. , ? ! - _ ( ) ' \" )",
    }),
  content: z
    .string()
    .trim()
    .min(5, { message: "Le contenu doit contenir au moins 5 caractères" }),
});

/*************************************************************************
 *                        Créer un post
 ************************************************************************/
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupérer les données depuis req.body et valider avec Zod
    const data = postSchema.parse(req.body);

    // Récupérer l'ID de l'utilisateur authentifié
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié" });

    // Créer le post avec l'auteur et l'image si fournie ou non
    const post = await Post.create({
      ...data,
      author: new mongoose.Types.ObjectId(userId),
      image: req.file?.filename,
    });

    // Remplir les informations de l'auteur avant de renvoyer la réponse
    await post.populate("author", "username avatar");
    res.status(201).json({ post });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
};

/*************************************************************************
 *                      Récupérer tous les posts
 ************************************************************************/
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // D'abord, récupérer tous les posts avec les infos d'auteur
    const posts = await Post.find()
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    // Ensuite, pour chaque post, compter les commentaires associés
    // et construire un nouveau tableau avec le count inclus
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return { ...post.toObject(), commentCount };
      })
    );

    // Renvoyer les posts avec le nombre de commentaires
    res.json({ posts: postsWithCommentCount });
  } catch (err) {
    next(err);
  }
};

/*************************************************************************
 *                      Récupérer les posts d'un utilisateur
 ************************************************************************/
export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validation partielle pour la mise à jour
    const data = postSchema.partial().parse(req.body); 
    const userId = req.user?._id;

    // Trouver le post à mettre à jour
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post non trouvé" });

    // Vérifier si l'utilisateur est l'auteur du post
    if (post.author.toString() !== userId)
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à modifier ce post" });

    // Mettre à jour les champs du post
    Object.assign(post, data);
    if (req.file) post.image = req.file.filename;

    // Sauvegarder les modifications avec population de l'auteur
    await post.save();
    await post.populate("author", "username avatar");

    res.json({ post });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
};

/*************************************************************************
 *                      Supprimer un post
 ************************************************************************/
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupérer l'ID de l'utilisateur authentifié
    const userId = req.user?._id;

    // Trouver le post à supprimer
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post non trouvé" });

    // Vérifier si l'utilisateur est l'auteur du post
    if (post.author.toString() !== userId)
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à supprimer ce post" });

    // Supprimer le post si tout est ok
    await post.deleteOne();
    res.json({ message: "Post supprimé avec succès" });
  } catch (err) {
    next(err);
  }
};



/*************************************************************************
 *                      Liker/Disliker un post
 ************************************************************************/
export const toggleLikePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Récupérer le postId depuis les paramètres de la route
    const { postId } = req.params;

    // Récupérer l'ID de l'utilisateur authentifié
    const userId = req.user?._id;

    // Trouver le post
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: "Post non trouvé" });
      return;
    }

    // Vérifier si l'utilisateur a déjà liké le post
    const likeIndex = post.likes.findIndex(
      (id) => id.toString() === userId
    );

    // Si user like déjà, on le retire (unlike), sinon on l'ajoute (like)
    if (likeIndex > -1) {
      // unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // like
      post.likes.push(new mongoose.Types.ObjectId(userId));
    }

    // Sauvegarder les modifications avec population de l'auteur
    await post.save();
    await post.populate("author", "username avatar");

    res.json(post);
  } catch (error) {
    console.error("Erreur lors du like/dislike :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/*************************************************************************
 *                      Récupérer un post par son id
 ************************************************************************/
export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Trouver le post par son ID avec les infos d'auteur
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username avatar"
    );

    // Si post pas trouvé, renvoyer une erreur 404
    if (!post) return res.status(404).json({ error: "Post non trouvé" });

    // Compter les commentaires associés à ce post
    const commentCount = await Comment.countDocuments({ post: post._id });

    // Renvoyer le post avec le nombre de commentaires
    res.json({ post: { ...post.toObject(), commentCount } });
  } catch (err) {
    next(err);
  }
};
