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
import { SlotCard } from "../../components/booking";
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

  useEffect(() => {
    dispatch(fetchBookingSlots());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleBook = async (slotId) => {
    const confirmBook = window.confirm(
      "Are you sure you want to book this appointment?"
    );
    
    if (!confirmBook) return;

    const toastId = toast.loading("Booking appointment...");
    const result = await dispatch(bookSlot(slotId));

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Appointment booked successfully!", { id: toastId });
      dispatch(fetchBookingSlots());
    } else {
      toast.error(result.payload || "Booking failed", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7h4v2h-4zm0 4h4v2h-4zm-5-8h4v2H9zm0 4h4v2H9zm0 4h4v2H9z"/>
            </svg>
            Book Your Appointment
          </h1>
          <p className="text-gray-600 text-sm">
            Choose a time slot that works best for you
          </p>
        </div>

        {/* Counsellor Info Card */}
        <div className="card bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-white shadow-xl mb-5">
          <div className="card-body py-3 px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              {/* Photo Section */}
              <div className="flex-shrink-0">
                <img 
                  src={counsellorInfo.photo} 
                  alt={counsellorInfo.name}
                  className="w-16 h-16 rounded-full border-3 border-white/40 object-cover shadow-lg"
                />
              </div>

              {/* Info Section */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">Meet Your Counsellor</h2>
                <h3 className="text-2xl font-semibold mb-1">{counsellorInfo.name}</h3>
                
                <p className="text-white/90 text-sm font-semibold mb-2">
                  {counsellorInfo.qualifications}
                </p>

                <div className="flex flex-wrap gap-3 text-sm">
                  <p className="text-white/80 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    {counsellorInfo.email}
                  </p>

                  <p className="text-white/80 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    {counsellorInfo.department}
                  </p>

                  <p className="text-white/80 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    {counsellorInfo.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Card */}
        <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl mb-4">
          <div className="card-body p-2">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 backdrop-blur-sm">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l6-2.24c1.3.6 2.75.97 4.29.97C17.52 22 22 17.52 22 12S17.52 2 12 2zm0 18c-1.41 0-2.73-.36-3.88-.99l-.28-.15-2.89 1.08.84-2.58-.18-.3C4.5 15.43 4 13.8 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-1">Need Guidance? We're Here to Help!</h2>
                <p className="text-white/90 text-sm">
                  Book a session with our experienced counsellors for academic advice, career guidance, 
                  or any concerns you may have.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <span className="loading loading-spinner loading-lg text-blue-600"></span>
              <p className="mt-4 text-gray-600">Loading available slots...</p>
            </div>
          </div>
        )}

        {/* Today Slots */}
        {status !== "loading" && (
          <>
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-2 h-6 bg-blue-600 rounded mr-2"></div>
                <h2 className="text-2xl font-bold text-gray-800">Today</h2>
                <span className="ml-2 text-xs font-semibold bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                  {todaySlots.length} slots
                </span>
              </div>

              {todaySlots.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center">
                  <p className="text-gray-500">No slots available for today</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
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
              <div className="flex items-center mb-4">
                <div className="w-2 h-6 bg-indigo-600 rounded mr-2"></div>
                <h2 className="text-2xl font-bold text-gray-800">Tomorrow</h2>
                <span className="ml-2 text-xs font-semibold bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full">
                  {tomorrowSlots.length} slots
                </span>
              </div>

              {tomorrowSlots.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center">
                  <p className="text-gray-500">No slots available for tomorrow</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
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
      </div>
    </div>
  );
}

export default BookingPage;
