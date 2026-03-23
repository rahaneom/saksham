import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../services/authService";
import { authToast, updateToast } from "../../util/toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      authToast.validationError("Email is required");
      return;
    }

    setIsLoading(true);
    const toastId = authToast.loading("Sending reset email...");

    try {
      const res = await requestPasswordReset({ email });
      updateToast.success(toastId, res.data || "Password reset email sent successfully");
      setEmail("");
    } catch (err) {
      updateToast.error(
        toastId,
        err.response?.data?.message || err.response?.data || "Failed to send reset email",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-lg shadow-2xl border border-base-300">
        <div className="card-body p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">
                <span className="label-text font-medium">Registered Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <p className="text-center text-sm mt-4">
              Remembered your password?{" "}
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

export default ForgotPassword;
