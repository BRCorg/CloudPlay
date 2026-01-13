import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { fetchMe } from "./redux/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // On ne veut appeler fetchMe() que si un token existe dans les cookies
    // Ça évite de déclencher un 401 sur la page /signup ou /login
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (token) {
      // Si token trouvé, on récupère les infos de l'utilisateur connecté
      dispatch(fetchMe());
    }
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
