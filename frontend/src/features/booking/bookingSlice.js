import { createSlice } from "@reduxjs/toolkit";
import { BOOKING_STATUS } from "./bookingTypes";
import {
  fetchBookingSlots,
  bookSlot,
  fetchMyAppointments,
  cancelAppointment,
} from "./bookingThunks";

const initialState = {
  slots: {},
  myAppointments: [],
  fetchStatus: BOOKING_STATUS.IDLE,
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

      // FETCH SLOTS (FIXED)
      .addCase(fetchBookingSlots.pending, (state) => {
        state.fetchStatus = BOOKING_STATUS.LOADING;
      })
      .addCase(fetchBookingSlots.fulfilled, (state, action) => {
        state.slots = action.payload;
        state.fetchStatus = BOOKING_STATUS.SUCCESS;
      })
      .addCase(fetchBookingSlots.rejected, (state, action) => {
        state.fetchStatus = BOOKING_STATUS.ERROR;
        state.error = action.payload;
      })

      // BOOK SLOT (CORRECT)
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

      // MY APPOINTMENTS
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.myAppointments = action.payload;
      })

      // CANCEL
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.myAppointments = state.myAppointments.filter(
          (a) => a.id !== action.payload,
        );
      });
  },
});

export const { resetBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
