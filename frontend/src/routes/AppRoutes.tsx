import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
// import PostsPage from "../pages/PostsPage/";
// import PostsDetailPage from "../pages/PostsDetailPage/PostsDetailPage";
import { useAppSelector } from "../app/hooks";
import ProtectedRoute from "./ProtectedRoute";
import ProfileSetup from "../pages/SignupPage/ProfileSetup";

const AppRoutes = () => {
  const { loading } = useAppSelector((state) => state.auth);

  if (loading) return <p>Chargement...</p>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route
          path="/login"
          element={ <LoginPage /> }
        />
        <Route
          path="/signup"
          element={ <SignupPage /> }
        />
        <Route
          path="/profile-setup"
          element={ <ProfileSetup /> }
        />

          {/* Route home (temporaire) */}
          <Route path="/" element={<ProtectedRoute><p>HOME</p></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};


export default AppRoutes;
