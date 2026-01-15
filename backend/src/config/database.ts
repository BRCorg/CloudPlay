// ------------- Config pour la connexion à la base de données MongoDB -------------

import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    // On utilise la variable d'environnement MONGO_URI pour se connecter à la base de données
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error", error);
    
    // On arrête le processus en cas d'erreur de connexion
    process.exit(1);
  }
};
