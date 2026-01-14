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
import type { AxiosError } from "axios";

export const getPosts = createAsyncThunk(
    "posts/getPosts",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/posts");
            return res.data.posts;
        } catch (err) {
            const error = err as AxiosError<{ error?: string }>;
            return rejectWithValue(error.response?.data?.error || error.message || "Erreur récupération posts");
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
        } catch (err) {
            const error = err as AxiosError<{ error?: string }>;
            return rejectWithValue(error.response?.data?.error || error.message || "Erreur création post");
        }
    }
);

// Thunk pour supprimer un post
export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (postId: string, { rejectWithValue }) => {
        try {
            await api.delete(`/api/posts/${postId}`);
            return postId;
        } catch (err) {
            const error = err as AxiosError<{ error?: string }>;
            return rejectWithValue(error.response?.data?.error || error.message || "Erreur suppression post");
        }
    }
);

// Thunk pour toggle like sur un post
export const toggleLikePost = createAsyncThunk(
    "posts/toggleLikePost",
    async (postId: string, { rejectWithValue }) => {
        try {
            const res = await api.post(`/api/posts/${postId}/like`);
            return res.data;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || "Erreur like post");
        }
    }
);

// Thunk pour mettre à jour un post
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
            return res.data.post;
        } catch (err) {
            const error = err as AxiosError<{ error?: string }>;
            return rejectWithValue(error.response?.data?.error || error.message || "Erreur mise à jour post");
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
            })
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = state.posts.filter((p) => p._id !== action.payload);
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updatePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.posts.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(toggleLikePost.fulfilled, (state, action) => {
                const index = state.posts.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            });
    },
});

export default postSlice.reducer;