import { Route, Routes } from "react-router-dom";
import "./App.css";
import ForumPage from "./pages/forum/ForumPage";
import BookingPage from './pages/booking/BookingPage';
import MyAppointmentsPage from './pages/booking/MyAppointmentsPage';
import CounsellorDashboard from "./pages/booking/CounsellorDashboard";
import ChatbotPage from "./pages/chatbot/ChatbotPage";

function App() {
  return (
    <div data-theme="dracula" className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      <Routes>
        <Route path="/" element={<ForumPage />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/my-appointments" element={<MyAppointmentsPage />} />
        <Route path="/counsellor-dashboard" element={<CounsellorDashboard />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
    </div>
  );
}

export default App;
