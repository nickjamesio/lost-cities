import React from "react";
import { Router } from "@reach/router";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

function UnauthenticatedApp(props) {
  return (
    <Router>
      <Login path="/" default />
      <Signup path="/signup" />
    </Router>
  );
}

export default UnauthenticatedApp;
