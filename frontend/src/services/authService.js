import API from "../util/api";

// Register API
export const registerUser = async (data) => {
  return await API.post("/api/auth/register", data);
};

// Login API
export const loginUser = async (data) => {
  return await API.post("/api/auth/login", data);
};

// Forgot password API
export const requestPasswordReset = async (data) => {
  return await API.post("/api/auth/forgot-password", data);
};

// Reset password API
export const resetPassword = async (data) => {
  return await API.post("/api/auth/reset-password", data);
};

// Get profile API
export const getProfile = async () => {
  return await API.get("/api/users/me");
};

// Update profile API
export const updateProfile = async (data) => {
  return await API.put("/api/users/me", data);
};

// Optionally expose an explicit user endpoint for future
export const updateUserProfile = async (data) => {
  return await API.put("/api/users/me", data);
};
