//--------------------- Redux slice pour la gestion des posts ---------------------//
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { PostState } from "./types";

const initialState: PostState = {
    loading: false,
    error: null,
    posts: [],
};

// Thunk pour créer un post avec upload d'image
export const createPost = createAsyncThunk(
    "posts/createPost",
    async (data: { title: string; content: string; file?: File }, { rejectWithValue }) => {
        try {
            
            // On gère l'upload de l'image si elle est fournie
            let imageUrl: string | null = null;

            if (data.file) {
                const form = new FormData();
                form.append("file", data.file);
                const uploadRes = await axios.post("/api/upload/post", form, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                imageUrl = uploadRes.data?.url ?? null;
            }

            // Ensuite, on crée le post avec les données et l'URL de l'image si disponible
            const payload = { title: data.title, content: data.content, ...(imageUrl ? { image: imageUrl } : {}) };
            
            // Appel API pour créer le post
            const res = await axios.post("/api/posts", payload);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.error || err.message || "Erreur création post");
        }
    }
);


// Création du slice
const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts.push(action.payload); 
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default postSlice.reducer;
