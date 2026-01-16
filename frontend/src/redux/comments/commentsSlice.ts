
// Importation des outils Redux et d'Axios
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiGlobal';
import type { CommentState, CreateCommentPayload, UpdateCommentPayload } from './types';




// Récupérer les commentaires d'un post
export const getComments = createAsyncThunk(
  'comments/getComments',
  async (postId: string) => {
    const response = await api.get(`/api/posts/${postId}/comments`);
    return response.data;
  }
);


// Créer un commentaire
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, content }: CreateCommentPayload, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/posts/${postId}/comments`,
        { content }
      );
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
        return rejectWithValue((err as { response: { data: { details: { message: string }[] } } }).response.data.details.map((issue) => issue.message));
      }
      // Gestion des autres erreurs API
      if (typeof err === 'object' && err && 'response' in err) {
        return rejectWithValue((err as { response?: { data?: { error?: string } } }).response?.data?.error || (err as unknown as Error).message || 'Erreur création commentaire');
      }
      // Erreur générique
      return rejectWithValue((err as unknown as Error).message || 'Erreur création commentaire');
    }
  }
);


// Mettre à jour un commentaire
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content }: UpdateCommentPayload) => {
    const response = await api.put(
      `/api/comments/${commentId}`,
      { content }
    );
    return response.data;
  }
);


// Supprimer un commentaire
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: string) => {
    await api.delete(`/api/comments/${commentId}`);
    return commentId;
  }
);


// Like ou unlike un commentaire
export const toggleLikeComment = createAsyncThunk(
  'comments/toggleLikeComment',
  async (commentId: string) => {
    const response = await api.post(
      `/api/comments/${commentId}/like`
    );
    return response.data;
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
