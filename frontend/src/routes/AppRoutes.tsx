import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import Home from "../pages/Home";
import PostsPage from "../pages/PostsPage";
import PostDetail from "../pages/PostDetail";
import Profile from "../pages/Profile";
import { useAppSelector } from "../app/hooks";
import ProtectedRoute from "./ProtectedRoute";
import ProfileSetup from "../pages/ProfileSetup";
import type { RootState } from "../app/store";

const AppRoutes = () => {
  const { loading } = useAppSelector((state: RootState) => state.auth);

  if (loading) return <p>Chargement...</p>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />

        {/* Routes protégées */}
        <Route path="/posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
        <Route path="/posts/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

