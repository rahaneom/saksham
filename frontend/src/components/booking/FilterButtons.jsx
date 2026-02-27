function FilterButtons({ statusFilter, onFilterChange, isCompact = false }) {
  return (
    <div className="flex justify-center gap-4">
      <button
        className={`btn btn-sm px-6 py-2 transition-all duration-300 ${
          statusFilter === "BOOKED"
            ? "bg-indigo-600 text-white border-none shadow-md hover:shadow-lg hover:bg-indigo-700 hover:translate-x-1"
            : "bg-indigo-200 text-indigo-800 border-none shadow-sm hover:shadow-md hover:bg-indigo-300 hover:translate-x-1"
        }`}
        onClick={() => onFilterChange("BOOKED")}
      >
        {isCompact ? "📋" : "Booked"}
      </button>

      <button
        className={`btn btn-sm px-6 py-2 transition-all duration-300 ${
          statusFilter === "COMPLETED"
            ? "bg-green-600 text-white border-none shadow-md hover:shadow-lg hover:bg-green-700 hover:translate-x-1"
            : "bg-green-200 text-green-800 border-none shadow-sm hover:shadow-md hover:bg-green-300 hover:translate-x-1"
        }`}
        onClick={() => onFilterChange("COMPLETED")}
      >
        {isCompact ? "✅" : "Completed"}
      </button>

      {!statusFilter && (
        <button
          className={`btn btn-sm px-6 py-2 transition-all duration-300 bg-yellow-200 text-yellow-800 border-none shadow-sm hover:shadow-md hover:bg-yellow-300 hover:translate-x-1`}
          onClick={() => onFilterChange("CANCELLED")}
        >
          {isCompact ? "❌" : "Cancelled"}
        </button>
      )}
    </div>
  );
}

export default FilterButtons;
