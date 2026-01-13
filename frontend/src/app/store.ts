//-------------- Store Redux de l'application --------------//

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import postReducer from "../redux/posts/postsSlice";


// D'abord, on configure le store avec les différents slices
export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
  },
});

// Types pour le state global et le dispatch
// RootState correspond au state global de l'application
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
