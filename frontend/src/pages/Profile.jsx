import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/authService";
import { authToast, updateToast } from "../util/toast";
import { User, Edit2, Eye, EyeOff } from "lucide-react";
import Loader from "../components/Loader";

const academicYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ phone: "", academicYear: "" });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
        setForm({
          phone: res.data.phone || "",
          academicYear: res.data.academicYear || "",
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

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitUpdate = async (e) => {
    e.preventDefault();

    if (!form.phone.trim() || !form.academicYear.trim()) {
      authToast.validationError("Phone and academic year are required");
      return;
    }

    setIsSavingProfile(true);
    const toastId = authToast.loading("Updating profile...");
    try {
      const payload = {
        phone: form.phone,
        academicYear: form.academicYear,
      };

      await updateProfile(payload);
      updateToast.success(toastId, "Profile updated successfully.");
      setProfile((p) => ({ ...p, phone: form.phone, academicYear: form.academicYear }));
    } catch (err) {
      console.error("[Profile] update error", err);
      updateToast.error(toastId, err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const submitPasswordUpdate = async (e) => {
    e.preventDefault();

    if (
      !passwordForm.oldPassword.trim() ||
      !passwordForm.newPassword.trim() ||
      !passwordForm.confirmPassword.trim()
    ) {
      authToast.validationError("Old password, new password, and confirm password are required");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      authToast.validationError("New password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      authToast.validationError("New password and confirm password do not match");
      return;
    }

    if (passwordForm.oldPassword === passwordForm.newPassword) {
      authToast.validationError("New password must be different from old password");
      return;
    }

    setIsSavingPassword(true);
    const toastId = authToast.loading("Updating password...");
    try {
      await updateProfile({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      updateToast.success(toastId, "Password updated successfully.");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowOldPassword(false);
      setShowNewPassword(false);
      setIsPasswordModalOpen(false);
    } catch (err) {
      console.error("[Profile] password update error", err);
      updateToast.error(toastId, err.response?.data?.message || "Failed to update password");
    } finally {
      setIsSavingPassword(false);
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
            <User size={40} className="hidden md:block text-primary" />
            My Profile
          </h1>
          <p className="text-lg text-base-content/70">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="card shadow-lg border-5 p-8 animate-slideUp">
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden md:flex w-16 h-16 rounded-full text-white font-extrabold text-3xl items-center justify-center border-4 bg-slate-800 shadow-md">
                {profile.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">{profile.name}</h2>
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
                onClick={() => {
                  setEditMode(false);
                  setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
                }}
                title="Cancel"
              >
                ✕
              </button>
            )}
          </div>

          {!editMode ? (
            <div className="space-y-6">
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

              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn btn-outline border-slate-800 text-slate-800 font-semibold border-2 px-3 hover:bg-slate-800 hover:text-slate-100"
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  Change Password
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <form onSubmit={submitUpdate} className="space-y-6">
                <h3 className="text-lg font-semibold text-base-content">Update Profile Details</h3>

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

                <div className="flex gap-3 pt-2 justify-end">
                  <button className="btn bg-slate-800 text-white font-bold px-5" type="submit" disabled={isSavingProfile}>
                    {isSavingProfile ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-base-100 p-6 shadow-2xl border border-base-300">
              <h3 className="text-lg font-semibold text-base-content mb-4">Update Password</h3>
              <form onSubmit={submitPasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-base-content mb-2">Old Password</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      className="input px-5 pr-20 input-bordered w-full"
                      placeholder="Enter your current password"
                      value={passwordForm.oldPassword}
                      onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
                      onClick={() => setShowOldPassword((prev) => !prev)}
                      aria-label={showOldPassword ? "Hide old password" : "Show old password"}
                      title={showOldPassword ? "Hide old password" : "Show old password"}
                    >
                      {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-base-content mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="input px-5 pr-20 input-bordered w-full"
                      placeholder="Enter a new password"
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                      title={showNewPassword ? "Hide new password" : "Show new password"}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-base-content mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="input px-5 input-bordered w-full"
                    placeholder="Re-enter the new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2 justify-end">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
                      setShowOldPassword(false);
                      setShowNewPassword(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="btn bg-slate-800 text-white font-bold px-5" type="submit" disabled={isSavingPassword}>
                    {isSavingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
