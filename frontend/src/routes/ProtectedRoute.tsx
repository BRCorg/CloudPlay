import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type { JSX } from "react/jsx-dev-runtime";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading, user } = useAppSelector(
    (state) => state.auth
  );

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "loading:", loading, "user:", user);



  if (loading) {
    return (<p>Chargement...</p>);
  }

  // On ne redirige vers /login que si loading est fini ET qu'on n'est pas authentifié
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  console.log("ProtectedRoute - Accès autorisé");
  return children;
};

export default ProtectedRoute;
