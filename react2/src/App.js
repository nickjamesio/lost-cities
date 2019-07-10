import React from 'react';
import Login from './pages/Login'
import Register from './pages/Register'
import { Router, Link } from "@reach/router";

function App() {
  return (
    <div className="App">
      <Router>
        <Register path="register"/>
        <Login path="login"/>
      </Router>
    </div>
  );
}

export default App;
