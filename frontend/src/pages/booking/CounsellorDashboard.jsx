import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  AppointmentCard,
  PaginationControls,
  FilterButtons,
  SortControls,
  EmptyState,
} from "../../components/booking";
import counsellorImage from "../../assets/counsellor image.png";

function CounsellorDashboard() {
  const [counsellorInfo, setCounsellorInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("BOOKED");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchAppointments = async () => {
    try {
      const res = await api.get(
        `/api/appointments/counsellor?status=${statusFilter}&page=${page}&size=5`
      );

      setAppointments(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch appointments");
      setAppointments([]);
    }
  };

  const fetchCounsellorInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const user = JSON.parse(jsonPayload);
        
        setCounsellorInfo({
          name: user.name || "Dr. Counsellor",
          email: user.email || user.sub || "counsellor@university.edu",
          qualifications: "M.A. Psychology, B.A. Counselling",
          department: "Student Counselling & Guidance",
          phone: "+91-XXX-XXXX-XXXX",
          photo: counsellorImage
        });
      }
    } catch (err) {
      setCounsellorInfo({
        name: "Dr. Counsellor",
        email: "counsellor@university.edu",
        qualifications: "M.A. Psychology, B.A. Counselling",
        department: "Student Counselling & Guidance",
        phone: "+91-XXX-XXXX-XXXX",
        photo: counsellorImage
      });
    } finally {
      setLoading(false);
    }
  };

  const getSortedAppointments = () => {
    const sorted = [...appointments];
    
    if (sortBy === "date") {
      sorted.sort((a, b) => {
        const dateA = new Date(`${a.slotDate} ${a.startTime}`);
        const dateB = new Date(`${b.slotDate} ${b.startTime}`);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    } else if (sortBy === "name") {
      sorted.sort((a, b) => {
        const comparison = a.studentName.localeCompare(b.studentName);
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }
    
    return sorted;
  };

  const handleComplete = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to mark this appointment as completed?")) {
      return;
    }
    try {
      await api.put(
        `/api/appointments/complete?appointmentId=${appointmentId}`
      );

      fetchAppointments();
    } catch (err) {
      console.error("Failed to mark completed");
    }
  };

  useEffect(() => {
    fetchCounsellorInfo();
    fetchAppointments();
  }, [statusFilter, page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 text-center flex items-center justify-center gap-2 sm:gap-3">
          <svg className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          Counsellor Dashboard
        </h1>

        {/* Counsellor Info Card */}
        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-teal-600"></span>
          </div>
        ) : counsellorInfo ? (
          <div className="card bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-white shadow-xl">
            <div className="card-body py-4 sm:py-6 px-4 sm:px-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Photo Section */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <img 
                    src={counsellorInfo.photo} 
                    alt={counsellorInfo.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/40 object-cover shadow-lg"
                  />
                </div>

                {/* Info Section */}
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-center md:text-left">{counsellorInfo.name || "Counsellor"}</h2>
                  
                  <p className="text-white/90 text-sm sm:text-base font-semibold mb-3 text-center md:text-left">
                    {counsellorInfo.qualifications || "Professional Counsellor"}
                  </p>

                  <p className="text-white/80 text-sm flex items-start gap-2 mb-1 break-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    {counsellorInfo.email || "email@example.com"}
                  </p>

                  <p className="text-white/80 text-sm flex items-start gap-2 mb-1 break-words">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    {counsellorInfo.department || "Department"}
                  </p>

                  <p className="text-white/80 text-sm flex items-start gap-2 break-words">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                    {counsellorInfo.phone || "Phone"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Appointments Section */}
        <div className="space-y-6">
          {/* Filter Buttons */}
          <FilterButtons
            statusFilter={statusFilter}
            onFilterChange={(status) => {
              setStatusFilter(status);
              setPage(0);
            }}
          />

          {/* Sort Options */}
          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={setSortBy}
            onSortOrderChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          />

          {/* Appointment Cards */}
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <EmptyState message="No appointments for this status" />
            ) : (
              getSortedAppointments().map((appt) => (
                <AppointmentCard
                  key={appt.appointmentId}
                  appointment={appt}
                  onMarkComplete={handleComplete}
                  isCounsellor={true}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPrevious={() => setPage(page - 1)}
            onNext={() => setPage(page + 1)}
          />
        </div>

      </div>
    </div>
  );
}

export default CounsellorDashboard;
