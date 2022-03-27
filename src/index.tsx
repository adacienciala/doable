import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import "./App.css";
import { NotificationsProvider } from "@mantine/notifications";

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
        <App />
      </NotificationsProvider>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
