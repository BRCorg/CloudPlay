// ------ Extension des types Express pour inclure l'utilisateur ------//

// On importe les types d'Express pour pouvoir les étendre
import "express";

// On déclare un espace global pour modifier les types de la lib Express
declare global {
  namespace Express {
    // On ajoute une propriété 'user' optionnelle à l'interface Request
    // Cela permet d'accéder à req.user dans tous les middlewares/controllers
    interface Request {
      user?: {
        _id: string;      // ID MongoDB de l'utilisateur
        email: string;    // Email de l'utilisateur
        username: string; // Nom d'utilisateur
        avatar?: string;  // Avatar (optionnel)
      };
    }
  }
}