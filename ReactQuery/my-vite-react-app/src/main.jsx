import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import App from "./App";
import "./index.css";
import { store } from "./store";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a QueryClient instance
const queryClient = new QueryClient();

// Initialize the root element
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReduxProvider store={store}>
      {/* Wrap your App in QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
  </StrictMode>
);
