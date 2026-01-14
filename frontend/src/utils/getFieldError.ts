import type { ApiError } from "../redux/auth/types";

/**
 * Extrait le message d'erreur pour un champ donné à partir d'une erreur API (Zod)
 * @param error L'objet d'erreur (ApiError | string | string[] | null)
 * @param field Le nom du champ à vérifier
 * @returns Le message d'erreur du champ, ou null
 */
export function getFieldError(error: string | string[] | ApiError | null, field: string): string | null {
  if (!error) return null;
  if (
    typeof error === "object" &&
    error !== null &&
    'details' in error &&
    Array.isArray((error as ApiError).details)
  ) {
    const details = (error as ApiError).details;
    if (!details) return null;
    const fieldError = details.find((e) => e.path.includes(field));
    return fieldError?.message || null;
  }
  return null;
}
