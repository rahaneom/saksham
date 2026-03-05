import { Calendar } from "lucide-react";

function Booking() {
  return (
    <div className="p-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl flex items-center gap-2">
            <Calendar size={28} />
            Schedule Appointment
          </h2>
          <p className="py-4">
            Book a session with a professional counsellor. Choose your preferred time and get personalized support.
          </p>
          <div className="alert alert-info">
            <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>This feature is coming soon!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Booking;
