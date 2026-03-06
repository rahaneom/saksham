import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginSuccess } from "../../features/auth/authSlice";
import { loginUser } from "../../services/authService";
import { useToast } from "../../components/useToast";
import { Hand } from "lucide-react";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addToast = useToast();
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
      addToast({ message: "Please fix the errors in the form", type: "error" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await loginUser(form);
      dispatch(loginSuccess(res.data.token));
      addToast({ message: "Login successful! Redirecting...", type: "success" });
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      console.error(err);
      addToast({ message: err.response?.data?.message || "Login failed. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // return (
  //   <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br">
  //     <div className="w-full max-w-md">
  //       {/* Header */}
  //       <div className="text-center mb-8">
  //         <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
  //           Welcome Back
  //         </h1>
  //         <p className="text-base-content/70">Sign in to your account to continue</p>
  //       </div>

  //       {/* Login Card */}
  //       <form
  //         onSubmit={submit}
  //         className="card bg-base-100 shadow-2xl p-8 space-y-6 animate-scaleIn border border-base-300"
  //       >
  //         {/* Email Field */}
  //         <div className="form-control animate-slideUp" style={{ animationDelay: "0.1s" }}>
  //           <label className="label">
  //             <span className="label-text font-semibold">Email Address</span>
  //           </label>
  //           <div className="relative">
  //             <input
  //               className={`input input-bordered w-full pl-4  ${
  //                 errors.email ? "input-error" : "focus:ring-2 focus:ring-primary"
  //               }`}
  //               placeholder="your.email@example.com"
  //               type="email"
  //               value={form.email}
  //               onChange={(e) => {
  //                 setForm({ ...form, email: e.target.value });
  //                 if (errors.email) validateField("email", e.target.value);
  //               }}
  //               onBlur={(e) => validateField("email", e.target.value)}
  //             />
  //             <svg className="absolute right-3 top-3 w-5 h-5 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  //             </svg>
  //           </div>
  //           {errors.email && <span className="label-text-alt text-error mt-1 animate-fadeIn">{errors.email}</span>}
  //         </div>

  //         {/* Password Field */}
  //         <div className="form-control animate-slideUp" style={{ animationDelay: "0.2s" }}>
  //           <label className="label">
  //             <span className="label-text font-semibold">Password</span>
  //           </label>
  //           <div className="relative">
  //             <input
  //               type={showPassword ? "text" : "password"}
  //               className={`input input-bordered w-full pl-4 pr-12  ${
  //                 errors.password ? "input-error" : "focus:ring-2 focus:ring-primary"
  //               }`}
  //               placeholder="••••••••"
  //               value={form.password}
  //               onChange={(e) => {
  //                 setForm({ ...form, password: e.target.value });
  //                 if (errors.password) validateField("password", e.target.value);
  //               }}
  //               onBlur={(e) => validateField("password", e.target.value)}
  //             />
  //             <button
  //               type="button"
  //               onClick={() => setShowPassword(!showPassword)}
  //               className="absolute right-3 top-3 text-base-content/40 hover:text-base-content transition-colors"
  //             >
  //               {showPassword ? (
  //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
  //                 </svg>
  //               ) : (
  //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  //                 </svg>
  //               )}
  //             </button>
  //           </div>
  //           {errors.password && <span className="label-text-alt text-error mt-1 animate-fadeIn">{errors.password}</span>}
  //         </div>

  //         {/* Submit Button */}
  //         <button
  //           type="submit"
  //           disabled={isLoading}
  //           className="btn btn-primary w-full font-semibold text-lg mt-6 animate-slideUp  disabled:opacity-50 disabled:cursor-not-allowed"
  //           style={{ animationDelay: "0.3s" }}
  //         >
  //           {isLoading ? (
  //             <>
  //               <span className="loading loading-spinner loading-sm"></span>
  //               Signing in...
  //             </>
  //           ) : (
  //             "Sign In"
  //           )}
  //         </button>

  //         {/* Register Link */}
  //         <div className="text-center text-sm text-base-content/70 animate-slideUp" style={{ animationDelay: "0.4s" }}>
  //           Don't have an account?{" "}
  //           <Link to="/register" className="link link-primary font-semibold hover:link-secondary transition-colors">
  //             Sign up here
  //           </Link>
  //         </div>
  //       </form>

  //       {/* Footer Note */}
  //       <p className="text-center text-xs text-base-content/50 mt-8 animate-slideUp" style={{ animationDelay: "0.5s" }}>
  //         Your account is secure and encrypted
  //       </p>
  //     </div>
  //   </div>
  // );

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