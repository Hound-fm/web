import React from "react";

import { settingsDefaultState } from "./defaultState.js";
import { settingsReducer } from "./reducers.js";

const SettingsStateContext = React.createContext();
const SettingsDispatchContext = React.createContext();

function SettingsProvider({ children }) {
  const [state, dispatch] = React.useReducer(
    settingsReducer,
    settingsDefaultState
  );
  return (
    <SettingsStateContext.Provider value={state}>
      <SettingsDispatchContext.Provider value={dispatch}>
        {children}
      </SettingsDispatchContext.Provider>
    </SettingsStateContext.Provider>
  );
}

function useSettingsState() {
  const context = React.useContext(SettingsStateContext);
  if (context === undefined) {
    throw new Error("useCountState must be used within a CountProvider");
  }
  return context;
}

function useSettingsDispatch() {
  const context = React.useContext(SettingsDispatchContext);
  if (context === undefined) {
    throw new Error("useCountDispatch must be used within a CountProvider");
  }
  return context;
}

export { SettingsProvider, useSettingsState, useSettingsDispatch };
