import React from "react";

import { queueDefaultState } from "./defaultState.js";
import { queueReducer } from "./reducers.js";

const QueueStateContext = React.createContext();
const QueueDispatchContext = React.createContext();

function QueueProvider({ children }) {
  const [state, dispatch] = React.useReducer(queueReducer, queueDefaultState);
  return (
    <QueueStateContext.Provider value={state}>
      <QueueDispatchContext.Provider value={dispatch}>
        {children}
      </QueueDispatchContext.Provider>
    </QueueStateContext.Provider>
  );
}

function useQueueState() {
  const context = React.useContext(QueueStateContext);
  if (context === undefined) {
    throw new Error("useCountState must be used within a CountProvider");
  }
  return context;
}

function useQueueDispatch() {
  const context = React.useContext(QueueDispatchContext);
  if (context === undefined) {
    throw new Error("useCountDispatch must be used within a CountProvider");
  }
  return context;
}

export { QueueProvider, useQueueState, useQueueDispatch };
