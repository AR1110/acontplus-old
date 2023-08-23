 
import ReactDOM from "react-dom/client"; 

import "./App.css";
import App from "./App.tsx";  
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"; 
import React from "react";

const darkTheme = createTheme({
  palette: {
    mode: 'light', 
      
  },
  
});


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>  
  <ThemeProvider theme={darkTheme}> 
  <CssBaseline/>
    <App /> 
  </ThemeProvider>
  </React.StrictMode>
);
