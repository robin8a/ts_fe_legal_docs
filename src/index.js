import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/adminShell.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Amplify } from "aws-amplify";
import outputs from "./amplify_outputs.json";

Amplify.configure(outputs);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
