import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST → attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE → handle expiry
let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if ((status === 401 || status === 403) && !isRedirecting) {
        isRedirecting = true;

        localStorage.removeItem("token");

        alert("Session expired. Please login again.");

        window.location.reload(); // ✅ FIXED
      }
    }

    return Promise.reject(error);
  },
);

export default api;
