import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { verifyToken } from "../utils/jwt";

// ------ Middleware pour protéger les routes
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // On récupère le token JWT depuis les cookies
    const token = req.cookies.token;

    // Si pas de token, on renvoie une erreur 401
    if (!token)
      return res.status(401).json({ error: "Vous n'êtes pas authentifié" });

    // On vérifie et décode le token
    const decoded = verifyToken(token);

    // On récupère l'utilisateur correspondant à l'ID dans le token
    const user = await User.findById(decoded.userId).select("-password");

    // Si l'utilisateur n'existe pas, on renvoie une erreur
    if (!user) return res.status(401).json({ error: "Utilisateur non trouvé" });

    // On attache un objet user typé (pour correspondre à Express.Request)
    req.user = {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    };
    next();
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
};
