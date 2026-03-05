function SlotCard({ slot, onBook }) {
  const formatTime = (time) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  return (
    <div className="card bg-white/95 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 aspect-square rounded-xl">
      <div className="card-body p-2 sm:p-3 flex flex-col justify-between">
        <div className="text-center">
          <p className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
            {formatTime(slot.startTime)}
          </p>
          <p className="text-xs sm:text-sm text-slate-500 mb-2">
            to {formatTime(slot.endTime)}
          </p>
        </div>

        {slot.available ? (
          <>
            <div className="flex items-center justify-center mb-2">
              <div className="badge badge-success w-6 h-6 flex items-center justify-center p-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
            </div>
            <button
              className="btn btn-xs sm:btn-sm w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none py-1 rounded-md shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => onBook(slot.slotId)}
            >
              Book
            </button>
          </>
        ) : (
          <button
            className="btn btn-xs sm:btn-sm w-full bg-gray-400 text-gray-600 border-none py-1 rounded-md cursor-not-allowed"
            disabled
          >
            Taken
          </button>
        )}
      </div>
    </div>
  );
}

export default SlotCard;
