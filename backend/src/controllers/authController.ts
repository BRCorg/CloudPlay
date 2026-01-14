
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { z, ZodError } from "zod";
import { generateToken } from "../utils/jwt";


// Validation Zod pour la mise à jour du username (mêmes règles que signup)
const usernameSchema = z.object({
  username: z.string()
    .min(2, { message: "Le nom d'utilisateur doit contenir au moins 2 caractères" })
    .max(20, { message: "Le nom d'utilisateur doit contenir au plus 20 caractères" })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "Le nom d'utilisateur ne doit contenir que des lettres, chiffres, tirets ou underscores" }),
});

// Helper pour construire l'URL complète de l'avatar
const getAvatarUrl = (filename: string | undefined): string => {
  if (!filename) return `${process.env.BASE_URL || "http://localhost:5000"}/uploads/default.webp`;
  return `${process.env.BASE_URL || "http://localhost:5000"}/uploads/${filename}`;
};

// ----- Validation Zod pour l'inscription
// Zod vérifie que l'email est correct, le mot de passe >= 6 caractères et le username >= 2 caractères
const signupSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  username: z.string()
    .min(2, { message: "Le nom d'utilisateur doit contenir au moins 2 caractères" })
    .max(20, { message: "Le nom d'utilisateur doit contenir au plus 20 caractères" })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "Le nom d'utilisateur ne doit contenir que des lettres, chiffres, tirets ou underscores" }),
});

// ----- Inscription
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Trim username et email avant validation
    const body = {
      ...req.body,
      username: typeof req.body.username === 'string' ? req.body.username.trim() : req.body.username,
      email: typeof req.body.email === 'string' ? req.body.email.trim() : req.body.email,
    };
    // Valider les données avec Zod
    const data = signupSchema.parse(body);

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Création de l'utilisateur
    const user = await User.create({
      ...data,
      password: hashedPassword,
      avatar: req.file?.filename,
    });

    // Génération du token JWT
    const token = generateToken(user._id.toString());
    res.cookie("token", token, { httpOnly: true, path: "/" });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: getAvatarUrl(user.avatar),
      },
    });
  } catch (err) {
    next(err); // Tout est envoyé au middleware global
  }
};


// ----- Validation Zod pour la connexion
const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

// ----- Connexion
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Trim email avant validation
    const body = {
      ...req.body,
      email: typeof req.body.email === 'string' ? req.body.email.trim() : req.body.email,
    };
    // Valider les données avec Zod

    try {
      loginSchema.parse(body);
    } catch (zodErr) {
      if (zodErr instanceof ZodError) {
        return res.status(400).json({
          error: "Erreur de validation",
          details: zodErr.issues.map((e) => ({ path: e.path, message: e.message }))
        });
      }
      throw zodErr;
    }

    const { email, password } = body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Identifiants invalides" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Identifiants invalides" });

    const token = generateToken(user._id.toString());
    res.cookie("token", token, { httpOnly: true, path: "/" });

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

// ----- Déconnexion
export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Déconnexion réussie" });
};

// ----- Infos de l'utilisateur connecté
export const me = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
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

// ----- Mise à jour du profil
export const updateProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const avatar = req.file?.filename;
    const { username } = req.body;

    const updateData: any = {};
    if (avatar) updateData.avatar = avatar;
    if (username) {
      try {
        usernameSchema.parse({ username: username.trim() });
        updateData.username = username.trim();
      } catch (zodErr) {
        if (zodErr instanceof ZodError) {
          return res.status(400).json({
            error: "Erreur de validation",
            details: zodErr.issues.map((e) => ({ path: e.path, message: e.message }))
          });
        }
        throw zodErr;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

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
