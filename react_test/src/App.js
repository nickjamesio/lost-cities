import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import io from 'socket.io-client';

function register(event) {
  axios.post('http://localhost:5000/register', {
    username: document.forms.signup.username.value,
    password: document.forms.signup.password.value
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  event.preventDefault();
}
function login(event) {
  fetch('http://localhost:5000/login', {
    method: 'post',
    headers: {
      "Content-type": "application/json"
    },
    credentials: 'include',
    body:JSON.stringify({
      username: document.forms.login.username2.value,
      password: document.forms.login.password2.value
    })
  }).then(function(response) {
      return response.json();
  }).then(function(result) {
    console.log(result)
  })
  event.preventDefault();
}

function new_game(event, socket) {
  const position = document.forms.new_game.player_position.value;
  socket.emit('new_game', {position});
  event.preventDefault();
}

function log(data) {
  console.log(data)
}

function App() {
  const socket = io.connect('http://localhost:5000/game');
  socket.on('game_data', log);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <form id="signup" onSubmit={register}>
          <h5>Sign up form</h5>
          <label htmlFor="username">Username </label>
          <input type="text" name="username" id="username" />
          <label htmlFor="password">Password </label>
          <input type="password" name="password" id="password" />
          <input type="submit" />
        </form>

        <form id="login" onSubmit={login}>
          <h5>Login form</h5>
          <label htmlFor="username2">Username </label>
          <input type="text" name="username2" id="username2" />
          <label htmlFor="password2">Password </label>
          <input type="password" name="password2" id="password2" />
          <input type="submit" />
        </form>
        <form id="new_game" onSubmit={e => new_game(e, socket)}>
          <h5>New game</h5>
          <input type="radio" name="player_position" value="first" defaultChecked/> First
          <input type="radio" name="player_position" value="second" /> Second
          <input type="submit" />
        </form>
    </div>
  );
}

export default App;
