import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// 🔵 Fetch Today + Tomorrow Slots
export const fetchBookingSlots = createAsyncThunk(
  "booking/fetchSlots",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/appointments/slots/booking");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch slots");
    }
  }
);

// 🔵 Book Appointment
export const bookSlot = createAsyncThunk(
  "booking/bookSlot",
  async (slotId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/appointments/book?slotId=${slotId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Booking failed");
    }
  }
);

// 🔵 Fetch Student Appointments
export const fetchMyAppointments = createAsyncThunk(
  "booking/fetchMyAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/appointments/student");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load appointments");
    }
  }
);

// 🔵 Cancel Appointment
export const cancelAppointment = createAsyncThunk(
  "booking/cancelAppointment",
  async (appointmentId, { rejectWithValue }) => {
    try {
      await api.put(`/api/appointments/cancel?appointmentId=${appointmentId}`);
      return appointmentId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Cancel failed");
    }
  }
);