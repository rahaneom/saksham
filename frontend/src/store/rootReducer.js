import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookingReducer from "../features/booking/bookingSlice";
import forumReducer from "../features/forum/forumSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
  forum: forumReducer,
});

export default rootReducer;