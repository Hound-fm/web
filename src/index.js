import React from "react";
import ReactDOM from "react-dom";
import App from "App";
import reportWebVitals from "./reportWebVitals";
import "./css";

import { QueryClient, QueryClientProvider } from "react-query";
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 60 * 1000 * 10, // 10 minutes
      notifyOnChangeProps: "tracked",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
