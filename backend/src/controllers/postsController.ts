import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
import Comment from "../models/Comment";

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;
    const userId = (req as any).user.id;

    const post = await Post.create({
      title,
      content,
      author: userId,
      image: req.file?.filename,
    });

    await post.populate("author", "username avatar");
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
};

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find()
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });
    
    // Add comment count to each post
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post.toObject(),
          commentCount,
        };
      })
    );
    
    res.json({ posts: postsWithCommentCount });
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;
    const userId = (req as any).user.id;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post non trouvé" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    if (req.file) {
      post.image = req.file.filename;
    }

    await post.save();
    await post.populate("author", "username avatar");
    res.json({ post });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post non trouvé" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    await post.deleteOne();
    res.json({ message: "Post supprimé" });
  } catch (err) {
    next(err);
  }
};