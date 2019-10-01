import React, {
  createContext,
  useContext,
  useState,
} from "react";

import configureSocket from "../socket";

const GameSocketContext = createContext();

export function GameSocketProvider({ children, dispatch }) {
  const socket = configureSocket(dispatch);

  return (
    <GameSocketContext.Provider value={socket}>
      {children}
    </GameSocketContext.Provider>
  );
}

export function useGameSocket() {
  const context = useContext(GameSocketContext);
  if (context === undefined) {
    throw new Error(`useGameSocket must be used within a GameProvider`);
  }
  return context;
}
