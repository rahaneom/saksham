import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import resourceReducer from "../features/resource/resourceSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    resources: resourceReducer,
  },
});

export default store;


