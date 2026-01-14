import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { fetchMe } from "./redux/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;