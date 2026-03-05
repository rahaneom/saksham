function PaginationControls({ page, totalPages, onPageChange }) {
  const handlePrev = () => {
    if (page > 0) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) onPageChange(page + 1);
  };

  return (
    totalPages > 1 && (
      <div className="flex justify-center mt-6 sm:mt-8">
        <div className="join shadow-md">
          {/* Previous */}
          <button
            className="px-3 py-3 join-item btn btn-md hover:bg-indigo-600 hover:text-white transition-all duration-300"
            onClick={handlePrev}
            disabled={page === 0}
          >
            «
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`join-item btn btn-md px-3 py-3 transition-all duration-300 ${
                i === page ? "btn-active btn-primary" : "hover:bg-indigo-100"
              }`}
              onClick={() => onPageChange(i)}
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            className="px-3 py-3 join-item btn btn-md hover:bg-indigo-600 hover:text-white transition-all duration-300"
            onClick={handleNext}
            disabled={page === totalPages - 1}
          >
            »
          </button>
        </div>
      </div>
    )
  );
}

export default PaginationControls;
