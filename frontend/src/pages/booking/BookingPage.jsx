import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookingToast, updateToast } from "../../util/toast";
import {
  fetchBookingSlots,
  bookSlot,
} from "../../features/booking/bookingThunks";
import {
  // selectTodaySlots,
  // selectTomorrowSlots,
  selectBookingStatus,
  selectFetchStatus,
  selectBookingError,
} from "../../features/booking/bookingSelectors";
import { resetBookingStatus } from "../../features/booking/bookingSlice";
import { ConfirmModal } from "../../components/booking";
import counsellorImage from "../../assets/counsellor image.png";

function BookingPage() {
  const dispatch = useDispatch();
  const shownErrorRef = useRef(null);
  const [counsellorInfo] = useState({
    name: "Dr. Counsellor",
    email: "counsellor@university.edu",
    qualifications: "M.A. Psychology, B.A. Counselling",
    department: "Student Counselling & Guidance",
    phone: "+91-8993758780",
    photo: counsellorImage,
  });
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    confirmButtonClass: "btn-primary",
    onConfirm: null,
  });

  const fetchStatus = useSelector(selectFetchStatus);
  const bookingStatus = useSelector(selectBookingStatus);
  const error = useSelector(selectBookingError);
  const bookingSlots = useSelector((state) => state.booking.slots) || {};

  useEffect(() => {
    dispatch(fetchBookingSlots());
    // Clear any previous errors when component mounts
    dispatch(resetBookingStatus());
  }, [dispatch]);

  useEffect(() => {
    if (error && error !== shownErrorRef.current) {
      bookingToast.fetchError(error);
      shownErrorRef.current = error;
    }
  }, [error]);

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

  const handleBook = (slotId) => {
    openConfirmModal({
      title: "Confirm Booking",
      message: "Are you sure you want to book this appointment?",
      confirmText: "Book Now",
      confirmButtonClass:
        "bg-indigo-600 hover:bg-indigo-700 text-white border-none",
      onConfirm: async () => {
        closeConfirmModal();
        const toastId = bookingToast.loading("Booking appointment...");
        const result = await dispatch(bookSlot(slotId));

        if (result.meta.requestStatus === "fulfilled") {
          updateToast.success(toastId, "Appointment booked successfully!");
          dispatch(fetchBookingSlots());
        } else {
          updateToast.error(toastId, result.payload || "Booking failed");
        }
      },
    });
  };

  const currentTime = new Date();

  const normalizedSlots = {};

  ["today", "tomorrow"].forEach((key) => {
    const slotsArr = bookingSlots[key];

    if (slotsArr?.length) {
      const date = slotsArr[0].slotDate;

      const day = new Date(date + "T00:00:00").getDay();

      if (day !== 0) {
        normalizedSlots[date] = slotsArr;
      }
    }
  });

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-base-content p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-2xl">
            {/* Header */}
            <div className="px-6 py-4 text-white border-b bg-gradient-to-r from-indigo-600 to-violet-600">
              <h2 className="text-lg font-semibold tracking-wide">
                Your Counsellor
              </h2>
              <p className="text-sm text-white/80">
                Professional support for your academic & personal growth
              </p>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
              {/* Profile */}
              <div className="flex flex-col items-center text-center sm:text-left">
                <img
                  src={counsellorInfo.photo}
                  alt={counsellorInfo.name}
                  className="object-cover w-24 h-24 border-4 border-indigo-100 rounded-full shadow-md"
                />
                <h3 className="mt-3 text-lg font-semibold text-gray-800">
                  {counsellorInfo.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {counsellorInfo.qualifications}
                </p>
              </div>

              {/* Details */}
              <div className="grid flex-1 grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">
                    {counsellorInfo.department}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-800 break-all">
                    {counsellorInfo.email}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">
                    {counsellorInfo.phone}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Session Duration</p>
                  <p className="font-medium text-gray-800">30 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-6">
          <div className="overflow-hidden border shadow-xl card bg-base-100 border-base-300 rounded-2xl">
            {/* Title */}
            <div className="p-4 text-center border-b border-base-300">
              <h2 className="text-xl font-bold text-base-content">
                Select Your Preferred Time
              </h2>
              <p className="mt-1 text-sm text-base-content/70">
                Choose a slot that works best for you
              </p>
            </div>
            {/* Slots Section */}
            <div className="p-5">
              {/* Loader ONLY for fetching */}
              {fetchStatus === "loading" && (
                <div className="flex justify-center py-20">
                  <span className="loading loading-bars loading-xl text-primary"></span>
                </div>
              )}

              {/* Show slots ONLY after fetch */}
              {fetchStatus === "success" && (
                <>
                  {Object.keys(normalizedSlots).length === 0 ? (
                    <p className="text-center text-base-content/60">
                      No slots available
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {Object.entries(normalizedSlots)
                        .sort(([d1], [d2]) => new Date(d1) - new Date(d2))
                        .map(([date, slots]) => (
                          <div
                            key={date}
                            className="p-5 border shadow-md rounded-xl"
                          >
                            <h3 className="mb-4 text-lg font-semibold text-indigo-600">
                              {new Date(date + "T00:00:00").toLocaleDateString(
                                "en-IN",
                                {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                },
                              )}
                            </h3>

                            {(() => {
                              const sortedSlots = [...slots].sort((a, b) =>
                                a.startTime.localeCompare(b.startTime),
                              );

                              const filteredSlots = sortedSlots.filter(
                                (slot) => {
                                  const slotTime = new Date(
                                    date + "T" + slot.startTime,
                                  );
                                  return slotTime > currentTime;
                                },
                              );

                              if (filteredSlots.length === 0) {
                                return (
                                  <p className="text-sm text-gray-400">
                                    No available slots
                                  </p>
                                );
                              }

                              return (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                  {filteredSlots.map((slot) => (
                                    <button
                                      key={slot.slotId}
                                      disabled={!slot.available}
                                      onClick={() => handleBook(slot.slotId)}
                                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                slot.available
                  ? "bg-indigo-100 hover:bg-indigo-600 hover:text-white text-indigo-700 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
                                    >
                                      {slot.startTime.slice(0, 5)}
                                    </button>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

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

export default BookingPage;
