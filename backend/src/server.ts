import dotenv from "dotenv";
// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

import app from "./app";
import { connectDB } from "./config/database";

// Démarrer le serveur Express sur le port spécifié dans les variables d'environnement ou 5000 par défaut
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

// Lancer le serveur
startServer();
