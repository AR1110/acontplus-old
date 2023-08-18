 
import ReactDOM from "react-dom/client";
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';

import "./App.css";
import App from "./App.tsx";  
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

const darkTheme = createTheme({
  palette: {
    mode: 'light', 
      
  },
  
});


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>  
  <ThemeProvider theme={darkTheme}>
     <CssBaseline />
    <App /> 
  </ThemeProvider>
  // </React.StrictMode>
);
