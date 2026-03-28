import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookingToast, updateToast } from "../../util/toast";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
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
    const statusCompare =
      (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
    if (statusCompare !== 0) return statusCompare;

    const dateCompare = new Date(a.slotDate) - new Date(b.slotDate);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const paginatedAppointments = sortedAppointments.slice(
    startIndex,
    startIndex + itemsPerPage,
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
      confirmButtonClass:
        "bg-rose-600 hover:bg-rose-700 text-white border-none",
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
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
        );
      case "COMPLETED":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        );
      case "CANCELLED":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 17h2v-5h-2v5zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-base-content p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="flex items-center justify-center gap-2 mb-3 text-2xl font-extrabold sm:text-4xl md:text-5xl text-base-content sm:gap-3">
            <svg
              className="w-8 h-8 text-purple-600 sm:w-12 sm:h-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
              <polyline
                points="14 2 14 8 20 8"
                className="fill-none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            My Appointments
          </h1>
          <p className="text-sm text-base-content/70 sm:text-lg">
            View and manage your scheduled consultations
          </p>
        </div>

        {/* Stats Section */}
        {appointments.length > 0 && (
          <div className="grid grid-cols-1 gap-5 mt-6 mb-10 sm:grid-cols-3">
            {/* Booked */}
            <div className="relative flex items-center justify-between p-5 transition border border-blue-100 bg-gradient-to-br from-blue-50 to-white rounded-2xl hover:shadow-md ">
              <div>
                <p className="text-sm font-medium text-blue-600">Booked</p>
                <h2 className="mt-1 text-3xl font-bold text-gray-900">
                  {appointments.filter((a) => a.status === "BOOKED").length}
                </h2>
              </div>

              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            {/* Completed */}
            <div className="relative flex items-center justify-between p-5 transition border border-green-100 bg-gradient-to-br from-green-50 to-white rounded-2xl hover:shadow-md">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <h2 className="mt-1 text-3xl font-bold text-gray-900">
                  {appointments.filter((a) => a.status === "COMPLETED").length}
                </h2>
              </div>

              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>

            {/* Cancelled */}
            <div className="relative flex items-center justify-between p-5 transition border border-red-100 bg-gradient-to-br from-red-50 to-white rounded-2xl hover:shadow-md">
              <div>
                <p className="text-sm font-medium text-red-600">Cancelled</p>
                <h2 className="mt-1 text-3xl font-bold text-gray-900">
                  {appointments.filter((a) => a.status === "CANCELLED").length}
                </h2>
              </div>

              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <span className="text-blue-600 loading loading-bars loading-lg"></span>
              <p className="mt-4 text-base-content/70">
                Loading appointments...
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && appointments.length === 0 && (
          <div className="p-6 text-center border shadow-lg bg-base-100 border-base-300 rounded-2xl sm:p-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="mb-2 text-xl font-semibold sm:text-2xl text-base-content">
              No Appointments Yet
            </h3>
            <p className="text-sm text-base-content/70 sm:text-lg">
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
                    className="flex items-center justify-between px-8 py-4 transition-all bg-white border border-gray-200 rounded-xl hover:shadow-md hover:bg-base-200"
                  >
                    {/* LEFT */}
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-gray-500">
                        {appt.slotDate}
                      </div>

                      <div className="text-lg font-semibold text-gray-800">
                        {appt.startTime} – {appt.endTime}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-4">
                      {/* Status */}
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          appt.status === "BOOKED"
                            ? "bg-blue-100 text-blue-700"
                            : appt.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {appt.status}
                      </span>

                      {/* Action */}
                      {appt.status === "BOOKED" && (
                        <button
                          onClick={() => handleCancel(appointmentId)}
                          className="text-sm font-medium text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
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
