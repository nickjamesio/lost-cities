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

function join_game(event, socket) {
  const position = document.forms.join_game.player_position.value;
  const game_id = document.forms.join_game.game_id.value
  socket.emit('join_game', {position, game_id},
    data => {
      console.log('callback after emit')
    }
  );
  event.preventDefault();
}

function play_card(event, socket) {
  const index = document.forms.play_card.card_index.value;
  const game_id = document.forms.play_card.game_id.value
  socket.emit(
    'play_card',
    {card_index: index, game_id},
    (data) => {
      console.log('callback after emit')
    });
  event.preventDefault();
}

function refreshToken(data) {
  const x = 1;
  // fetch('http://localhost:5000/refresh', {
  //   method: 'post',
  //   headers: {
  //     "Content-type": "application/json"
  //   },
  //   credentials: 'include',
  // })
  
}

function test(event, socket) {
  socket.emit('test', {blah:'blah'})
}

function log(data) {
  console.log(data)
}

function App() {
  const socket = io.connect('http://localhost:5000/game');
  socket.on('game_created', log);
  socket.on('join_game', log);
  socket.on('card_played', log);
  socket.on('expired token', refreshToken);

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

        <form id="join_game" onSubmit={e => join_game(e, socket)}>
          <h5>Join game</h5>
          <label>Game id</label>
          <input type="text" name="game_id" />
          <input type="radio" name="player_position" value="first" defaultChecked/> First
          <input type="radio" name="player_position" value="second" /> Second
          <input type="submit" />
        </form>

        <form id="play_card" onSubmit={e => play_card(e, socket)}>
          <h5>Play card</h5>
          <label>Index</label>
          <input type="text" name="card_index" />
          <input type="submit" />
        </form>

        <button onClick={e => test(e, socket)}>Test</button>
    </div>
  );
}

export default App;
