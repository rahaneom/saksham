import { Route, Routes } from "react-router-dom";
import "./App.css";
import BookingPage from './pages/booking/BookingPage';
import MyAppointmentsPage from './pages/booking/MyAppointmentsPage';
import CounsellorDashboard from "./pages/booking/CounsellorDashboard";

function App() {
  return (
    <div data-theme="dracula" className="min-h-screen flex items-center justify-center">
      <Routes>
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/my-appointments" element={<MyAppointmentsPage />} />
        <Route path="/counsellor-dashboard" element={<CounsellorDashboard />} />
      </Routes>
    </div>
  );
}

export default App;


