import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import forumReducer from "../features/forum/forumSlice";
import resourceReducer from "../features/resource/resourceSlice";
import bookingReducer from "../features/booking/bookingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    forum: forumReducer,
    resources: resourceReducer,
    booking: bookingReducer
  },
});

export default store;

