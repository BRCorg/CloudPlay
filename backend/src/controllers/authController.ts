import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { z } from "zod";
import { generateToken } from "../utils/jwt"; // On utilise l'utilitaire JWT

// Validation avec Zod
/**
 *  Ce que Zod fait ici :
 *   -email doit être une chaîne valide et forme d’email
 *   -password doit avoir au moins 6 caractères
 *   -username au moins 2 caractères
 */
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(2),
});

//----- Fonction pour l'inscription
export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // D'abord on valide les données
        const data = signupSchema.parse(req.body);

        // Ensuite on hash le mot de passe avec bcrypt avant de le stocker
        // 10 rounds de “salt” pour renforcer la sécurité contre les attaques par dictionnaire
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Puis on crée l'utilisateur dans la base de données
        const user = await User.create({
            ...data,
            password: hashedPassword,
            avatar: req.file?.filename,
        });

        // Générer un token et connecter automatiquement l'utilisateur après l'inscription
        const token = generateToken(user._id.toString());
        res.cookie("token", token, { httpOnly: true, sameSite: "lax" });

        // Renvoie les infos utiles au front (sans mot de passe)
        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
            },
        });
    } catch (err: any) {

        // Duplication email
        if (err.code === 11000 && err.keyPattern?.email) {
            return res.status(400).json({ error: [{ path: ["email"], message: "Email déjà utilisé" }] });
        }


        // Erreur de validation Zod
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.issues });
        }
        next(err);
    }
};

//----- Fonction pour la connexion
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // D'abord on récupère email et password depuis le corps de la requête
        const { email, password } = req.body;

        // Ensuite on cherche l'utilisateur dans la base de données
        const user = await User.findOne({ email });

        // Si l'utilisateur n'existe pas ou si le mot de passe est incorrect, on renvoie une erreur
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        // On compare le mot de passe fourni avec le mot de passe hashé stocké dans la bdd
        const isValid = await bcrypt.compare(password, user.password);

        // Si le mot de passe est incorrect, on renvoie une erreur
        if (!isValid)
            return res.status(401).json({ error: "Identifiants invalides" });

        // Si tout est bon, on génère un token JWT avec l'ID de l'utilisateur + le jwt secret et une expiration de 7 jours
        const token = generateToken(user._id.toString());

        // On envoie le token dans un cookie HTTP-only pour la sécurité
        res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
        res.json({ message: "Connexion réussie" });
    } catch (err) {
        next(err);
    }
};

// ----- Fonction pour la déconnexion
export const logout = (_req: Request, res: Response) => {
    // On efface le cookie du token pour déconnecter l'utilisateur
    res.clearCookie("token");
    res.json({ message: "Déconnexion réussie" });
};

// ----- Fonction pour récupérer les infos de l'utilisateur connecté
export const me = async (req: any, res: Response) => {
    res.json(req.user);
};


export const updateProfile = async (req: any, res: Response) => {
    const userId = req.user._id;
    const avatar = req.file?.filename;
    const { username } = req.body;

    const updateData: any = {};
    if (avatar) updateData.avatar = avatar;
    if (username) updateData.username = username;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
    );

    res.json({ user: updatedUser });
};