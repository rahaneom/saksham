import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Resources from "./pages/resources/Resources";
import Dashboard from "./pages/Dashboard";
import ChatbotPage from "./pages/chatbot/ChatbotPage";
import PrivateRoute from "./components/PrivateRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import CounsellorDashboard from "./pages/booking/CounsellorDashboard";
import BookingPage from "./pages/booking/BookingPage";
import MyAppointmentsPage from "./pages/booking/MyAppointmentsPage";
import ForumPage from "./pages/forum/ForumPage";

function App() {
  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    const normalizedTheme =
      savedTheme === "dark" || savedTheme === "dracula"
        ? "dark"
        : "light"; // default to light theme

    document.documentElement.setAttribute("data-theme", normalizedTheme);
    localStorage.setItem("theme", normalizedTheme);
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/resources"
          element={
            <PrivateRoute>
              <Resources />
            </PrivateRoute>
          }
        />

        <Route
          path="/booking"
          element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/forum"
          element={
            <PrivateRoute>
              <ForumPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/counsellor"
          element={
            <RoleProtectedRoute allowedRole="ROLE_COUNSELLOR">
              <CounsellorDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/my-appointments"
          element={
            <RoleProtectedRoute allowedRole="ROLE_STUDENT">
              <MyAppointmentsPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/chatbot"
          element={
            <RoleProtectedRoute allowedRole="ROLE_STUDENT">
              <ChatbotPage />
            </RoleProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;