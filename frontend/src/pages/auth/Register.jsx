import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { registerUser } from "../../services/authService";
import { useToast } from "../../components/useToast";

function Register() {
  const navigate = useNavigate();
  const addToast = useToast();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    academicYear: "",
    collegeName: "",
    role: "ROLE_STUDENT",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const validateField = (name, value) => {
    let msg = "";
    switch (name) {
      case "name":
        if (!value.trim()) msg = "Full name is required";
        else if (value.trim().length < 2) msg = "Name must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) msg = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = "Invalid email format";
        break;
      case "password":
        if (!value) msg = "Password is required";
        else if (value.length < 6) msg = "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        if (!value) msg = "Please confirm your password";
        else if (value !== form.password) msg = "Passwords do not match";
        break;
      case "phone":
        if (!value.trim()) msg = "Phone number is required";
        else if (!/^\d{10,}$/.test(value.replace(/[-\s]/g, ""))) msg = "Enter a valid 10+ digit phone number";
        break;
      case "academicYear":
        if (!value.trim()) msg = "Academic year is required";
        break;
      case "collegeName":
        if (!value.trim()) msg = "College name is required";
        break;
      default:
        break;
    }
    setErrors((e) => ({ ...e, [name]: msg }));
    return msg === "";
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) validateField(field, value);
  };

  const submit = async (e) => {
    e.preventDefault();
    let valid = true;
    Object.entries(form).forEach(([k, v]) => {
      if (k !== "role") valid = validateField(k, v) && valid;
    });
    if (!valid) {
      addToast({ message: "Please fix the errors below", type: "error" });
      return;
    }
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = form;
      await registerUser(registerData);
      addToast({ message: "Registration successful! Redirecting to login...", type: "success" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Registration failed";
      addToast({ message: errorMsg, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-base-100 to-base-200 animate-fadeIn">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-slideDown">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-base-content/70">Join us to begin your wellness journey</p>
        </div>

        {/* Registration Card */}
        <form
          onSubmit={submit}
          className="card bg-base-100 shadow-2xl p-8 space-y-5 animate-scaleIn border border-base-300 hover:shadow-3xl transition-all duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="form-control animate-slideUp" style={{ animationDelay: "0.1s" }}>
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input
                className={`input input-bordered transition-all duration-300 ${
                  errors.name ? "input-error" : "focus:ring-2 focus:ring-primary"
                }`}
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onBlur={(e) => validateField("name", e.target.value)}
              />
              {errors.name && <span className="label-text-alt text-error mt-1 animate-fadeIn">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-control animate-slideUp" style={{ animationDelay: "0.15s" }}>
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <input
                className={`input input-bordered transition-all duration-300 ${
                  errors.email ? "input-error" : "focus:ring-2 focus:ring-primary"
                }`}
                placeholder="john@example.com"
                type="email"
                value={form.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={(e) => validateField("email", e.target.value)}
              />
              {errors.email && <span className="label-text-alt text-error mt-1 animate-fadeIn">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-control animate-slideUp" style={{ animationDelay: "0.2s" }}>
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pr-12 transition-all duration-300 ${
                    errors.password ? "input-error" : "focus:ring-2 focus:ring-primary"
                  }`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleFieldChange("password", e.target.value)}
                  onBlur={(e) => validateField("password", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-base-content/40 hover:text-base-content"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <span className="label-text-alt text-error mt-1 animate-fadeIn">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-control animate-slideUp" style={{ animationDelay: "0.25s" }}>
              <label className="label">
                <span className="label-text font-semibold">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`input input-bordered w-full pr-12 transition-all duration-300 ${
                    errors.confirmPassword ? "input-error" : "focus:ring-2 focus:ring-primary"
                  }`}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
                  onBlur={(e) => validateField("confirmPassword", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-base-content/40 hover:text-base-content"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <span className="label-text-alt text-error mt-1 animate-fadeIn">{errors.confirmPassword}</span>}
            </div>

            {/* Phone */}
            <div className="form-control animate-slideUp" style={{ animationDelay: "0.3s" }}>
              <label className="label">
                <span className="label-text font-semibold">Phone Number</span>
              </label>
              <input
                className={`input input-bordered transition-all duration-300 ${
                  errors.phone ? "input-error" : "focus:ring-2 focus:ring-primary"
                }`}
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                onBlur={(e) => validateField("phone", e.target.value)}
              />
              {errors.phone && <span className="label-text-alt text-error mt-1 animate-fadeIn">{errors.phone}</span>}
            </div>

            {/* Academic Year */}
            <div className="form-control animate-slideUp" style={{ animationDelay: "0.35s" }}>
              <label className="label">
                <span className="label-text font-semibold">Academic Year</span>
              </label>
              <select
                className={`select select-bordered transition-all duration-300 ${
                  errors.academicYear ? "select-error" : "focus:ring-2 focus:ring-primary"
                }`}
                value={form.academicYear}
                onChange={(e) => handleFieldChange("academicYear", e.target.value)}
                onBlur={(e) => validateField("academicYear", e.target.value)}
              >
                <option value="">Select your year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
              {errors.academicYear && <span className="label-text-alt text-error mt-1 animate-fadeIn">{errors.academicYear}</span>}
            </div>

            {/* College Name */}
            <div className="form-control md:col-span-2 animate-slideUp" style={{ animationDelay: "0.4s" }}>
              <label className="label">
                <span className="label-text font-semibold">College/University Name</span>
              </label>
              <input
                className={`input input-bordered transition-all duration-300 ${
                  errors.collegeName ? "input-error" : "focus:ring-2 focus:ring-primary"
                }`}
                placeholder="XYZ College"
                value={form.collegeName}
                onChange={(e) => handleFieldChange("collegeName", e.target.value)}
                onBlur={(e) => validateField("collegeName", e.target.value)}
              />
              {errors.collegeName && <span className="label-text-alt text-error mt-1 animate-fadeIn">{errors.collegeName}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full font-semibold text-lg mt-8 animate-slideUp transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ animationDelay: "0.45s" }}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Login Link */}
          <div className="text-center text-sm text-base-content/70 animate-slideUp" style={{ animationDelay: "0.5s" }}>
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-semibold hover:link-secondary transition-colors">
              Sign in here
            </Link>
          </div>
        </form>

        {/* Footer Note */}
        <p className="text-center text-xs text-base-content/50 mt-8 animate-slideUp" style={{ animationDelay: "0.55s" }}>
          Your data is encrypted and secure
        </p>
      </div>
    </div>
  );
}

export default Register;