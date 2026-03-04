import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import forumReducer from "../features/forum/forumSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forum: forumReducer,
  },
});
