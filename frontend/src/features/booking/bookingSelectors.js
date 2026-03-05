export const selectTodaySlots = (state) => state.booking.todaySlots;
export const selectTomorrowSlots = (state) => state.booking.tomorrowSlots;
export const selectMyAppointments = (state) => state.booking.myAppointments;
export const selectBookingStatus = (state) => state.booking.bookingStatus;
export const selectBookingError = (state) => state.booking.error;