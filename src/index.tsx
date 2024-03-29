import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./App.css";
import { ChatContextProvider } from "./utils/chatContext";
import { HeaderContextProvider } from "./utils/headerContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (_, error: any) =>
        error.statusCode === 404 || error.statusCode === 403,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        colors: {
          // you can generate it with those: https://mantine.dev/theming/extend-theme/#extend-or-replace-colors
          yellow: [
            "#FFF9C5",
            "#FFF7B2",
            "#FFF69F",
            "#FFF48B",
            "#FFF278",
            "#FFEF5B",
            "#FFEC3E",
            "#f7e436",
            "#f2df30",
            "#ebca28",
          ],
        },
        primaryColor: "yellow",
        fontFamily: "Montserrat, sans-serif",
        colorScheme: "dark",
      }}
    >
      <NotificationsProvider>
        <ChatContextProvider>
          <HeaderContextProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </HeaderContextProvider>
        </ChatContextProvider>
      </NotificationsProvider>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
