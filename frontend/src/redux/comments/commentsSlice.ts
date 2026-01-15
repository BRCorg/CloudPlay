
// Importation des outils Redux et d'Axios
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { CommentState, CreateCommentPayload, UpdateCommentPayload } from './types';

// URL de base de l'API
const API_URL = 'http://localhost:5000/api';

// Instance Axios configurée pour l'API
const axiosInstance = axios.create({
  withCredentials: true,
});


// Récupérer les commentaires d'un post
export const getComments = createAsyncThunk(
  'comments/getComments',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/posts/${postId}/comments`);
      
      // Expect 200 OK pour une récupération
      if (response.status !== 200) {
        console.warn(`GET comments devrait retourner 200 OK, reçu ${response.status}`);
      }
      
      return response.data;
    } catch (err) {
      if (typeof err === 'object' && err && 'response' in err) {
        const error = err as { response?: { status?: number; data?: { error?: string } } };
        const status = error.response?.status || 500;
        
        if (status === 404) {
          return rejectWithValue({ error: "Post non trouvé", status: 404 });
        }
        
        return rejectWithValue({ 
          error: error.response?.data?.error || "Erreur récupération commentaires",
          status 
        });
      }
      return rejectWithValue({ error: "Erreur récupération commentaires", status: 500 });
    }
  }
);


// Créer un commentaire
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, content }: CreateCommentPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/posts/${postId}/comments`,
        { content }
      );
      
      // Expect 201 Created pour une création
      if (response.status !== 201) {
        console.warn(`POST comment devrait retourner 201 Created, reçu ${response.status}`);
      }
      
      return response.data;
    } catch (err) {
      // Gestion des erreurs de validation (Zod)
      if (
        typeof err === 'object' &&
        err &&
        'response' in err &&
        (err as { response?: { data?: { details?: unknown } } }).response?.data?.details &&
        Array.isArray((err as { response?: { data?: { details?: unknown[] } } }).response?.data?.details)
      ) {
        const error = err as { response: { data: { details: { message: string }[] }; status?: number } };
        const status = error.response.status || 422;
        
        return rejectWithValue({ 
          error: "Erreur de validation",
          details: error.response.data.details.map((issue) => issue.message),
          status 
        });
      }
      // Gestion des autres erreurs API
      if (typeof err === 'object' && err && 'response' in err) {
        const error = err as { response?: { data?: { error?: string }; status?: number } };
        const status = error.response?.status || 500;
        
        if (status === 401) {
          return rejectWithValue({ error: "Non authentifié", status: 401 });
        }
        if (status === 404) {
          return rejectWithValue({ error: "Post non trouvé", status: 404 });
        }
        
        return rejectWithValue({ 
          error: error.response?.data?.error || (err as unknown as Error).message || 'Erreur création commentaire',
          status 
        });
      }
      // Erreur générique
      return rejectWithValue({ error: (err as unknown as Error).message || 'Erreur création commentaire', status: 500 });
    }
  }
);


// Mettre à jour un commentaire
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content }: UpdateCommentPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${API_URL}/comments/${commentId}`,
        { content }
      );
      
      // Expect 200 OK pour une mise à jour
      if (response.status !== 200) {
        console.warn(`PUT comment devrait retourner 200 OK, reçu ${response.status}`);
      }
      
      return response.data;
    } catch (err) {
      if (typeof err === 'object' && err && 'response' in err) {
        const error = err as { response?: { data?: { error?: string }; status?: number } };
        const status = error.response?.status || 500;
        
        if (status === 404) {
          return rejectWithValue({ error: "Commentaire non trouvé", status: 404 });
        }
        if (status === 401) {
          return rejectWithValue({ error: "Non authentifié", status: 401 });
        }
        if (status === 403) {
          return rejectWithValue({ error: "Vous ne pouvez pas modifier ce commentaire", status: 403 });
        }
        
        return rejectWithValue({ 
          error: error.response?.data?.error || "Erreur mise à jour commentaire",
          status 
        });
      }
      return rejectWithValue({ error: "Erreur mise à jour commentaire", status: 500 });
    }
  }
);


// Supprimer un commentaire
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/comments/${commentId}`);
      
      // Expect 204 No Content ou 200 OK pour une suppression
      if (response.status !== 204 && response.status !== 200) {
        console.warn(`DELETE comment devrait retourner 204 ou 200, reçu ${response.status}`);
      }
      
      return commentId;
    } catch (err) {
      if (typeof err === 'object' && err && 'response' in err) {
        const error = err as { response?: { data?: { error?: string }; status?: number } };
        const status = error.response?.status || 500;
        
        if (status === 404) {
          return rejectWithValue({ error: "Commentaire non trouvé", status: 404 });
        }
        if (status === 401) {
          return rejectWithValue({ error: "Non authentifié", status: 401 });
        }
        if (status === 403) {
          return rejectWithValue({ error: "Vous ne pouvez pas supprimer ce commentaire", status: 403 });
        }
        
        return rejectWithValue({ 
          error: error.response?.data?.error || "Erreur suppression commentaire",
          status 
        });
      }
      return rejectWithValue({ error: "Erreur suppression commentaire", status: 500 });
    }
  }
);


// Like ou unlike un commentaire
export const toggleLikeComment = createAsyncThunk(
  'comments/toggleLikeComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/comments/${commentId}/like`
      );
      
      // Expect 200 OK pour une action de like/unlike
      if (response.status !== 200) {
        console.warn(`POST like comment devrait retourner 200 OK, reçu ${response.status}`);
      }
      
      return response.data;
    } catch (err) {
      if (typeof err === 'object' && err && 'response' in err) {
        const error = err as { response?: { data?: { error?: string }; status?: number } };
        const status = error.response?.status || 500;
        
        if (status === 404) {
          return rejectWithValue({ error: "Commentaire non trouvé", status: 404 });
        }
        if (status === 401) {
          return rejectWithValue({ error: "Non authentifié", status: 401 });
        }
        
        return rejectWithValue({ 
          error: error.response?.data?.error || "Erreur like commentaire",
          status 
        });
      }
      return rejectWithValue({ error: "Erreur like commentaire", status: 500 });
    }
  }
);


// État initial des commentaires
const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};


// Création du slice Redux pour la gestion des commentaires
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Action pour vider la liste des commentaires
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ----- Récupération des commentaires d'un post -----
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Echec récupération commentaires';
      })

      // ----- Création d'un commentaire -----
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Echec création commentaire';
      })

      // ----- Mise à jour d'un commentaire -----
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Echec mise à jour commentaire';
      })

      // ----- Suppression d'un commentaire -----
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c._id !== action.payload);
      })

      // ----- Like/unlike d'un commentaire -----
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      });
  },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
