import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginSuccess } from "../../features/auth/authSlice";
import { loginUser } from "../../services/authService";
import { authToast, updateToast } from "../../util/toast";
import { Hand } from "lucide-react";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const validateField = (name, value) => {
    let msg = "";
    switch (name) {
      case "email":
        if (!value.trim()) msg = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = "Invalid email format";
        break;
      case "password":
        if (!value) msg = "Password is required";
        else if (value.length < 6) msg = "Password must be at least 6 characters";
        break;
      default:
        break;
    }
    setErrors((e) => ({ ...e, [name]: msg }));
    return msg === "";
  };

  const submit = async (e) => {
    e.preventDefault();
    let valid = true;
    Object.entries(form).forEach(([k, v]) => {
      valid = validateField(k, v) && valid;
    });
    if (!valid) {
      authToast.validationError("Please fix the errors in the form");
      return;
    }
    setIsLoading(true);
    const toastId = authToast.loading("Signing in...");
    try {
      const res = await loginUser(form);
      dispatch(loginSuccess(res.data.token));
      updateToast.success(toastId, "Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      console.error(err);
      updateToast.error(
        toastId,
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center justify-center px-4">

    <div className="hero-content flex-col lg:flex-row-reverse gap-16 w-full max-w-6xl">

      {/* Right Side Text Section */}
      <div className="text-center lg:text-left max-w-lg">
        <h1 className="text-5xl font-extrabold leading-tight">
          Welcome Back !
        </h1> 
        <p className="py-6 text-base-content/70 text-lg">
          Access your dashboard, manage your resources, and continue your journey securely.
        </p>

        <div className="hidden lg:block mt-6">
          <div className="badge badge-primary badge-lg">Secure</div>
          <div className="badge badge-secondary badge-lg ml-2">Fast</div>
          <div className="badge badge-accent badge-lg ml-2">Reliable</div>
        </div>
      </div>

      {/* Login Card */}
      <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-lg shadow-2xl border border-base-300">

        <div className="card-body p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Sign In
          </h2>

          <form onSubmit={submit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                placeholder="your.email@example.com"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errors.email) validateField("email", e.target.value);
                }}
                onBlur={(e) => validateField("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pr-14 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (errors.password)
                      validateField("password", e.target.value);
                  }}
                  onBlur={(e) => validateField("password", e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-sm text-primary font-medium hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm link link-hover text-primary"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full mt-2 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Register */}
            <p className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="link link-primary font-medium">
                Sign up
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  </div>
);
}

export default Login;