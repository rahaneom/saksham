import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchBookingSlots,
  bookSlot,
} from "../../features/booking/bookingThunks";
import {
  selectTodaySlots,
  selectTomorrowSlots,
  selectBookingStatus,
  selectBookingError,
} from "../../features/booking/bookingSelectors";
import { SlotCard, ConfirmModal } from "../../components/booking";
import counsellorImage from "../../assets/counsellor image.png";

function BookingPage() {
  const dispatch = useDispatch();
  const [counsellorInfo] = useState({
    name: "Dr. Counsellor",
    email: "counsellor@university.edu",
    qualifications: "M.A. Psychology, B.A. Counselling",
    department: "Student Counselling & Guidance",
    phone: "+91-XXX-XXXX-XXXX",
    photo: counsellorImage
  });
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    confirmButtonClass: "btn-primary",
    onConfirm: null,
  });

  const todaySlotsRaw = useSelector(selectTodaySlots);
  const tomorrowSlotsRaw = useSelector(selectTomorrowSlots);
  const status = useSelector(selectBookingStatus);
  const error = useSelector(selectBookingError);

  const todaySlots = [...todaySlotsRaw].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
  const tomorrowSlots = [...tomorrowSlotsRaw].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  useEffect(() => {
    dispatch(fetchBookingSlots());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
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
      confirmButtonClass: "bg-indigo-600 hover:bg-indigo-700 text-white border-none",
      onConfirm: async () => {
        closeConfirmModal();
        const toastId = toast.loading("Booking appointment...");
        const result = await dispatch(bookSlot(slotId));

        if (result.meta.requestStatus === "fulfilled") {
          toast.success("Appointment booked successfully!", { id: toastId });
          dispatch(fetchBookingSlots());
        } else {
          toast.error(result.payload || "Booking failed", { id: toastId });
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 mb-2 flex items-center justify-center gap-2">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7h4v2h-4zm0 4h4v2h-4zm-5-8h4v2H9zm0 4h4v2H9zm0 4h4v2H9z"/>
            </svg>
            Book Your Appointment
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Choose a time slot that works best for you
          </p>
        </div>

        {/* Counsellor Info Card */}
        <div className="max-w-2xl mx-auto mb-4">
          <div className="card counsellor-card bg-white/90 backdrop-blur-sm text-slate-800 rounded-2xl">
            <div className="card-body py-4 px-4 sm:px-5">
              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 border-b-2 border-slate-700 pb-2">Meet Your Counsellor</h2>
              
              {/* Photo on Left, Details on Right */}
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                {/* Photo Section - Left */}
                <div className="flex-shrink-0">
                  <img 
                    src={counsellorInfo.photo} 
                    alt={counsellorInfo.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-100 object-cover shadow-md"
                  />
                </div>

                {/* Info Section - Right */}
                <div className="flex-1 space-y-2 w-full">
                  {/* Name */}
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                    <p className="text-sm sm:text-base text-left leading-snug break-words">
                      <span className="font-semibold text-slate-600">Name: </span>
                      <span className="font-bold">{counsellorInfo.name}</span>
                    </p>
                  </div>

                  {/* Qualifications */}
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                    </svg>
                    <p className="text-sm sm:text-base text-left leading-snug break-words">
                      <span className="font-semibold text-slate-600">Qualifications: </span>
                      <span className="font-bold">{counsellorInfo.qualifications}</span>
                    </p>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <p className="text-sm sm:text-base text-left leading-snug break-all">
                      <span className="font-semibold text-slate-600">Email: </span>
                      <span className="font-bold">{counsellorInfo.email}</span>
                    </p>
                  </div>

                  {/* Department */}
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                    </svg>
                    <p className="text-sm sm:text-base text-left leading-snug break-words">
                      <span className="font-semibold text-slate-600">Department: </span>
                      <span className="font-bold">{counsellorInfo.department}</span>
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    <p className="text-sm sm:text-base text-left leading-snug break-words">
                      <span className="font-semibold text-slate-600">Phone: </span>
                      <span className="font-bold">{counsellorInfo.phone}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Card */}
        <div className="max-w-2xl mx-auto mb-4">
          <div className="card bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-xl">
            <div className="card-body p-3 sm:p-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 backdrop-blur-sm">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l6-2.24c1.3.6 2.75.97 4.29.97C17.52 22 22 17.52 22 12S17.52 2 12 2zm0 18c-1.41 0-2.73-.36-3.88-.99l-.28-.15-2.89 1.08.84-2.58-.18-.3C4.5 15.43 4 13.8 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-bold mb-1 tracking-tight">Need Guidance? We're Here to Help!</h2>
                <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                  Book a session with our experienced counsellors for academic advice, career guidance, 
                  or any concerns you may have.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <span className="loading loading-bars loading-lg text-indigo-600"></span>
              <p className="mt-4 text-slate-600">Loading available slots...</p>
            </div>
          </div>
        )}

        {/* Today Slots */}
        {status !== "loading" && (
          <>
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-blue-600 rounded mr-2"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Today <span className="text-sm sm:text-base font-normal text-slate-600">({getTodayDate()})</span></h2>
                <span className="text-xs font-semibold bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                  {todaySlots.length} slots
                </span>
              </div>

              {todaySlots.length === 0 ? (
                <div className="bg-white/90 border border-slate-200 rounded-xl p-6 text-center shadow-sm">
                  <p className="text-slate-500">No slots available for today</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {todaySlots.map((slot) => (
                    <SlotCard
                      key={slot.slotId}
                      slot={slot}
                      onBook={handleBook}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Tomorrow Slots */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-indigo-600 rounded mr-2"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Tomorrow <span className="text-sm sm:text-base font-normal text-slate-600">({getTomorrowDate()})</span></h2>
                <span className="text-xs font-semibold bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full">
                  {tomorrowSlots.length} slots
                </span>
              </div>

              {tomorrowSlots.length === 0 ? (
                <div className="bg-white/90 border border-slate-200 rounded-xl p-6 text-center shadow-sm">
                  <p className="text-slate-500">No slots available for tomorrow</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {tomorrowSlots.map((slot) => (
                    <SlotCard
                      key={slot.slotId}
                      slot={slot}
                      onBook={handleBook}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
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

export default BookingPage;
