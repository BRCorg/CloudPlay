import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiError, AuthState } from "./types";
import api from "../../api/apiGlobal";
// Vérifie si le payload est une erreur d'API (ApiError)
// Type guard pour ApiError
function isApiError(payload: unknown): payload is ApiError {
    return (
        typeof payload === 'object' &&
        payload !== null &&
        'error' in payload &&
        typeof (payload as { error?: unknown }).error === 'string'
    );
}


// Au démarrage, l'état initial de l'authentification
// État initial de l'authentification utilisateur
const initialState: AuthState & { justLoggedOut?: boolean } = {
    user: null, // Pas d'utilisateur connecté au départ
    isAuthenticated: false, // Pas authentifié au départ
    loading: false, // Pas de chargement au départ
    error: null,
    hasFetchedMe: false, // Pas encore récupéré les infos utilisateur
    justLoggedOut: false,
};



//----- Actions asynchrones pour l'authentification c'est-à-dire les appels API

// Thunk pour l'inscription d'un utilisateur
export const signup = createAsyncThunk(
    "auth/signup",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            // Appel API pour l'inscription
            const res = await api.post("/api/auth/signup", formData, {
                // Inclure les cookies dans la requête
                withCredentials: true,
            });
            
            // Expect 201 Created pour une inscription
            if (res.status !== 201) {
                console.warn(`POST signup devrait retourner 201 Created, reçu ${res.status}`);
            }
            
            return res.data;
        } catch (err) {
            if (typeof err === 'object' && err && 'response' in err && !(err as { response?: unknown }).response) {
                return rejectWithValue({ error: "Serveur indisponible", status: 503 });
            }
            if (typeof err === 'object' && err && 'response' in err) {
                const response = (err as { response: { data?: unknown; status?: number } }).response;
                const status = response.status || 500;
                const data = response.data as ApiError;
                
                return rejectWithValue({ 
                    error: data.error || "Erreur signup",
                    details: data.details,
                    status 
                });
            }
            return rejectWithValue({ error: "Erreur signup", status: 500 });
        }
    }
);


//----- Action asynchrone pour la connexion (même structure que signup)

// Thunk pour la connexion d'un utilisateur
export const login = createAsyncThunk(
    "auth/login",
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/api/auth/login", data, {
                withCredentials: true,
            });
            
            // Expect 200 OK pour une connexion
            if (res.status !== 200) {
                console.warn(`POST login devrait retourner 200 OK, reçu ${res.status}`);
            }
            
            return res.data;
        } catch (err) {
            if (
                typeof err === 'object' &&
                err &&
                'response' in err &&
                (err as { response?: { data?: { details?: unknown; status?: number } } }).response?.data?.details &&
                Array.isArray((err as { response?: { data?: { details?: unknown[] } } }).response?.data?.details)
            ) {
                const response = (err as { response: { data: { details: { message: string }[]; error?: string }; status?: number } }).response;
                const status = response.status || 422;
                
                // Retourner un ApiError structuré pour que le front puisse afficher les erreurs par champ
                return rejectWithValue({ 
                    error: response.data.error || "Erreur de validation", 
                    details: response.data.details,
                    status 
                });
            }
            // Cas d'identifiants invalides ou autre
            if (typeof err === 'object' && err && 'response' in err) {
                const response = (err as { response?: { data?: { error?: string }; status?: number } }).response;
                const status = response?.status || 500;
                
                if (status === 401) {
                    return rejectWithValue({ error: response?.data?.error || "Identifiants invalides", status: 401 });
                }
                
                return rejectWithValue({ error: response?.data?.error || "Erreur login", status });
            }
            return rejectWithValue({ error: "Erreur login", status: 500 });
        }
    }
);


//----- Action asynchrone pour la déconnexion

// Thunk pour la déconnexion d'un utilisateur
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.post("/api/auth/logout", {}, { withCredentials: true });
            
            // Expect 200 OK pour une déconnexion
            if (res.status !== 200) {
                console.warn(`POST logout devrait retourner 200 OK, reçu ${res.status}`);
            }

            // Forcer la mise à jour de l'état après suppression du cookie
            await dispatch(fetchMe());
        } catch (err) {
            if (typeof err === 'object' && err && 'response' in err) {
                const response = (err as { response?: { status?: number } }).response;
                const status = response?.status || 500;
                return rejectWithValue({ error: "Erreur logout", status });
            }
            return rejectWithValue({ error: "Erreur logout", status: 500 });
        }
    }
);


//----- Action asynchrone pour récupérer les informations de l'utilisateur connecté

// Thunk pour récupérer les infos de l'utilisateur connecté
export const fetchMe = createAsyncThunk(
    "auth/fetchMe",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/auth/me", { withCredentials: true });
            
            // Expect 200 OK pour une récupération
            if (res.status !== 200) {
                console.warn(`GET me devrait retourner 200 OK, reçu ${res.status}`);
            }
            
            return res.data;
        } catch (err) {
            if (typeof err === 'object' && err && 'response' in err) {
                const response = (err as { response?: { data?: { error?: string }; status?: number } }).response;
                const status = response?.status || 500;
                
                // 401 est normal si l'utilisateur n'est pas connecté
                if (status === 401) {
                    return rejectWithValue({ error: "Non authentifié", status: 401 });
                }
                
                return rejectWithValue({ error: response?.data?.error || "Erreur fetchMe", status });
            }
            return rejectWithValue({ error: "Erreur fetchMe", status: 500 });
        }
    }
);


//----- Action asynchrone pour mettre à jour le profil utilisateur

// Thunk pour mettre à jour le profil utilisateur
export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const res = await api.put("/api/auth/me", formData, {
                withCredentials: true,
            });
            
            // Expect 200 OK pour une mise à jour
            if (res.status !== 200) {
                console.warn(`PUT me devrait retourner 200 OK, reçu ${res.status}`);
            }
            
            return res.data.user; // On renvoie l'utilisateur mis à jour
        } catch (err) {
            if (typeof err === 'object' && err && 'response' in err && !(err as { response?: unknown }).response) {
                return rejectWithValue({ error: "Serveur indisponible", status: 503 });
            }
            if (typeof err === 'object' && err && 'response' in err) {
                const response = (err as { response: { data?: unknown; status?: number } }).response;
                const status = response.status || 500;
                const data = response.data as ApiError;
                
                // Gestion par statut HTTP
                if (status === 401) {
                    return rejectWithValue({ error: "Non authentifié", status: 401 });
                }
                if (status === 422) {
                    return rejectWithValue({ 
                        error: data.error || "Erreur de validation",
                        details: data.details,
                        status: 422 
                    });
                }
                
                // Toujours renvoyer l'objet d'erreur complet (avec details) comme pour signup
                return rejectWithValue({ 
                    error: data.error || "Erreur mise à jour profil",
                    details: data.details,
                    status 
                });
            }
            return rejectWithValue({ error: "Erreur mise à jour profil", status: 500 });
        }
    }
);



// Création du slice Redux pour l'authentification
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Action pour réinitialiser l'erreur d'authentification
        clearError(state) {
            state.error = null;
        },
        setJustLoggedOut(state, action) {
            state.justLoggedOut = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder

            
            // Gestion de l'inscription
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user || null;
                state.isAuthenticated = true;
                state.hasFetchedMe = true;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                const payload = action.payload as unknown;
                if (isApiError(payload)) {
                    state.error = {
                        error: payload.error,
                        details: payload.details,
                    };
                } else {
                    state.error = {
                        error: "Erreur signup",
                    };
                }
                state.hasFetchedMe = true;
            })


            
            // Gestion de la connexion
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user || null;
                state.isAuthenticated = true;
                state.hasFetchedMe = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                const payload = action.payload as unknown;
                if (isApiError(payload)) {
                    state.error = {
                        error: payload.error,
                        details: payload.details,
                    };
                } else {
                    state.error = {
                        error: "Erreur login",
                    };
                }
                state.hasFetchedMe = true;
            })


            
            // Gestion de la récupération des infos utilisateur
            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.hasFetchedMe = true;
            })
            .addCase(fetchMe.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.hasFetchedMe = true;
            })


            // Logout (le reset réel est fait par fetchMe)
            // Gestion de la déconnexion
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.justLoggedOut = true;
            })


            // Update profile
            // Gestion de la mise à jour du profil utilisateur
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                const payload = action.payload as unknown;
                if (
                    typeof payload === 'object' &&
                    payload !== null &&
                    'error' in payload &&
                    typeof (payload as { error?: unknown }).error === 'string'
                ) {
                    state.error = {
                        error: (payload as { error: string }).error,
                        details: (payload as { details?: unknown }).details as import("./types").ZodFieldError[] | undefined,
                    };
                } else {
                    state.error = {
                        error: typeof payload === 'string' ? payload : 'Erreur mise à jour profil',
                    };
                }
            });
    },
});

// Export des actions et du reducer du slice d'authentification
export const { clearError, setJustLoggedOut } = authSlice.actions;
export default authSlice.reducer;