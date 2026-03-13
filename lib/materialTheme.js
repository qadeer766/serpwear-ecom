import { createTheme } from "@mui/material/styles";
import { Assistant } from "next/font/google";

const assistantFont = Assistant({
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
});

// ----------------------
// LIGHT THEME
// ----------------------
export const lightTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#8e51ff",
    },

    secondary: {
      main: "#8e51ff",
      light: "#f8fafc",
    },

    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },

    text: {
      primary: "#030712",
      secondary: "#6B7280",
    },

    success: {
      main: "#22c55e",
    },
  },

  typography: {
    fontFamily: assistantFont.style.fontFamily,
  },
});

// ----------------------
// DARK THEME
// ----------------------
export const darkTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#8e51ff",
    },

    background: {
      default: "#0b0a10",
      paper: "#0b0a10",
    },

    text: {
      primary: "#d4d4d4",
      secondary: "#9ca3af",
    },
  },

  typography: {
    fontFamily: assistantFont.style.fontFamily,
  },
});