import React from "react";
import { Router } from "@reach/router";

import PageLayout from "./components/PageLayout";
import Game from "./pages/Game";
import ManageGame from "./pages/ManageGame";
import { GameStateProvider } from "./context/GameStateProvider";
import { GameSocketProvider } from "./context/GameSocketProvider";

function AuthenticatedApp(props) {
  return (
      <GameStateProvider>
        <PageLayout>
          <Router>
            <ManageGame path="/" />
            <Game path="/game/:id" />
          </Router>
        </PageLayout>
      </GameStateProvider>
  );
}

export default AuthenticatedApp;
