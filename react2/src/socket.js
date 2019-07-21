import io from "socket.io-client";
import {
  UPDATE_HAND,
  UPDATE_DISCARD,
  UPDATE_PLAYED,
  UPDATE_DRAW_PILE,
  GAME_CREATED
} from "./context/GameContext";
import { navigate } from "@reach/router";

const URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API
    : process.env.REACT_APP_DEV_API;

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
    navigate(`/game/${data.gameId}`);
    dispatch({ type: GAME_CREATED, data });
  });
  socket.on("GUESS_WHO_PITCHED_IN", name => {
    dispatch({ type: "PICTHED_IN", name });
  });
  socket.on("CURRENT_POT", pot =>
    dispatch({ type: "CURRENT_POT_TO_REDUCER", pot: pot })
  );
  socket.on("SEND_NAMES_TO_CLIENTS", names =>
    dispatch({ type: "PUT_ALL_NAMES_TO_REDUCER", names })
  );
  socket.on("GUESS_WHO_GOT_ONE", name => dispatch({ type: "GOT_ONE", name }));
  return socket;
};

// the following are fucntions that our client side uses
// to emit actions to everyone connected to our web socket
export const NEW_GAME = "new_game";
export const JOIN_GAME = "join_game";
export const PLAY_CARD = "play_card";
export const DISCARD_CARD = "discard_card";
export const DRAW_CARD = "draw_card";
export const DISCARD_DRAW = "draw_discard";

export default configureSocket;
