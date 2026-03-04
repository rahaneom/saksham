import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";

localStorage.setItem(
  "token",
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoYXJzaEB0ZXN0LmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NzI1Mjc1MTgsImV4cCI6MTc3MjYxMzkxOH0.1F7LsmYebZCEMr_8U966FOr496QQ9Z0ni49YO0CGOTU",
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
