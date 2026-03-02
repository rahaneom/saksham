function AppointmentCard({ appointment, onMarkComplete, isCounsellor = false }) {
  return (
    <div className="card bg-white/95 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg sm:rounded-xl">
      <div className="card-body py-2.5 sm:py-3 px-3 sm:px-4">
        <h2 className="font-bold text-sm sm:text-base lg:text-lg break-words text-slate-800 tracking-tight">
          {isCounsellor ? appointment.studentName : appointment.counsellorName} ({appointment.academicYear})
        </h2>

        <p className="text-slate-600 flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base mt-1 break-words">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          {appointment.phone}
        </p>

        <p className="text-slate-600 flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base mt-1 break-words">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7h4v2h-4zm0 4h4v2h-4zm-5-8h4v2H9zm0 4h4v2H9zm0 4h4v2H9z" />
          </svg>
          <span className="break-words">{appointment.slotDate} | {appointment.startTime} - {appointment.endTime}</span>
        </p>

        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
          <div
            className={`badge badge-xs sm:badge-sm ${
              appointment.status === "BOOKED"
                ? "badge-primary"
                : "badge-success"
            }`}
          >
            {appointment.status}
          </div>

          {appointment.status === "BOOKED" && isCounsellor && (
            <button
              className="btn btn-xs sm:btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-none px-3 sm:px-4 py-1 rounded-md shadow-sm hover:shadow-md transition-all duration-300 text-xs sm:text-sm"
              onClick={() => onMarkComplete(appointment.appointmentId)}
            >
              Mark Completed
            </button>
          )}

          {appointment.status === "BOOKED" && !isCounsellor && (
            <button
              className="btn btn-xs sm:btn-sm bg-rose-600 hover:bg-rose-700 text-white border-none px-3 sm:px-4 py-1 rounded-md shadow-sm hover:shadow-md transition-all duration-300 text-xs"
              onClick={() => onMarkComplete(appointment.appointmentId)}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;
