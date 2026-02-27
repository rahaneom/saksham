import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

function BookingPage() {
  const dispatch = useDispatch();

  const todaySlots = useSelector(selectTodaySlots);
  const tomorrowSlots = useSelector(selectTomorrowSlots);
  const status = useSelector(selectBookingStatus);
  const error = useSelector(selectBookingError);

  // 🔵 Fetch slots when page loads
  useEffect(() => {
    dispatch(fetchBookingSlots());
  }, [dispatch]);

  // 🔵 Book slot
  const handleBook = async (slotId) => {
    const result = await dispatch(bookSlot(slotId));

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(fetchBookingSlots());
    }
  };

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-3xl font-bold text-center">
        Book Appointment
      </h1>

      {/* 🔵 Loading */}
      {status === "loading" && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* 🔵 Error */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* 🔵 Today Slots */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Today
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {todaySlots.map((slot) => (
            <div key={slot.slotId} className="card bg-base-200 shadow">
              <div className="card-body">
                <h3 className="font-semibold">
                  {slot.startTime} - {slot.endTime}
                </h3>

                <button
                  className="btn btn-primary"
                  disabled={!slot.available}
                  onClick={() => handleBook(slot.slotId)}
                >
                  {slot.available ? "Book" : "Unavailable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔵 Tomorrow Slots */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Tomorrow
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {tomorrowSlots.map((slot) => (
            <div key={slot.slotId} className="card bg-base-200 shadow">
              <div className="card-body">
                <h3 className="font-semibold">
                  {slot.startTime} - {slot.endTime}
                </h3>

                <button
                  className="btn btn-primary"
                  disabled={!slot.available}
                  onClick={() => handleBook(slot.slotId)}
                >
                  {slot.available ? "Book" : "Unavailable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default BookingPage;