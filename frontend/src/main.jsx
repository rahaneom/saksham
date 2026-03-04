import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";

localStorage.setItem(
  "token",
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvbUB0ZXN0LmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NzI2MzY5ODYsImV4cCI6MTc3MjcyMzM4Nn0.LEAJl0GYGNKZD0UPLQNgzK34BqiMvyHGXby2t1fZ-J0",
);

const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
