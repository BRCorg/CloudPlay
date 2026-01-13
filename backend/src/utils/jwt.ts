import jwt from "jsonwebtoken";

// Générer un token JWT
export const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET non défini");
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Vérifier un token JWT et retourner le payload
export const verifyToken = (token: string): { userId: string } => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET non défini");
  return jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
};
