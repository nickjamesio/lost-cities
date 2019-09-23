import io from "socket.io-client";
import {
  UPDATE_HAND,
  UPDATE_DISCARD,
  UPDATE_PLAYED,
  UPDATE_DRAW_PILE,
  UPDATE_MY_INFO,
  GAME_CREATED,
  GAME_JOINED
} from "./context/GameContext";
import { navigate } from "@reach/router";
import { URL } from "./util/constants";

function configureSocket(dispatch) {
  const socket = io(`${URL}/game`);

  // make sure our socket is connected to the port
  socket.on("connect", () => {
    console.log("connected");
  });

  socket.on("disconnect", () => {
    console.log("connection deleted");
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
};

// cosntants to be used in place of the event parameter when sending
// data to the server using socket.emit()
export const NEW_GAME = "new_game";
export const JOIN_GAME = "join_game";
export const PLAY_CARD = "play_card";
export const DISCARD_CARD = "discard_card";
export const DRAW_CARD = "draw_card";
export const DISCARD_DRAW = "draw_discard";
export const INITIALIZE_GAME = "initialize_game";

export default configureSocket;
