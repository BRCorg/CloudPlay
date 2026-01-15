
// Importation des outils Redux Toolkit et d'Axios pour la gestion des requêtes asynchrones et du state
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; // Outils Redux
import axios from "axios"; // Client HTTP
import type { PostState } from "./types"; // Typage de l'état des posts
import type { AxiosError } from "axios"; // Typage des erreurs Axios
import type { ApiError } from "../auth/types";

// URL de base de l'API backend
const API_URL = "http://localhost:5000";

// Création d'une instance Axios configurée pour l'API
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Permet d'envoyer les cookies (authentification)
});

// Définition de l'état initial du slice posts
const initialState: PostState & { error: string | import("../auth/types").ApiError | null } = {
    loading: false, // Indique si une requête est en cours
    error: null,    // Message d'erreur éventuel (string ou ApiError)
    posts: [],      // Liste des posts
};


// Thunk asynchrone : Récupérer un post par son ID
export const getPostById = createAsyncThunk(
    "posts/getPostById",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/posts/${id}`);
            // Expect 200 OK
            if (res.status !== 200) {
                console.warn(`GET devrait retourner 200 OK, reçu ${res.status}`);
            }
            return res.data.post;
        } catch (err) {
            const error = err as AxiosError<{ error?: string }>;
            const status = error.response?.status;
            
            if (status === 404) {
                return rejectWithValue({ error: "Post non trouvé", status: 404 });
            }
            return rejectWithValue({ 
                error: error.response?.data?.error || error.message || "Erreur récupération post",
                status: status || 500
            });
        }
    }
);


// Thunk asynchrone : Récupérer tous les posts
export const getPosts = createAsyncThunk(
    "posts/getPosts",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/posts");
            // Expect 200 OK
            if (res.status !== 200) {
                console.warn(`GET devrait retourner 200 OK, reçu ${res.status}`);
            }
            return res.data.posts;
        } catch (err) {
            const error = err as AxiosError<{ error?: string }>;
            const status = error.response?.status;
            return rejectWithValue({ 
                error: error.response?.data?.error || error.message || "Erreur récupération posts",
                status: status || 500
            });
        }
    }
);


// Thunk asynchrone : Créer un nouveau post (avec ou sans fichier)
export const createPost = createAsyncThunk(
    "posts/createPost",
    async (data: { title: string; content: string; file?: File }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("content", data.content);
            if (data.file) {
                formData.append("file", data.file);
            }

            const res = await api.post("/api/posts", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            
            // Expect 201 Created pour une création de ressource
            if (res.status !== 201) {
                console.warn(`POST devrait retourner 201 Created, reçu ${res.status}`);
            }
            
            return res.data.post;
        } catch (err) {
            const error = err as AxiosError<ApiError | string>;
            const status = error.response?.status;
            const data = error.response?.data;
            
            // Gestion par statut HTTP
            if (status === 400) {
                return rejectWithValue({ error: "Données invalides", status: 400 });
            }
            if (status === 401) {
                return rejectWithValue({ error: "Non authentifié. Connectez-vous d'abord.", status: 401 });
            }
            if (status === 403) {
                return rejectWithValue({ error: "Vous n'avez pas les permissions nécessaires.", status: 403 });
            }
            if (status === 422 && data && typeof data === 'object' && 'details' in data) {
                return rejectWithValue({ 
                    error: (data as ApiError).error || "Erreur de validation", 
                    details: (data as ApiError).details,
                    status: 422 
                });
            }
            
            // Si le backend renvoie un objet avec details (erreurs de validation)
            if (data && typeof data === 'object' && 'details' in data && Array.isArray((data as ApiError).details)) {
                return rejectWithValue({ 
                    error: (data as ApiError).error || "Erreur de validation", 
                    details: (data as ApiError).details,
                    status: status || 500
                });
            }
            
            // Erreur générique
            let message = (typeof data === 'object' && 'error' in data) ? (data as ApiError).error : (typeof data === 'string' ? data : undefined);
            if (!message && data && typeof data === 'object') {
                message = JSON.stringify(data);
            }
            return rejectWithValue({ 
                error: message || error.message || "Erreur création post",
                status: status || 500
            });
        }
    }
);


// Thunk asynchrone : Supprimer un post par son ID
export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (postId: string, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/api/posts/${postId}`);
            // Expect 204 No Content ou 200 OK pour une suppression
            if (res.status !== 204 && res.status !== 200) {
                console.warn(`DELETE devrait retourner 204 ou 200, reçu ${res.status}`);
            }
            return postId;
        } catch (err) {
            const error = err as AxiosError<{ error?: string }>;
            const status = error.response?.status;
            
            if (status === 404) {
                return rejectWithValue({ error: "Post non trouvé", status: 404 });
            }
            if (status === 403) {
                return rejectWithValue({ error: "Vous ne pouvez pas supprimer ce post", status: 403 });
            }
            if (status === 401) {
                return rejectWithValue({ error: "Non authentifié", status: 401 });
            }
            
            return rejectWithValue({ 
                error: error.response?.data?.error || error.message || "Erreur suppression post",
                status: status || 500
            });
        }
    }
);


// Thunk asynchrone : Like ou unlike un post (toggle)
export const toggleLikePost = createAsyncThunk(
    "posts/toggleLikePost",
    async (postId: string, { rejectWithValue }) => {
        try {
            const res = await api.post(`/api/posts/${postId}/like`);
            // Expect 200 OK pour une action de like/unlike
            if (res.status !== 200) {
                console.warn(`POST like devrait retourner 200 OK, reçu ${res.status}`);
            }
            return res.data;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            const status = error.response?.status;
            
            if (status === 404) {
                return rejectWithValue({ error: "Post non trouvé", status: 404 });
            }
            if (status === 401) {
                return rejectWithValue({ error: "Non authentifié", status: 401 });
            }
            
            return rejectWithValue({ 
                error: error.response?.data?.message || error.message || "Erreur like post",
                status: status || 500
            });
        }
    }
);


// Thunk asynchrone : Mettre à jour un post existant (avec ou sans fichier)
export const updatePost = createAsyncThunk(
    "posts/updatePost",
    async (data: { id: string; title: string; content: string; file?: File }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("content", data.content);
            if (data.file) {
                formData.append("file", data.file);
            }

            const res = await api.put(`/api/posts/${data.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            
            // Expect 200 OK pour une mise à jour
            if (res.status !== 200) {
                console.warn(`PUT devrait retourner 200 OK, reçu ${res.status}`);
            }
            
            return res.data.post;
        } catch (err) {
            const error = err as AxiosError<ApiError | string>;
            const status = error.response?.status;
            const data = error.response?.data;
            
            // Gestion par statut HTTP
            if (status === 404) {
                return rejectWithValue({ error: "Post non trouvé", status: 404 });
            }
            if (status === 401) {
                return rejectWithValue({ error: "Non authentifié", status: 401 });
            }
            if (status === 403) {
                return rejectWithValue({ error: "Vous ne pouvez pas modifier ce post", status: 403 });
            }
            if (status === 422 && data && typeof data === 'object' && 'details' in data) {
                return rejectWithValue({ 
                    error: (data as ApiError).error || "Erreur de validation", 
                    details: (data as ApiError).details,
                    status: 422 
                });
            }
            
            // Si le backend renvoie un objet avec details (erreurs de validation)
            if (data && typeof data === 'object' && 'details' in data && Array.isArray((data as ApiError).details)) {
                return rejectWithValue({ 
                    error: (data as ApiError).error || "Erreur de validation", 
                    details: (data as ApiError).details,
                    status: status || 500
                });
            }
            
            // Erreur générique
            let message = (typeof data === 'object' && 'error' in data) ? (data as ApiError).error : (typeof data === 'string' ? data : undefined);
            if (!message && data && typeof data === 'object') {
                message = JSON.stringify(data);
            }
            return rejectWithValue({ 
                error: message || error.message || "Erreur mise à jour post",
                status: status || 500
            });
        }
    }
);


// Création du slice Redux pour la gestion des posts
const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        // Action pour effacer l'erreur de post (reset l'état d'erreur)
        clearPostError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ----- Récupération de tous les posts -----
            .addCase(getPosts.pending, (state) => {
                // Début du chargement des posts
                state.loading = true;
                state.error = null;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                // Succès : on stocke les posts
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(getPosts.rejected, (state, action) => {
                // Échec : on stocke le message d'erreur
                state.loading = false;
                state.error = action.error.message || 'Erreur récupération posts';
            })

            // ----- Création d'un post -----
            .addCase(createPost.pending, (state) => {
                // Début de la création d'un post
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                // Succès : on ajoute le post créé en début de liste
                state.loading = false;
                state.posts = [action.payload, ...state.posts];
            })
            .addCase(createPost.rejected, (state, action) => {
                // Échec : on stocke l'objet d'erreur complet (payload) si présent, sinon message
                state.loading = false;
                if (action.payload) {
                    state.error = action.payload as string | import("../auth/types").ApiError;
                } else {
                    state.error = action.error.message || 'Erreur création post';
                }
            })

            // ----- Suppression d'un post -----
            .addCase(deletePost.pending, (state) => {
                // Début de la suppression
                state.loading = true;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                // Succès : on retire le post supprimé
                state.loading = false;
                state.posts = state.posts.filter((p) => p._id !== action.payload);
            })
            .addCase(deletePost.rejected, (state, action) => {
                // Échec : on stocke le message d'erreur
                state.loading = false;
                state.error = action.error.message || 'Erreur suppression post';
            })

            // ----- Mise à jour d'un post -----
            .addCase(updatePost.pending, (state) => {
                // Début de la mise à jour
                state.loading = true;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                // Succès : on remplace le post modifié
                state.loading = false;
                const index = state.posts.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })
            .addCase(updatePost.rejected, (state, action) => {
                // Échec : on stocke l'objet d'erreur complet (payload) si présent, sinon message
                state.loading = false;
                if (action.payload) {
                    state.error = action.payload as string | import("../auth/types").ApiError;
                } else {
                    state.error = action.error.message || 'Erreur mise à jour post';
                }
            })

            // ----- Like/unlike d'un post -----
            .addCase(toggleLikePost.fulfilled, (state, action) => {
                // Succès : on met à jour le post liké/unliké
                const index = state.posts.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })

            // ----- Récupération d'un post par ID (pour détail) -----
            .addCase(getPostById.fulfilled, (state, action) => {
                // Succès : on ajoute ou met à jour le post détaillé
                state.loading = false;
                const index = state.posts.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                } else {
                    state.posts = [action.payload, ...state.posts];
                }
            });
    },
});

// Export des actions et du reducer du slice posts
export const { clearPostError } = postSlice.actions;
export default postSlice.reducer;