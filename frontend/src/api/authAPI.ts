import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:5000", // ton serveur Express
  withCredentials: true, // si tu utilises des cookies
});

export default api;
