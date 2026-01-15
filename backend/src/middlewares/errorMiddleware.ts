//--------------- Middleware de gestion des erreurs globales --------------//

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";




// ZodError est une classe d'erreurs spécifique à Zod qui capture les erreurs de validation des schémas
//------ Fonction middleware pour gérer les erreurs
export const errorMiddleware = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {

    // Log complet de l'erreur côté serveur pour faciliter le debug
    console.error("[Error Middleware]", err);

    // Si l'erreur est une erreur de validation Zod
    if (err instanceof ZodError) {

        // On renvoie une réponse 400 avec les détails de l'erreur
        return res.status(400).json({
            error: "Erreur de validation",
            details: err.issues, // issues contient les détails spécifiques des erreurs de validation
        });
    }

    // Pour toutes les autres erreurs, on renvoie une réponse 500
    res.status(500).json({
        error: "Erreur serveur",
        details: err.message,
    });
};
