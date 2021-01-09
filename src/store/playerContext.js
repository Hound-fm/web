import React from "react";

import { playerDefaultState } from "./defaultState.js";
import { playerReducer } from "./reducers.js";

const PlayerStateContext = React.createContext();
const PlayerDispatchContext = React.createContext();

function PlayerProvider({ children }) {
  const [state, dispatch] = React.useReducer(playerReducer, playerDefaultState);
  return (
    <PlayerStateContext.Provider value={state}>
      <PlayerDispatchContext.Provider value={dispatch}>
        {children}
      </PlayerDispatchContext.Provider>
    </PlayerStateContext.Provider>
  );
}

function usePlayerState() {
  const context = React.useContext(PlayerStateContext);
  if (context === undefined) {
    throw new Error("useCountState must be used within a CountProvider");
  }
  return context;
}

function usePlayerDispatch() {
  const context = React.useContext(PlayerDispatchContext);
  if (context === undefined) {
    throw new Error("useCountDispatch must be used within a CountProvider");
  }
  return context;
}

export { PlayerProvider, usePlayerState, usePlayerDispatch };
