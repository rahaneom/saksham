import { combineReducers } from "@reduxjs/toolkit";
import bookingReducer from "../features/booking/bookingSlice";

const rootReducer = combineReducers({
  booking: bookingReducer,
});

export default rootReducer;