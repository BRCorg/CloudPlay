//--------------------- Redux slice pour la gestion des posts ---------------------//
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { PostState } from "./types";

const API_URL = "http://localhost:5000";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

const initialState: PostState = {
    loading: false,
    error: null,
    posts: [],
};

// Thunk pour récupérer les posts
export const getPosts = createAsyncThunk(
    "posts/getPosts",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/posts");
            return res.data.posts;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.error || err.message || "Erreur récupération posts");
        }
    }
);

// Thunk pour créer un post avec upload d'image
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
            return res.data.post;
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
            .addCase(getPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = [action.payload, ...state.posts];
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default postSlice.reducer;
