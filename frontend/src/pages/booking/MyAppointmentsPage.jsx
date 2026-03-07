import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookingToast, updateToast } from "../../util/toast";
import {
  fetchMyAppointments,
  cancelAppointment,
} from "../../features/booking/bookingThunks";
import { PaginationControls, ConfirmModal } from "../../components/booking";

function MyAppointmentsPage() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    confirmButtonClass: "btn-primary",
    onConfirm: null,
  });
  const itemsPerPage = 5;
  const appointments = useSelector((state) => state.booking.myAppointments);

  const sortedAppointments = [...appointments].sort((a, b) => {
    const statusOrder = { BOOKED: 1, COMPLETED: 2, CANCELLED: 3 };
    const statusCompare = (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
    if (statusCompare !== 0) return statusCompare;
    
    const dateCompare = new Date(a.slotDate) - new Date(b.slotDate);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const paginatedAppointments = sortedAppointments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchMyAppointments()).finally(() => setIsLoading(false));
  }, [dispatch]);

  const closeConfirmModal = () => {
    setConfirmConfig((prev) => ({
      ...prev,
      isOpen: false,
      onConfirm: null,
    }));
  };

  const openConfirmModal = (config) => {
    setConfirmConfig({
      isOpen: true,
      title: config.title,
      message: config.message,
      confirmText: config.confirmText || "Confirm",
      confirmButtonClass: config.confirmButtonClass || "btn-primary",
      onConfirm: config.onConfirm,
    });
  };

  const handleCancel = (appointmentId) => {
    openConfirmModal({
      title: "Cancel Appointment",
      message: "Are you sure you want to cancel this appointment?",
      confirmText: "Yes, Cancel",
      confirmButtonClass: "bg-rose-600 hover:bg-rose-700 text-white border-none",
      onConfirm: async () => {
        closeConfirmModal();
        const toastId = bookingToast.loading("Cancelling appointment...");
        const result = await dispatch(cancelAppointment(appointmentId));

        if (result.meta.requestStatus === "fulfilled") {
          updateToast.success(toastId, "Appointment cancelled successfully!");
          dispatch(fetchMyAppointments());
        } else {
          updateToast.error(toastId, result.payload || "Cancellation failed");
        }
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "BOOKED":
        return "bg-base-100 text-info border border-info !border-l-4 shadow-lg";
      case "COMPLETED":
        return "bg-base-100 text-success border border-success !border-l-4 shadow-lg";
      case "CANCELLED":
        return "bg-base-100 text-error border border-error !border-l-4 shadow-lg";
      default:
        return "bg-base-300 text-base-content";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "BOOKED":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
        );
      case "COMPLETED":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        );
      case "CANCELLED":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 17h2v-5h-2v5zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-base-content mb-3 flex items-center justify-center gap-2 sm:gap-3">
            <svg className="w-8 h-8 sm:w-12 sm:h-12 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
              <polyline points="14 2 14 8 20 8" className="fill-none" stroke="currentColor" strokeWidth="2"/>
            </svg>
            My Appointments
          </h1>
          <p className="text-base-content/70 text-sm sm:text-lg">
            View and manage your scheduled consultations
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <span className="loading loading-bars loading-lg text-blue-600"></span>
              <p className="mt-4 text-base-content/70">Loading appointments...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && appointments.length === 0 && (
          <div className="bg-base-100 border border-base-300 rounded-2xl shadow-lg p-6 sm:p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7"/>
            </svg>
            <h3 className="text-xl sm:text-2xl font-semibold text-base-content mb-2">
              No Appointments Yet
            </h3>
            <p className="text-base-content/70 text-sm sm:text-lg">
              You haven't booked any appointments. Head to the booking page to
              schedule one!
            </p>
          </div>
        )}

        {/* Appointments List */}
        {!isLoading && appointments.length > 0 && (
          <>
            <div className="space-y-3">
              {paginatedAppointments.map((appt) => {
                const appointmentId = appt.id ?? appt.appointmentId;
                const statusColor = getStatusColor(appt.status);
                const statusIcon = getStatusIcon(appt.status);

                return (
                  <div
                    key={appointmentId}
                    className={`card shadow-sm hover:shadow-md transition-all duration-300 rounded-xl ${statusColor}`}
                  >
                    <div className="card-body p-3 md:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Left Section - Date & Time */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-base md:text-lg">{statusIcon}</div>
                            <div>
                              <h3 className="text-base md:text-lg font-bold">
                                {appt.slotDate}
                              </h3>
                              <p className="text-xs opacity-75 font-medium">
                                {appt.startTime} - {appt.endTime}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right Section - Status & Action */}
                        <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
                          {/* Status Badge */}
                          <span className="text-xs font-bold uppercase tracking-wide">
                            {appt.status}
                          </span>

                          {/* Cancel Button */}
                          {appt.status === "BOOKED" && (
                            <button
                              className="btn btn-xs sm:btn-sm bg-rose-600 hover:bg-rose-700 text-white border-none transition-all shadow-sm hover:shadow-md px-4 sm:px-6 py-2"
                              onClick={() => handleCancel(appointmentId)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );              
              })}
            </div>

          </>
        )}

        {/* Stats Section */}
        {appointments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 sm:mt-12">
            <div className="rounded-xl bg-base-100 p-6 text-center border-l-4 border-info shadow-lg border border-base-300">
              <div className="text-3xl font-bold text-info">
                {appointments.filter((a) => a.status === "BOOKED").length}
              </div>
              <p className="text-info font-semibold mt-2">Booked</p>
            </div>
            <div className="rounded-xl bg-base-100 p-6 text-center border-l-4 border-success shadow-lg border border-base-300">
              <div className="text-3xl font-bold text-success">
                {appointments.filter((a) => a.status === "COMPLETED").length}
              </div>
              <p className="text-success font-semibold mt-2">Completed</p>
            </div>
            <div className="rounded-xl bg-base-100 p-6 text-center border-l-4 border-error shadow-lg border border-base-300">
              <div className="text-3xl font-bold text-error">
                {appointments.filter((a) => a.status === "CANCELLED").length}
              </div>
              <p className="text-error font-semibold mt-2">Cancelled</p>
            </div>
          </div>
        )}

        {!isLoading && appointments.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <PaginationControls
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}

        <ConfirmModal
          isOpen={confirmConfig.isOpen}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          confirmButtonClass={confirmConfig.confirmButtonClass}
          onConfirm={confirmConfig.onConfirm || (() => {})}
          onClose={closeConfirmModal}
        />
      </div>
    </div>
  );
}

export default MyAppointmentsPage;
