import { useEffect, useState } from "react";
import api from "../../services/api";

function CounsellorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("BOOKED");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

  const handleComplete = async (appointmentId) => {
    try {
      await api.put(
        `/api/appointments/complete?appointmentId=${appointmentId}`
      );

      fetchAppointments(); // refresh list
    } catch (err) {
      console.error("Failed to mark completed");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, page]);

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold text-center">
        Counsellor Dashboard
      </h1>

      {/* 🔵 Filter Buttons */}
      <div className="flex justify-center gap-4">
        <button
          className={`btn ${statusFilter === "BOOKED" ? "btn-primary" : "btn-outline"}`}
          onClick={() => {
            setStatusFilter("BOOKED");
            setPage(0);
          }}
        >
          Booked
        </button>

        <button
          className={`btn ${statusFilter === "COMPLETED" ? "btn-success" : "btn-outline"}`}
          onClick={() => {
            setStatusFilter("COMPLETED");
            setPage(0);
          }}
        >
          Completed
        </button>
      </div>

      {/* 🔵 Appointment Cards */}
      <div className="space-y-4">
        {appointments.map((appt) => (
          <div key={appt.appointmentId} className="card bg-base-200 shadow">
            <div className="card-body">

              <h2 className="font-semibold">
                {appt.studentName} ({appt.academicYear})
              </h2>

              <p>{appt.phone}</p>

              <p>
                {appt.slotDate} | {appt.startTime} - {appt.endTime}
              </p>

              <div className="flex items-center justify-between mt-3">

                <div className={`badge ${
                  appt.status === "BOOKED"
                    ? "badge-primary"
                    : "badge-success"
                }`}>
                  {appt.status}
                </div>

                {appt.status === "BOOKED" && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleComplete(appt.appointmentId)}
                  >
                    Mark Completed
                  </button>
                )}

              </div>

            </div>
          </div>
        ))}
      </div>

      {/* 🔵 Pagination */}
      <div className="flex justify-center gap-2">
        <button
          className="btn btn-sm"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {page + 1} of {totalPages}
        </span>

        <button
          className="btn btn-sm"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default CounsellorDashboard;