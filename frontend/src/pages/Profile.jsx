import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/authService";
import { authToast, updateToast } from "../util/toast";
import { User, Edit2 } from "lucide-react";
import Loader from "../components/Loader";

const academicYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ phone: "", academicYear: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
        setForm({
          phone: res.data.phone || "",
          academicYear: res.data.academicYear || "",
          password: "",
        });
      } catch (err) {
        console.error("[Profile] profile load error", err);
        setError(
          `Failed to load profile. status=${err.response?.status || "unknown"}, message=${
            err.response?.data?.message || err.message || "no message"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitUpdate = async (e) => {
    e.preventDefault();

    if (!form.phone.trim() || !form.academicYear.trim()) {
      authToast.validationError("Phone and academic year are required");
      return;
    }

    const toastId = authToast.loading("Updating profile...");
    try {
      const payload = {
        phone: form.phone,
        academicYear: form.academicYear,
      };
      if (form.password.trim()) {
        payload.password = form.password;
      }

      await updateProfile(payload);
      updateToast.success(toastId, "Profile updated successfully.");
      setProfile((p) => ({ ...p, phone: form.phone, academicYear: form.academicYear }));
      setForm((prev) => ({ ...prev, password: "" }));
      setEditMode(false);
    } catch (err) {
      console.error("[Profile] update error", err);
      updateToast.error(toastId, err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f2ed] flex items-center justify-center p-4">
        <div className="text-center  p-8 rounded-lg shadow-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 my-5">Unable to retrieve profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2ed] py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 animate-slideDown text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 text-base-content flex items-center justify-center gap-3">
            <User size={40} className="text-primary" />
            {profile?.name || "My Profile"}
          </h1>
          <p className="text-lg text-base-content/70">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="card shadow-lg border-5 p-8 animate-slideUp">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full text-white font-extrabold text-3xl flex items-center justify-center border-4 bg-slate-800 shadow-md">
                {profile.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-sm text-base-content/60">{profile.role?.replace("ROLE_", "") || "User"}</p>
              </div>
            </div>
            {!editMode ? (
              <button
                className="btn btn-circle btn-primary hover:shadow-lg bg-slate-50 transition-all"
                onClick={() => setEditMode(true)}
                title="Edit Profile"
              >
                <Edit2 size={20} />
              </button>
            ) : (
              <button
                className="btn btn-circle btn-ghost hover:bg-base-200 bg-slate-50 transition-all"
                onClick={() => setEditMode(false)}
                title="Cancel"
              >
                ✕
              </button>
            )}
          </div>

          {!editMode ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="p-4 bg-base-100 rounded-lg">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">Full Name</div>
                <div className="text-lg font-medium text-base-content mt-2">{profile.name}</div>
              </div>
              <div className="p-4 bg-base-100 rounded-lg">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">Email</div>
                <div className="text-lg font-medium text-base-content mt-2">{profile.email}</div>
              </div>
              <div className="p-4 bg-base-100 rounded-lg">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">Role</div>
                <div className="text-lg font-medium text-base-content mt-2">{profile.role?.replace("ROLE_", "") || "User"}</div>
              </div>
              <div className="p-4 bg-base-100 rounded-lg">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">Alias</div>
                <div className="text-lg font-medium text-base-content mt-2">{profile.alias || "N/A"}</div>
              </div>
              <div className="p-4 bg-base-100 rounded-lg">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">College</div>
                <div className="text-lg font-medium text-base-content mt-2">{profile.collegeName}</div>
              </div>
              <div className="p-4 bg-base-100 rounded-lg">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">Academic Year</div>
                <div className="text-lg font-medium text-base-content mt-2">{profile.academicYear}</div>
              </div>
              <div className="p-4 bg-base-100 rounded-lg">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">Phone</div>
                <div className="text-lg font-medium text-base-content mt-2">{profile.phone}</div>
              </div>
              <div className="p-4 bg-base-100 rounded-lg">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">Member Since</div>
                <div className="text-lg font-medium text-base-content mt-2">{new Date(profile.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={submitUpdate} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-base-content mb-2">Full Name</label>
                  <input className="input px-5 input-bordered bg-slate-200 w-full" value={profile.name} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-base-content mb-2">Email</label>
                  <input className="input input-bordered w-full px-5 bg-slate-200" value={profile.email} disabled />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">Phone</label>
                <input
                  className="input input-bordered px-5 w-full"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">Academic Year</label>
                <select
                  className="select px-5 select-bordered w-full"
                  value={form.academicYear}
                  onChange={(e) => handleChange("academicYear", e.target.value)}
                >
                  <option value="">Select year</option>
                  {academicYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">New Password (Optional)</label>
                <input
                  type="password"
                  className="input px-5 input-bordered w-full"
                  placeholder="Leave blank to keep current password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button className="btn bg-slate-800 text-white font-bold px-5" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
