import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { grey } from "@mui/material/colors";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

// Create a custom theme
const theme = createTheme({
  palette: {
    background: {
      default: grey[100],
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
