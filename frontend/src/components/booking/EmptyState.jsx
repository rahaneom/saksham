function EmptyState({ message = "No appointments for this status" }) {
  return (
    <div className="card bg-white shadow-md">
      <div className="card-body text-center">
        <p className="text-gray-500 text-base sm:text-lg break-words">{message}</p>
      </div>
    </div>
  );
}

export default EmptyState;
