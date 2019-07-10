import React from 'react';
import Login from './pages/Login'
import { Router, Link } from "@reach/router";

function App() {
  return (
    <div className="App">
      <header>
        Learn React
      </header>

      <Router>
        <Login path="login"/>
      </Router>
    </div>
  );
}

export default App;
