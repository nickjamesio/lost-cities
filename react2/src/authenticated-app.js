import React from "react";
import { Router } from "@reach/router";

import PageLayout from "./components/PageLayout";
import Game from "./pages/Game";
import ManageGame from "./pages/ManageGame";

function AuthenticatedApp(props) {
  return (
    <PageLayout>
      <Router>
        <ManageGame path="/" />
        <Game path="/game/:id" />
      </Router>
    </PageLayout>
  );
}

export default AuthenticatedApp;
