import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState
} from "react";

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
const GameSocketContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case GAME_CREATED:
      console.log(action.data);
      return action.data;
    case UPDATE_HAND:
      console.log(action.data);
      return {
        ...state,
        ...action.data
      };
    case UPDATE_DISCARD:
      console.log(action.data);
      return {
        ...state,
        ...action.data
      };
    case UPDATE_PLAYED:
      console.log(action.data);
      return {
        ...state,
        ...action.data
      };
    case UPDATE_DRAW_PILE:
      console.log(action.data);
      return {
        ...state,
        ...action.data
      };
      case UPDATE_MY_INFO:
        console.log(action.data);
        return {
          ...state,
          ...action.data
        };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
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
    }
  });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(configureSocket(dispatch));
    // return () => {
    //   if (socket) {
    //     socket.disconnect();
    //   }
    // };
  }, []);

  return (
    <GameSocketContext.Provider value={socket}>
      <GameStateContext.Provider value={state}>
        <GameDispatchContext.Provider value={dispatch}>
          {children}
        </GameDispatchContext.Provider>
      </GameStateContext.Provider>
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
