import React from "react";
import { AuthProvider } from "./AuthContext";

function AppProviders({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

export default AppProviders;
