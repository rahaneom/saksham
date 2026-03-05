import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import "./index.css";
import App from "./App.jsx";

const defaultTheme = "light";
localStorage.setItem("theme", defaultTheme);
document.documentElement.setAttribute("data-theme", defaultTheme);

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
