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
  // axios.defaults.withCredentials = true;
  // axios.post('http://localhost:5000/login', {
  //   withCredentials: true,
  //   username: document.forms.login.username2.value,
  //   password: document.forms.login.password2.value
  // })
  // .then(function (response) {
  //   console.log(response);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });
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

function testSocket() {
  const socket = io.connect('http://localhost:5000/game');
  socket.emit('new_game', {blah: 1})
}

function App() {
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
        <button onClick={testSocket}>Socket</button>
    </div>
  );
}

export default App;
