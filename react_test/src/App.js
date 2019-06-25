import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import io from "socket.io-client";
import RegisterForm from "./register_form";
import LoginForm from "./login_form";
import NewGameForm from "./newgame_form";
import JoinGameForm from "./joingame_form";
import GameData from "./game_data";
import PlayCardForm from "./playcard_form";
import DrawCard from './drawcard_form';

function test(event, socket) {
  socket.emit("test", { blah: "blah" });
}

function log(data) {
  console.log(data);
}

function App() {
  const [gameId, setGameId] = useState(0);
  const [playerHand, setPlayerHand] = useState([]);
  const [playedCards, setPlayedCards] = useState({
    green: [],
    red: [],
    blue: [],
    white: [],
    yellow: []
  });
  const [drawPile, setDrawPile] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [cardIndex, setCardIndex] = useState(undefined);
  const [playerPosition, setPlayerPosition] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState(1);

  const socket = io.connect("http://localhost:5000/game");

  function setGameData(data) {
    if (data.hasOwnProperty("gameId")) {
      setGameId(data["gameId"]);
    }
    setDrawPile(data["drawPile"]);
    setDiscardPile(data["discardPile"]);
    setPlayerHand(data["playerHand"]);
    setPlayedCards(data["playedCards"]);

    console.log(data);
  }

  function playedCard(data) {
    setPlayerHand(data["playerHand"]);
    setPlayedCards(data["playedCards"]);
  }

  function drawnCard(data) {
    setPlayerHand(data["playerHand"]);
    setDrawPile(data["drawPile"]);
  }

  // Handle socket responses
  socket.on("game_created", setGameData);
  socket.on("game_joined", setGameData);
  socket.on("card_played", playedCard);
  socket.on("card_drawn", drawnCard);


  return (
    <div className="App">
      <RegisterForm />
      <LoginForm />
      <NewGameForm socket={socket} />
      <JoinGameForm socket={socket} setGameId={setGameId} />
      <GameData
        gameId={gameId}
        playerHand={playerHand}
        playedCards={playedCards}
        drawPile={drawPile}
        discardPile={discardPile}
        currentPlayer={currentPlayer}
      />
      <PlayCardForm gameId={gameId} socket={socket} />
      <DrawCard gameId={gameId} socket={socket} />
      {/* <button onClick={e => test(e, socket)}>Test</button> */}
    </div>
  );
}

export default App;
