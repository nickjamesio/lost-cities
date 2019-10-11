import io from "socket.io-client";
import { navigate } from "@reach/router";
import {
  UPDATE_HAND,
  UPDATE_DISCARD,
  UPDATE_PLAYED,
  UPDATE_DRAW_PILE,
  UPDATE_MY_INFO,
  GAME_CREATED,
  GAME_JOINED
} from "./context/GameStateProvider";
import { SOCKET_URL } from "./util/constants";

let socket = io(`${SOCKET_URL}/game`, {autoConnect: false});

export default function configureSocket(dispatch) {
  /**
     * Call to this function is needed to establish the websocket connection.
     * The socket is not opened until authentication is done. The reson for this
     * is the current login implementation uses cookies. For some reason, if the
     * websocket connection is established before the authentication cookie is set,
     * it will not be sent when a message is sent over the socket. The work around
     * is to create the connection after the cookie has been set.
     */
  socket.open();

  socket.on("connect", () => {
    console.log("connected");
  });

  socket.on("disconnect", reason => {
    console.log(`connection deleted ${reason}`);
  });

  // the socket.on method is like an event listener
  // just like how our redux reducer works
  // the different actions that our socket/client will emit
  // is catched by these listeners
  socket.on("game_created", data => {
    dispatch({ type: GAME_CREATED, data });
    navigate(`/game/${data.gameId}`);
  });
  socket.on("updated_hand", data => {
    dispatch({ type: UPDATE_HAND, data });
  });
  socket.on("played_cards", data => {
    dispatch({ type: UPDATE_PLAYED, data });
  });
  socket.on("update_my_info", data => {
    dispatch({ type: UPDATE_MY_INFO, data });
  });
  socket.on("discard_card", data => {
    dispatch({ type: UPDATE_DISCARD, data });
  });
  socket.on("card_drawn", data => {
    dispatch({ type: UPDATE_DRAW_PILE, data });
  });
  socket.on("discard_draw", data => {
    dispatch({ type: UPDATE_DISCARD, data });
  });
  socket.on("game_joined", data => {
    dispatch({ type: GAME_JOINED, data });
    navigate(`/game/${data.gameId}`);
  });

  return socket;
}

export function initializeGame(gameId) {
  socket.emit("initialize_game", { gameId });
}

export function newGame(position) {
  socket.emit("new_game", { position });
}

export function joinGame(gameId, position) {
  socket.emit("join_game", { gameId, position });
}

export function playCard(gameId, cardIndex) {
  socket.emit("play_card", { gameId, cardIndex });
}

export function discardCard(gameId, cardIndex) {
  socket.emit("discard_card", { gameId, cardIndex });
}

export function drawCard(gameId) {
  socket.emit("draw_card", { gameId });
}

export function drawDiscard(gameId, color) {
  socket.emit("draw_discard", { gameId, color });
}
