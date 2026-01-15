import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import postsRoutes from "./routes/postsRoutes";
import commentsRoutes from "./routes/commentsRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import cors from "cors";
import path from "path";

const app = express();

// Servir les fichiers statiques du dossier "public/uploads" à l'URL "/uploads"
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

// Middleware pour parser le JSON des requêtes
app.use(express.json());

// Middleware pour parser les cookies
app.use(cookieParser());

// CORS : autoriser le front Vite et les cookies
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // URLs du front Vite
    credentials: true,               // pour les cookies
}));


// Routes
app.use("/api/auth", authRoutes); // Routes d'authentification
app.use("/api/posts", postsRoutes); // Routes des posts
app.use("/api", commentsRoutes); // Routes des commentaires

// Middleware global de gestion des erreurs
app.use(errorMiddleware);

export default app;