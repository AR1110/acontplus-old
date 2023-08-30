 
import ReactDOM from "react-dom/client"; 
import React from "react";
import "./App.css";
import App from "./App.tsx";  
import { DarkModeProvider } from "./context/DarkModeContext.tsx"; 
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
       <DarkModeProvider> {/*Dark or light mode */}
       <App/>    
       </DarkModeProvider>
  
  // </React.StrictMode>
);
