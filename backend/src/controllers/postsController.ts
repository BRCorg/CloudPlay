// ----- Récupérer un post par son id
export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username avatar");
    if (!post) return res.status(404).json({ error: "Post non trouvé" });
    // Compter les commentaires associés
    const commentCount = await Comment.countDocuments({ post: post._id });
    res.json({ post: { ...post.toObject(), commentCount } });
  } catch (err) {
    next(err);
  }
};
import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
import Comment from "../models/Comment";
import { z, ZodError } from "zod";

// ----- Regex sécurisé pour autoriser uniquement les caractères souhaités
const allowedRegex = /^[a-zA-Z0-9 éèàùâêîôûçÉÈÀÙÂÊÎÔÛÇ'"()\-_.?!]+$/;

// ----- Validation Zod pour la création / modification d'un post
const postSchema = z.object({
  title: z.string()
    .trim()
    .min(2, { message: "Le titre doit contenir au moins 2 caractères" })
    .regex(allowedRegex, { message: "Le titre contient des caractères interdits" }),
  content: z.string()
    .trim()
    .min(5, { message: "Le contenu doit contenir au moins 5 caractères" })
    .regex(allowedRegex, { message: "Le contenu contient des caractères interdits" }),
});

// ----- Créer un post
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = postSchema.parse(req.body);
    const userId = (req as any).user.id;

    const post = await Post.create({
      ...data,
      author: userId,
      image: req.file?.filename,
    });

    await post.populate("author", "username avatar");
    res.status(201).json({ post });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
};

// ----- Récupérer tous les posts
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find().populate("author", "username avatar").sort({ createdAt: -1 });

    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return { ...post.toObject(), commentCount };
      })
    );

    res.json({ posts: postsWithCommentCount });
  } catch (err) {
    next(err);
  }
};

// ----- Mettre à jour un post
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = postSchema.partial().parse(req.body); // validation partielle
    const userId = (req as any).user.id;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post non trouvé" });
    if (post.author.toString() !== userId) return res.status(403).json({ error: "Non autorisé" });

    Object.assign(post, data);
    if (req.file) post.image = req.file.filename;

    await post.save();
    await post.populate("author", "username avatar");

    res.json({ post });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
};

// ----- Supprimer un post
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post non trouvé" });
    if (post.author.toString() !== userId) return res.status(403).json({ error: "Non autorisé" });

    await post.deleteOne();
    res.json({ message: "Post supprimé avec succès" });
  } catch (err) {
    next(err);
  }
};

export const toggleLikePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = (req as any).user.id;

    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // like
      post.likes.push(userId);
    }

    await post.save();
    await post.populate('author', 'username avatar');

    res.json(post);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
