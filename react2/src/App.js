import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";

import CustomTheme from "./theme";
import { useAuth } from "./context/AuthContext";
import { me } from "./util/auth";
import AuthenticatedApp from "./authenticated-app";
import UnauthenticatedApp from "./unauthenticated-app";

function App() {
  const { user, setUser } = useAuth();

  useEffect(() => {
    async function fetchData() {
      const result = await me();
      if (result.code === 200) {
        setUser(result.data);
      }
    }
    fetchData();
  }, [setUser]);

  return (
    <CustomTheme>
      <CssBaseline />
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </CustomTheme>
  );
}

export default App;
