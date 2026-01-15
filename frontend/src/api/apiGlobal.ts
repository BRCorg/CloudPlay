import axios from "axios";

// On utilise axios pour faire des requêtes HTTP vers le backend Express

const api = axios.create({
  baseURL: "http://localhost:5000", // URL de mon serveur Express
  withCredentials: true, // pour les cookies
});

export default api;
