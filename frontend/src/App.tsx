import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchMe, setJustLoggedOut } from "./redux/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";

import type { RootState } from "./app/store";
function App() {
  const dispatch = useAppDispatch();
  const justLoggedOut = useAppSelector((state: RootState) => state.auth.justLoggedOut);

  useEffect(() => {
    if (!justLoggedOut) {
      dispatch(fetchMe());
    } else {
      // Reset the flag so next reload will fetchMe again
      dispatch(setJustLoggedOut(false));
    }
  }, [dispatch, justLoggedOut]);

  return <AppRoutes />;
}

export default App;