import API from "../util/api";

// Register API
export const registerUser = async (data) => {
  return await API.post("/auth/register", data);
};

// Login API
export const loginUser = async (data) => {
  return await API.post("/auth/login", data);
};
