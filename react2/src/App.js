import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";

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
  }, [user]);

  return (
    <div className="App">
      <CssBaseline />
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </div>
  );
}

export default App;
