import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyAppointments,
  cancelAppointment,
} from "../../features/booking/bookingThunks";

function MyAppointmentsPage() {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.booking.myAppointments);

  useEffect(() => {
    dispatch(fetchMyAppointments());
  }, [dispatch]);

  const handleCancel = async (appointmentId) => {
    const result = await dispatch(cancelAppointment(appointmentId));

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(fetchMyAppointments());
    }
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold text-center">
        My Appointments
      </h1>

      {appointments.length === 0 && (
        <div className="alert alert-info">
          <span>No appointments found.</span>
        </div>
      )}

      <div className="space-y-4">
        {appointments.map((appt) => {
          const appointmentId = appt.id ?? appt.appointmentId;

          return (
            <div key={appointmentId} className="card bg-base-200 shadow">
              <div className="card-body flex justify-between items-center">

                <div>
                  <h2 className="font-semibold">
                    {appt.slotDate}
                  </h2>
                  <p>
                    {appt.startTime} - {appt.endTime}
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  {/* Status Badge */}
                  <div className={`badge ${
                    appt.status === "BOOKED"
                      ? "badge-primary"
                      : appt.status === "COMPLETED"
                      ? "badge-success"
                      : "badge-error"
                  }`}>
                    {appt.status}
                  </div>

                  {/* Cancel Button */}
                  {appt.status === "BOOKED" && (
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleCancel(appointmentId)}
                    >
                      Cancel
                    </button>
                  )}

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default MyAppointmentsPage;