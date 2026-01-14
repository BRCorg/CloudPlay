import { Router } from "express";

import { createPost, getPosts, updatePost, deletePost, toggleLikePost, getPostById } from "../controllers/postsController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadSingleFileMiddleware } from "../middlewares/validateUpload";

const router = Router();

//--- créer un post (auth required)
router.post("/", authMiddleware, uploadSingleFileMiddleware, createPost);


//--- voir tous les posts
router.get("/", getPosts);

//--- voir un post par id
router.get("/:id", getPostById);

//--- mettre à jour un post (auth required)
router.put("/:id", authMiddleware, uploadSingleFileMiddleware, updatePost);

//--- supprimer un post (auth required)
router.delete("/:id", authMiddleware, deletePost);

//--- like/unlike un post (auth required)
router.post("/:postId/like", authMiddleware, toggleLikePost);

export default router;