import path from "path";
import multer from "multer";
import { Request } from "express";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// STORAGE
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const base = path.basename(file.originalname).replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${base}`);
  }
});

// FILE FILTER
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile?: boolean) => void) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  if (allowed.test(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type. Only images are allowed."));
};

export const uploadSingleFileMiddleware = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo max
}).single("file");
