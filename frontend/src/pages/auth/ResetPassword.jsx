import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { authToast, updateToast } from "../../util/toast";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      authToast.validationError("Invalid reset link");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      authToast.validationError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      authToast.validationError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const toastId = authToast.loading("Resetting password...");

    try {
      const res = await resetPassword({ token, newPassword });
      updateToast.success(toastId, res.data || "Password updated successfully");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      updateToast.error(
        toastId,
        err.response?.data?.message || err.response?.data || "Failed to reset password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-lg shadow-2xl border border-base-300">
        <div className="card-body p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">
                <span className="label-text font-medium">New Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Confirm New Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full mt-2 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>

            <p className="text-center text-sm mt-4">
              <Link to="/login" className="link link-primary font-medium">
                Back to Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
