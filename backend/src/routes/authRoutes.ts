//--------------------- Routes d'authentification ---------------------//
import { Router } from "express";
import { signup, login, logout, me, updateProfile } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadSingleFileMiddleware } from "../middlewares/validateUpload";

const router = Router();

//---- Routes d'inscription
router.post("/signup", uploadSingleFileMiddleware, signup);

//---- Routes de connexion
router.post("/login", login);

//---- Routes de déconnexion
router.post("/logout", logout);

//---- Route pour récupérer les infos de l'utilisateur connecté
router.get("/me", authMiddleware, me);

//---- Route pour mettre à jour le profil de l'utilisateur
router.put("/me", authMiddleware, uploadSingleFileMiddleware, updateProfile);

export default router;
