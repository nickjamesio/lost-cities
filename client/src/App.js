import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";

import CustomTheme from "./theme";
import { useAuth } from "./context/AuthContext";
import { me } from "./util/auth";
import AuthenticatedApp from "./authenticated-app";
import UnauthenticatedApp from "./unauthenticated-app";
import Spinner from "./components/Spinner";

function App() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await me();
      if (result.code === 200) {
        setUser(result.data);
      }
      // Once we have a respone from calling the /me endpoint, we
      // can set loading to false. It does not matter if the user
      // is authenticated or not
      setLoading(false);
    }
    fetchData();
  }, [setUser]);

  return (
    <CustomTheme>
      <CssBaseline />
      {loading ? <Spinner /> : null}
      {!loading && user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </CustomTheme>
  );
}

export default App;
