
import ReactDOM from "react-dom/client"; 
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import "./App.css";
import App from "./App.tsx";
import { DarkModeProvider } from "./context/DarkModeContext.tsx";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <DarkModeProvider> {/*Dark or light mode */}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App />
    </LocalizationProvider>
  </DarkModeProvider>

  // </React.StrictMode>
);
