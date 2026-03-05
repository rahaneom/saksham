import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");

let user = null;

if (token) {
  const decoded = jwtDecode(token);
  user = {
    email: decoded.sub,
    role: decoded.role,
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: token || null,
    user,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      const decoded = jwtDecode(action.payload);
      state.user = {
        email: decoded.sub,
        role: decoded.role,
      };
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;