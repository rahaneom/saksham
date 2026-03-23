import API from "../util/api";

// Register API
export const registerUser = async (data) => {
  return await API.post("/auth/register", data);
};

// Login API
export const loginUser = async (data) => {
  return await API.post("/auth/login", data);
};

// Forgot password API
export const requestPasswordReset = async (data) => {
  return await API.post("/auth/forgot-password", data);
};

// Reset password API
export const resetPassword = async (data) => {
  return await API.post("/auth/reset-password", data);
};
