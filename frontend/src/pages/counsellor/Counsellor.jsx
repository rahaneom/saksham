import { Stethoscope } from "lucide-react";

function Counsellor() {
  return (
    <div className="p-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl flex items-center gap-2">
            <Stethoscope size={28} />
            Counsellor Portal
          </h2>
          <p className="py-4">
            Manage your appointments, upload resources, and track student interactions.
          </p>
          <div className="divider"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="stat bg-base-200 rounded">
              <div className="stat-title">Appointments</div>
              <div className="stat-value">0</div>
            </div>
            <div className="stat bg-base-200 rounded">
              <div className="stat-title">Resources</div>
              <div className="stat-value">0</div>
            </div>
            <div className="stat bg-base-200 rounded">
              <div className="stat-title">Students</div>
              <div className="stat-value">0</div>
            </div>
          </div>
          <div className="alert alert-info mt-4">
            <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Full counsellor dashboard features coming soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Counsellor;
