import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { CommentState, CreateCommentPayload, UpdateCommentPayload, IComment } from './types';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  withCredentials: true,
});

// Get comments for a post
export const getComments = createAsyncThunk(
  'comments/getComments',
  async (postId: string) => {
    const response = await axiosInstance.get(`${API_URL}/posts/${postId}/comments`);
    return response.data;
  }
);

// Create comment
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, content }: CreateCommentPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/posts/${postId}/comments`,
        { content }
      );
      return response.data;
    } catch (err: any) {
      if (err?.response?.data?.details && Array.isArray(err.response.data.details)) {
        return rejectWithValue(err.response.data.details.map((issue: any) => issue.message));
      }
      return rejectWithValue(err?.response?.data?.error || err.message || 'Erreur création commentaire');
    }
  }
);

// Update comment
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content }: UpdateCommentPayload) => {
    const response = await axiosInstance.put(
      `${API_URL}/comments/${commentId}`,
      { content }
    );
    return response.data;
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: string) => {
    await axiosInstance.delete(`${API_URL}/comments/${commentId}`);
    return commentId;
  }
);

// Toggle like on comment
export const toggleLikeComment = createAsyncThunk(
  'comments/toggleLikeComment',
  async (commentId: string) => {
    const response = await axiosInstance.post(
      `${API_URL}/comments/${commentId}/like`
    );
    return response.data;
  }
);

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get comments
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
        state.error = action.error.message || 'Failed to fetch comments';
      })
      
      // Create comment
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
        state.error = action.error.message || 'Failed to create comment';
      })
      
      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c._id !== action.payload);
      })
      
      // Toggle like
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
