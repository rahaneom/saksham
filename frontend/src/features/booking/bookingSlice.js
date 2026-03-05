import { createSlice } from "@reduxjs/toolkit";
import { BOOKING_STATUS } from "./bookingTypes";
import {
  fetchBookingSlots,
  bookSlot,
  fetchMyAppointments,
  cancelAppointment,
} from "./bookingThunks";

const initialState = {
  todaySlots: [],
  tomorrowSlots: [],
  myAppointments: [],
  bookingStatus: BOOKING_STATUS.IDLE,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingStatus(state) {
      state.bookingStatus = BOOKING_STATUS.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔵 Fetch Slots
      .addCase(fetchBookingSlots.pending, (state) => {
        state.bookingStatus = BOOKING_STATUS.LOADING;
      })
      .addCase(fetchBookingSlots.fulfilled, (state, action) => {
        state.todaySlots = action.payload.today;
        state.tomorrowSlots = action.payload.tomorrow;
        state.bookingStatus = BOOKING_STATUS.SUCCESS;
      })
      .addCase(fetchBookingSlots.rejected, (state, action) => {
        state.bookingStatus = BOOKING_STATUS.ERROR;
        state.error = action.payload;
      })

      // 🔵 Book Slot
      .addCase(bookSlot.pending, (state) => {
        state.bookingStatus = BOOKING_STATUS.LOADING;
      })
      .addCase(bookSlot.fulfilled, (state) => {
        state.bookingStatus = BOOKING_STATUS.SUCCESS;
      })
      .addCase(bookSlot.rejected, (state, action) => {
        state.bookingStatus = BOOKING_STATUS.ERROR;
        state.error = action.payload;
      })

      // 🔵 My Appointments
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.myAppointments = action.payload;
      })

      // 🔵 Cancel Appointment
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.myAppointments = state.myAppointments.filter(
          (a) => a.id !== action.payload
        );
      });
  },
});

export const { resetBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;