import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import postsRoutes from "./routes/postsRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import cors from "cors";
import path from "path";

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use(express.json());
app.use(cookieParser());

// CORS : autoriser le front Vite et les cookies
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // URLs du front Vite
    credentials: true,               // pour les cookies
}));


app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);

app.use(errorMiddleware);

export default app;
