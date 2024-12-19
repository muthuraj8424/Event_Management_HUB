import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserProvider } from './context/UserContext';
import axios from "axios";
const root = ReactDOM.createRoot(document.getElementById("root"));
axios.defaults.withCredentials = true;

root.render(
  <React.StrictMode>
    <UserProvider>
    <App />
    </UserProvider>
  </React.StrictMode>
);
