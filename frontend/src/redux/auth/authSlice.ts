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
// Importations principales : Redux Toolkit, types, et instance Axios
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiError, AuthState } from "./types";
import api from "../../api/apiGlobal";


// Au démarrage, l'état initial de l'authentification
// État initial de l'authentification utilisateur
const initialState: AuthState = {
    user: null, // Pas d'utilisateur connecté au départ
    isAuthenticated: false, // Pas authentifié au départ
    loading: false, // Pas de chargement au départ
    error: null,
    hasFetchedMe: false, // Pas encore récupéré les infos utilisateur
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
            return res.data;
        } catch (err) {
            if (typeof err === 'object' && err && 'response' in err && !(err as { response?: unknown }).response) {
                return rejectWithValue("Serveur indisponible");
            }
            if (typeof err === 'object' && err && 'response' in err) {
                return rejectWithValue((err as { response: { data?: unknown } }).response.data as ApiError);
            }
            return rejectWithValue("Erreur signup");
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
            return res.data;
        } catch (err) {
            if (
                typeof err === 'object' &&
                err &&
                'response' in err &&
                (err as { response?: { data?: { details?: unknown } } }).response?.data?.details &&
                Array.isArray((err as { response?: { data?: { details?: unknown[] } } }).response?.data?.details)
            ) {
                // Retourner un ApiError structuré pour que le front puisse afficher les erreurs par champ
                return rejectWithValue({ error: "Erreur de validation", details: (err as { response: { data: { details: { message: string }[] } } }).response.data.details });
            }
            // Cas d'identifiants invalides ou autre
            if (typeof err === 'object' && err && 'response' in err) {
                return rejectWithValue({ error: (err as { response?: { data?: { error?: string } } }).response?.data?.error || "Erreur login" });
            }
            return rejectWithValue({ error: "Erreur login" });
        }
    }
);


//----- Action asynchrone pour la déconnexion

// Thunk pour la déconnexion d'un utilisateur
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { dispatch }) => {
        await api.post("/api/auth/logout", {}, { withCredentials: true });

        // Forcer la mise à jour de l'état après suppression du cookie
        await dispatch(fetchMe());
    }
);


//----- Action asynchrone pour récupérer les informations de l'utilisateur connecté

// Thunk pour récupérer les infos de l'utilisateur connecté
export const fetchMe = createAsyncThunk(
    "auth/fetchMe",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/auth/me", { withCredentials: true });
            return res.data;
        } catch (err) {
            if (typeof err === 'object' && err && 'response' in err) {
                return rejectWithValue((err as { response?: { data?: { error?: string } } }).response?.data?.error || "Erreur fetchMe");
            }
            return rejectWithValue("Erreur fetchMe");
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
            return res.data.user; // On renvoie l'utilisateur mis à jour
        } catch (err) {
            if (typeof err === 'object' && err && 'response' in err && !(err as { response?: unknown }).response) {
                return rejectWithValue("Serveur indisponible");
            }
            if (typeof err === 'object' && err && 'response' in err) {
                // Toujours renvoyer l’objet d’erreur complet (avec details) comme pour signup
                return rejectWithValue((err as { response: { data?: unknown } }).response.data as ApiError);
            }
            return rejectWithValue("Erreur mise à jour profil");
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
export const { clearError } = authSlice.actions;
export default authSlice.reducer;