import React from "react";
import ReactDOM from "react-dom";
// polyfill Buffer for libraries that expect Node core 'buffer'
import { Buffer } from "buffer";
import App from "./App";

if (typeof window !== "undefined" && !window.Buffer) window.Buffer = Buffer;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
