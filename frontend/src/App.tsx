import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchMe } from "./redux/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";

import type { RootState } from "./app/store";
function App() {
  const dispatch = useAppDispatch();
  const justLoggedOut = useAppSelector((state: RootState) => state.auth.justLoggedOut);

  useEffect(() => {
    if (!justLoggedOut) {
      dispatch(fetchMe());
    }
    // On ne reset plus justLoggedOut ici : il ne sera remis à false qu'après un login/signup réussi
  }, [dispatch, justLoggedOut]);

  return <AppRoutes />;
}

export default App;