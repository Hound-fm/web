import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ThemeContext } from "./store/context";
import Player from "./components/player";
import { QueryClient, QueryClientProvider } from "react-query";

// import reportWebVitals from './reportWebVitals';

import "./css";

const queryClient = new QueryClient({
  defaultOptions: {
    staleTime: 100 * 60 * 5,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeContext.Provider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Player />
      </QueryClientProvider>
    </ThemeContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
