import { Router } from "express";
import { createPost, getPosts } from "../controllers/postsController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadSingleFileMiddleware } from "../middlewares/validateUpload";

const router = Router();

router.post("/", authMiddleware, uploadSingleFileMiddleware, createPost);
router.get("/", getPosts);

export default router;