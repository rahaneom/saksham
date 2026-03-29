function formatRole(role) {
  if (!role) return "User";
  return role.replace("ROLE_", "").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProfileCard({ profile, user, onProfile, onAppointments, onLogout }) {
  const displayName = profile?.name || user?.name || user?.email || "Unknown";
  const role = formatRole(user?.role || profile?.role || "ROLE_USER");

  return (
    <div className="absolute right-0 top-full mt-2 w-60 bg-base-100 border border-base-300 shadow-lg rounded-xl p-3 text-sm z-50">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-slate-800 text-white grid place-items-center font-bold">{displayName[0]?.toUpperCase() || "U"}</div>
        <div>
          <p className="font-semibold leading-none">{displayName}</p>
          <p className="text-xs text-secondary leading-none">{role}</p>
        </div>
      </div>
      <div className="mt-3 border-t border-base-300 pt-2 space-y-1">
        <button onClick={onProfile} className="btn btn-sm btn-ghost text-slate-900 w-full px-5 justify-start">
          My Profile
        </button>
        {user.role === "ROLE_STUDENT" && (
              <button onClick={onAppointments} className="btn btn-sm px-5 btn-ghost w-full justify-start">
          My Appointments
        </button>
            )}
        <button onClick={onLogout} className="btn btn-md bg-slate-800 rounded-lg  text-white font-bold w-full justify-center">
          Logout
        </button>
      </div>
    </div>
  );
}
