import React from "react";

import PageLayout from "./components/PageLayout";
import Game from "./pages/Game";
import { Router } from "@reach/router";

function UnauthenticatedApp(props) {
  return (
    <PageLayout>
      <Router>
        <Game path="/" />
      </Router>
    </PageLayout>
  );
}

export default UnauthenticatedApp;
