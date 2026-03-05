function SortControls({ sortBy, sortOrder, onSortByChange, onSortOrderChange }) {
  return (
    <div className="flex justify-center gap-1.5 sm:gap-3 flex-wrap w-full">
      <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
        <button
          className={`btn btn-xs sm:btn-sm px-3 sm:px-4 py-2 transition-all duration-300 ${
            sortBy === "date"
              ? "bg-red-500 text-white border-none shadow-md"
              : "btn-outline"
          }`}
          onClick={() => onSortByChange("date")}
        >
          Sort by Date
        </button>
        <button
          className={`btn btn-xs sm:btn-sm px-3 sm:px-4 py-2 transition-all duration-300 ${
            sortBy === "name"
              ? "bg-red-500 text-white border-none shadow-md"
              : "btn-outline"
          }`}
          onClick={() => onSortByChange("name")}
        >
          Sort by Name
        </button>
      </div>

      <button
        className={`btn btn-xs sm:btn-sm px-3 sm:px-4 py-2 transition-all duration-300 bg-purple-600 text-white border-none shadow-md hover:bg-purple-700`}
        onClick={onSortOrderChange}
      >
        {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
      </button>
    </div>
  );
}

export default SortControls;
