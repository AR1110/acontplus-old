 
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./App.css";
import "react-tabulator/lib/styles.css";
// import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css";
// import "tabulator-tables/dist/css/tabulator.min.css";
import "react-tabulator/css/tabulator.min.css"; 
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: 'Raleway, Arial',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Raleway';
          font-style: normal;
          font-display: swap;
          font-weight: 400;        
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <CssBaseline/>
    <App />
  </ThemeProvider>
  // </React.StrictMode>
);
