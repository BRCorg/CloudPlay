//----------- Middleware de validation d'upload de fichiers --------------//
import path from "path";
import multer from "multer";
import { Request } from "express";

// Chemin du dossier d'uploads
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// STORAGE
const storage = multer.diskStorage({

  // Destination et nom du fichier
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, UPLOAD_DIR);
  },

  // Nom du fichier : timestamp + nom d'origine (espaces remplacés par _)
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const base = path.basename(file.originalname).replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${base}`);
  }
});

// FILE FILTER
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile?: boolean) => void) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  if (allowed.test(file.mimetype)) cb(null, true);
  else cb(new Error("Type de fichier invalide. Seules les images sont autorisées."));
};


// Gére l'upload d'un seul fichier avec le champ "file"
export const uploadSingleFileMiddleware = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo max
}).single("file");
