import React from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Router } from "@reach/router";

import CssBaseline from "@material-ui/core/CssBaseline";

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Router>
        <Signup path="signup" />
        <Login path="login" />
      </Router>
    </div>
  );
}

export default App;
