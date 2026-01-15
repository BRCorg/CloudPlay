//**************************** Contrôleur d'authentification *************************//
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User  from "../models/User";
import { z } from "zod";
import { generateToken } from "../utils/jwt";


// Helper pour construire l'URL complète de l'avatar
// Options de cookie uniformes pour login/signup/logout
const cookieOptions = {
  httpOnly: true,
  path: "/",
  secure: process.env.NODE_ENV === "production", // true en prod
  sameSite: "lax" as "lax", // ou "strict" as "strict", "none" as "none"
  // domain: "tondomaine.com", // à activer si besoin
};
const getAvatarUrl = (filename: string | undefined): string => {
  if (!filename)
    return `${
      process.env.BASE_URL || "http://localhost:5000"
    }/uploads/default.webp`;
  return `${
    process.env.BASE_URL || "http://localhost:5000"
  }/uploads/${filename}`;
};

/************************************************************************
 *                               Inscription
 ************************************************************************/

// Validation Zod pour l'inscription
// -> vérifie que l'email est correct
// -> le mot de passe >= 6 caractères
// -> et le username >= 2 caractères
// et <= 20 caractères, sans caractères spéciaux
const signupSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z
    .string()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  username: z
    .string()
    .min(2, {
      message: "Le nom d'utilisateur doit contenir au moins 2 caractères",
    })
    .max(20, {
      message: "Le nom d'utilisateur doit contenir au plus 20 caractères",
    })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        "Le nom d'utilisateur ne doit contenir que des lettres, chiffres, tirets ou underscores",
    }),
});

// ------- Fonction d'inscription
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // D'abord on récupère les données via le corps de la requête
    // Et on trim username et email avant validation
    const body = {
      ...req.body,
      username:
        typeof req.body.username === "string"
          ? req.body.username.trim()
          : req.body.username,
      email:
        typeof req.body.email === "string"
          ? req.body.email.trim()
          : req.body.email,
    };

    // On valide les données saisies avec Zod
    const data = signupSchema.parse(body);

    // Hash du mot de passe avec bcrypt et 10 rounds de salage
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Création de l'utilisateur
    const user = await User.create({
      ...data,
      password: hashedPassword,
      avatar: req.file?.filename,
    });

    // Génération du token JWT
    // On envoie le token dans un cookie HttpOnly
    // Le cookie est accessible sur tout le site (path: "/")
    const token = generateToken(user._id.toString());
    res.cookie("token", token, cookieOptions);

    // On renvoie les infos de l'utilisateur (sans le mot de passe)
    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        avatar: getAvatarUrl(user.avatar),
      },
    });
  } catch (err: any) {
    // Gestion de l'erreur d'email déjà utilisé (duplicate key)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({
        error: "Erreur de validation",
        details: [
          {
            path: ["email"],
            message: "Cette adresse e-mail est déjà utilisée"
          }
        ]
      });
    }
    next(err); // Gestion des autres erreurs par le middleware d'erreur
  }
};


/************************************************************************
 *                               Connexion
 ************************************************************************/
// ----- Validation Zod pour la connexion
const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

// ----- Connexion
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // On trim l'email avant validation
    const body = {
      ...req.body,
      email:
        typeof req.body.email === "string"
          ? req.body.email.trim()
          : req.body.email,
    };

    // Valider les données avec Zod
    const { email, password } = loginSchema.parse(body);

    // Vérifier si l'email et le mot de passe sont valides
    const user = await User.findOne({ email });
    const isValid = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!user || !isValid) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    // Générer un token JWT et l'envoyer dans un cookie HttpOnly
    const token = generateToken(user._id.toString());
    res.cookie("token", token, cookieOptions);

    res.json({
      message: "Connexion réussie",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        avatar: getAvatarUrl(user.avatar),
      },
    });
  } catch (err) {
    next(err);
  }
};


/************************************************************************
 *                             Déconnexion
 ************************************************************************/
export const logout = (_req: Request, res: Response) => {
  // On supprime le cookie en le réinitialisant (mêmes options que lors de la création)
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Déconnexion réussie" });
};


/************************************************************************
 *                          Profil utilisateur
 ************************************************************************/
export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    // Récupérer l'utilisateur depuis la requête (ajouté par le middleware d'authentification)
    const user = req.user;

    // Si pas d'utilisateur, renvoyer une erreur 401
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    // Renvoyer les informations de l'utilisateur
    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
      avatar: getAvatarUrl(user.avatar),
    });
  } catch (err) {
    next(err);
  }
};


/*************************************************************************
 *                           Mise à jour du profil
 *************************************************************************/
//--- Schema Zod pour valider le username
const usernameSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Le nom d'utilisateur doit contenir au moins 2 caractères",
    })
    .max(20, {
      message: "Le nom d'utilisateur doit contenir au plus 20 caractères",
    })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        "Le nom d'utilisateur ne doit contenir que des lettres, chiffres, tirets ou underscores",
    }),
});

// ----- Mettre à jour le profil utilisateur (avatar et/ou username)
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupérer l'ID utilisateur depuis le token
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié" });

    // Récupérer le nouveau fichier avatar et/ou username depuis la requête
    const avatar = req.file?.filename;
    const { username } = req.body;

    // Construire l'objet de mise à jour
    const updateData: Record<string, unknown> = {};

    // Si un avatar est fourni, l'ajouter aux données de mise à jour
    if (avatar) updateData.avatar = avatar;

    // Si un username est fourni, le valider avec Zod avant de l'ajouter
    if (username) {
      // On laisse le middleware gérer les erreurs de validation
      usernameSchema.parse({ username: username.trim() });
      updateData.username = username.trim();
    }

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    // Renvoie les infos mises à jour de l'utilisateur
    res.json({
      user: {
        _id: updatedUser!._id,
        email: updatedUser!.email,
        username: updatedUser!.username,
        avatar: getAvatarUrl(updatedUser!.avatar),
      },
    });
  } catch (err) {
    next(err);
  }
};