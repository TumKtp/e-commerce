import { createTheme } from "@mui/material"

export const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h1: { fontSize: 38, lineHeight: "50px" },
    h2: { fontSize: 32, lineHeight: "42px" },
    h3: { fontSize: 28, lineHeight: "36px" },
    h4: { fontSize: 24, lineHeight: "32px" },
    h5: { fontSize: 20, lineHeight: "24px" },
    h6: { fontSize: 16, lineHeight: "22px" },
    body1: { fontSize: 16, lineHeight: "24px" },
    body2: { fontSize: 14, lineHeight: "22px" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        text: {
          textTransform: "none",
          borderRadius: "6px",
        },
      },
    },
  },
})
