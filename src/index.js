import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/adminShell.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Amplify
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

// Configure Amplify with API_KEY authentication for GraphQL
const amplifyConfig = {
  ...awsExports,
  aws_appsync_authenticationType: "API_KEY",
  API: {
    GraphQL: {
      endpoint: awsExports.aws_appsync_graphqlEndpoint,
      region: awsExports.aws_appsync_region,
      defaultAuthMode: "apiKey",
      apiKey: awsExports.aws_appsync_apiKey,
    },
  },
};

Amplify.configure(amplifyConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
