import React from "react";
import { AuthProvider } from "./AuthContext";
import { GameProvider } from "../context/GameContext";

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <GameProvider>{children}</GameProvider>
    </AuthProvider>
  );
}

export default AppProviders;
