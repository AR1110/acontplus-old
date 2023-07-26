import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./App.css";
import "react-tabulator/lib/styles.css";
// import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css";
// import "tabulator-tables/dist/css/tabulator.min.css";
import "react-tabulator/css/tabulator.min.css";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
