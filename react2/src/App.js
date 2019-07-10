import React from 'react';
import Login from './pages/Login'
import Register from './pages/Register'
import { Router, Link } from "@reach/router";

import CssBaseline from "@material-ui/core/CssBaseline"

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Router>
        <Register path="register"/>
        <Login path="login"/>
      </Router>
    </div>
  );
}

export default App;
