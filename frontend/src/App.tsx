import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { fetchMe } from "./redux/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Appeler fetchMe() au démarrage pour vérifier si l'utilisateur a une session valide
    // Le cookie httpOnly sera envoyé automatiquement avec la requête
    dispatch(fetchMe());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
