import type { ApiError } from "../redux/auth/types";

/**
 * Extrait le message d'erreur pour un champ donné à partir d'une erreur API (Zod)
 * @param error L'objet d'erreur (ApiError | string | string[] | null)
 * @param field Le nom du champ à vérifier
 * @returns Le message d'erreur du champ, ou null
 */
export function getFieldError(error: string | string[] | ApiError | null, field: string): string | null {
  // Si pas d'erreur, retourner null
  if (!error) return null;

  // Vérifier si l'erreur est de type ApiError avec des détails
  if (
    typeof error === "object" &&
    error !== null &&
    'details' in error &&
    Array.isArray((error as ApiError).details)
  ) {
    // Rechercher l'erreur correspondant au champ spécifié
    const details = (error as ApiError).details;

    // Si pas de détails, retourner null
    if (!details) return null;

    // Trouver l'erreur liée au champ
    const fieldError = details.find((e) => e.path.includes(field));
    
    // Retourner le message d'erreur ou null si pas trouvé
    return fieldError?.message || null;
  }

  // Si l'erreur n'est pas structurée, retourner null
  return null;
}
