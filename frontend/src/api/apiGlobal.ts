// frontend/src/api/apiGlobal.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// Intercepteur de réponse pour gérer les statuts HTTP
api.interceptors.response.use(
  (response) => {
    // Vérification des statuts de succès
    const { method, url } = response.config;
    const { status } = response;

    // Log pour debug
    console.log(`✅ ${method?.toUpperCase()} ${url}: ${status}`);

    // Vérifications optionnelles des statuts attendus
    if (method === 'post' && url && !url.includes('/like') && !url.includes('/login') && !url.includes('/logout')) {
      if (status !== 201) {
        console.warn(`⚠️ POST devrait retourner 201 Created, reçu ${status}`);
      }
    }
    if (method === 'delete' && status !== 204 && status !== 200) {
      console.warn(`⚠️ DELETE devrait retourner 204 ou 200, reçu ${status}`);
    }

    return response;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const url = error.config?.url;

      // Gestion spécifique par statut HTTP
      switch (status) {
        case 400:
          console.error(`❌ [400] Requête invalide sur ${url}:`, data);
          break;
        case 401:
          console.error(`❌ [401] Non authentifié sur ${url}`);
          // Possibilité de rediriger vers /login
          break;
        case 403:
          console.error(`❌ [403] Accès interdit sur ${url}`);
          break;
        case 404:
          console.error(`❌ [404] Ressource non trouvée sur ${url}`);
          break;
        case 422:
          console.error(`❌ [422] Erreur de validation sur ${url}:`, data);
          break;
        case 500:
          console.error(`❌ [500] Erreur serveur sur ${url}`);
          break;
        default:
          console.error(`❌ [${status}] Erreur sur ${url}:`, data);
      }
    }
    return Promise.reject(error);
  }
);

export default api;