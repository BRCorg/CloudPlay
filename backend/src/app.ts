import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import cors from "cors";
import path from "path";

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use(express.json());
app.use(cookieParser());

// CORS : autoriser le front Vite et les cookies
app.use(cors({
    origin: "http://localhost:5173", // l'URL du front Vite
    credentials: true,               // pour les cookies
}));


app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

export default app;
