import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import "./index.css";
import App from "./App.jsx";

localStorage.setItem(
  "token",
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvbUB0ZXN0LmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NzI2MzY5ODYsImV4cCI6MTc3MjcyMzM4Nn0.LEAJl0GYGNKZD0UPLQNgzK34BqiMvyHGXby2t1fZ-J0",
);

const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster position="top-right" />
    </Provider>
  </StrictMode>,
);
