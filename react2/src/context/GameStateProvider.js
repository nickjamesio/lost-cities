import React, { createContext, useContext, useReducer, useEffect } from "react";

import configureSocket from "../socket";

export const UPDATE_HAND = 0;
export const UPDATE_DISCARD = 1;
export const UPDATE_PLAYED = 2;
export const UPDATE_DRAW_PILE = 3;
export const UPDATE_MY_INFO = 4;
export const GAME_CREATED = 5;
export const GAME_JOINED = 6;

const GameStateContext = createContext();
const GameDispatchContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case GAME_CREATED:
      return action.data;
    case GAME_JOINED:
      return {
        ...state,
        ...action.data
      };
    case UPDATE_HAND:
      return {
        ...state,
        ...action.data
      };
    case UPDATE_DISCARD:
      return {
        ...state,
        ...action.data
      };
    case UPDATE_PLAYED:
      return {
        ...state,
        ...action.data
      };
    case UPDATE_DRAW_PILE:
      return {
        ...state,
        ...action.data
      };
    case UPDATE_MY_INFO:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
}

export function GameStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    gameId: null,
    hand: [],
    position: "1",
    played: {
      "1": {
        green: [],
        blue: [],
        red: [],
        white: [],
        yellow: []
      },
      "2": {
        green: [],
        blue: [],
        red: [],
        white: [],
        yellow: []
      }
    },
    deck: [],
    discard: {
      green: [],
      blue: [],
      red: [],
      white: [],
      yellow: []
    },
    players: {
      "1": {},
      "2": {}
    },
    over: false
  });

  useEffect(() => {
    const socket = configureSocket(dispatch);
    
    return () => socket.close();
  }, []);

  return (
      <GameStateContext.Provider value={state}>
        <GameDispatchContext.Provider value={dispatch}>
          {children}
        </GameDispatchContext.Provider>
      </GameStateContext.Provider>
  );
}

export function useGameDispatch() {
  const context = useContext(GameDispatchContext);
  if (context === undefined) {
    throw new Error(`useGameDispatch must be used within a GameProvider`);
  }
  return context;
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error(`useGameState must be used within a GameProvider`);
  }
  return context;
}
