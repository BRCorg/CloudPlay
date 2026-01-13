import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { ApiError, AuthState } from "./types";
import api from "../../api/authAPI";


// Au démarrage, l'état initial de l'authentification
const initialState: AuthState = {
    user: null, // Pas d'utilisateur connecté au départ
    isAuthenticated: false, // Pas authentifié au départ
    loading: false, // Pas de chargement au départ
    error: null, // Pas d'erreur au départ
};



//----- Actions asynchrones pour l'authentification c'est-à-dire les appels API
export const signup = createAsyncThunk(
    "auth/signup",
    async (
        formData: FormData,
        { rejectWithValue }
    ) => {
        try {

            // Appel API pour l'inscription
            const res = await api.post("/api/auth/signup", formData, {
                // Inclure les cookies dans la requête
                withCredentials: true,
            });
            return res.data;
        }
        catch (err: any) {
            if (!err.response) {
                return rejectWithValue("Serveur indisponible");
            }

            return rejectWithValue(err.response.data as ApiError);
        }
    }
);


//----- Action asynchrone pour la connexion (même structure que signup)
export const login = createAsyncThunk(
    "auth/login",
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/api/auth/login", data, {
                withCredentials: true,
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || "Erreur login");
        }
    }
);


//----- Action asynchrone pour la déconnexion
export const logout = createAsyncThunk("auth/logout", async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
});

//----- Action asynchrone pour récupérer les informations de l'utilisateur connecté
export const fetchMe = createAsyncThunk(
    "auth/fetchMe",
    // (On ne passe pas de données ici donc le premier argument est _)
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/auth/me", { withCredentials: true });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || "Erreur fetchMe");
        }
    }
);

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const res = await api.put("/api/auth/me", formData, { withCredentials: true });
            return res.data.user; // On renvoie l'utilisateur mis à jour
        } catch (err: any) {
            if (!err.response) return rejectWithValue("Serveur indisponible");
            return rejectWithValue(err.response.data?.error || "Erreur mise à jour profil");
        }
    }
);


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Signup
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
    state.loading = false;
    // Ajouter ceci pour mettre l'utilisateur dans le store
    state.user = action.payload.user || null;
    state.isAuthenticated = true;
})

         .addCase(signup.rejected, (state, action) => {
    state.loading = false;
    const payload = action.payload as ApiError | any;

    state.error = {
        error: typeof payload?.error === "string" ? payload.error : "Erreur signup",
        details: Array.isArray(payload?.error) ? payload.error : undefined,
    };
})
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user || null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })

            // FetchMe
            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchMe.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Met à jour directement l'utilisateur dans le store
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as AuthState["error"];
            });


    },
});

export default authSlice.reducer;
