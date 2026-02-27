function PaginationControls({ page, totalPages, onPrevious, onNext }) {
  return (
    totalPages > 1 && (
      <div className="flex justify-center gap-4 items-center mt-6">
        <button
          className={`btn btn-sm px-6 py-2 rounded-lg transition-all duration-300 ${
            page === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-md hover:shadow-lg hover:scale-105"
          }`}
          disabled={page === 0}
          onClick={onPrevious}
        >
          Prev
        </button>

        <span className="px-4 py-2 font-semibold text-gray-700 text-sm">
          Page {page + 1} of {totalPages}
        </span>

        <button
          className={`btn btn-sm px-6 py-2 rounded-lg transition-all duration-300 ${
            page + 1 >= totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-md hover:shadow-lg hover:scale-105"
          }`}
          disabled={page + 1 >= totalPages}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    )
  );
}

export default PaginationControls;
