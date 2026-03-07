function EmptyState({ message = "No appointments for this status" }) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-md rounded-lg sm:rounded-xl">
      <div className="card-body text-center p-4 sm:p-6">
        <p className="text-base-content/70 text-sm sm:text-base lg:text-lg break-words">{message}</p>
      </div>
    </div>
  );
}

export default EmptyState;
