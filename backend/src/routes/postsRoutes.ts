import { Router } from "express";
import { createPost, getPosts, updatePost, deletePost } from "../controllers/postsController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadSingleFileMiddleware } from "../middlewares/validateUpload";

const router = Router();

router.post("/", authMiddleware, uploadSingleFileMiddleware, createPost);
router.get("/", getPosts);
router.put("/:id", authMiddleware, uploadSingleFileMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
