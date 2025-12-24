import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers";

import App from "./App";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const lightOrDark = () => {
  // Check zustand store for theme preference
  const stored = localStorage.getItem("deployboard-storage");
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state.theme && state.theme !== "system") {
        return state.theme;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  // Fall back to system theme
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  } else {
    return "light";
  }
};

const theme = createTheme({
  palette: {
    mode: lightOrDark(),
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

root.render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </LocalizationProvider>
  </StrictMode>
);
