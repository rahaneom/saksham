import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() =>
    document.documentElement.getAttribute("data-theme") === "dark",
  );
  const isHomePage = location.pathname === "/";

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const root = document.documentElement;
    const updateThemeFlag = () => {
      setIsDarkTheme(root.getAttribute("data-theme") === "dark");
    };

    updateThemeFlag();

    const observer = new MutationObserver(updateThemeFlag);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  const homeTextClass = isDarkTheme ? "text-slate-100" : "text-slate-800";
  const homeHoverClass = isDarkTheme
    ? "hover:text-white hover:bg-white/12 hover:border-white/25"
    : "hover:text-slate-900 hover:bg-slate-900/10 hover:border-slate-700/20";

  const navClass = isHomePage
    ? "fixed top-0 left-0 w-full bg-gradient-to-b from-[#0c3f61]/45 via-[#0c4e73]/22 to-transparent backdrop-blur-lg backdrop-saturate-150 border-b border-white/20 shadow-[0_8px_24px_rgba(12,63,97,0.2)]"
    : "sticky top-0 bg-base-100/80 backdrop-blur-md shadow-md border-b border-base-300";

  const navActionClass = isHomePage
    ? `btn btn-ghost btn-sm font-semibold ${homeTextClass} ${homeHoverClass} border border-transparent transition-colors`
    : "btn btn-ghost btn-sm font-semibold hover:bg-base-300 transition-colors";

  const navFeatureLinkClass = isHomePage
    ? `inline-block relative no-underline text-base font-semibold ${homeTextClass} transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-current after:rounded-full after:transition-all after:duration-300 hover:after:w-full`
    : "inline-block relative no-underline text-base font-semibold text-base-content transition-colors duration-300 hover:text-base-content after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-current after:rounded-full after:transition-all after:duration-300 hover:after:w-full";

  const mobileMenuClass = isHomePage
    ? isDarkTheme
      ? "dropdown-content z-[1] menu p-2 shadow-lg bg-[#0d4b6a]/90 text-slate-100 rounded-box w-52 border border-white/20 backdrop-blur-md animate-slideDown"
      : "dropdown-content z-[1] menu p-2 shadow-lg bg-white/95 text-slate-800 rounded-box w-52 border border-slate-300/80 backdrop-blur-md animate-slideDown"
    : "dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300 animate-slideDown";

  return (
    <nav
      className={`navbar border-none px-4 sm:px-6 py-6 z-50 transition-all duration-300 animate-slideDown ${navClass}`}
    >
      <div className="flex-1">
        <Link
          to="/"
          className={`text-2xl font-bold hover:opacity-90 transition-opacity ${
            isHomePage
              ? "bg-gradient-to-r from-cyan-100 via-sky-100 to-white bg-clip-text text-transparent"
              : "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          }`}
        >
          Saksham
        </Link>
      </div>

      {/* Desktop Center Menu */}
      <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-12  ${isHomePage ? homeTextClass : ""}`}>
        <ThemeToggle />
        {user && (
          <>
            <Link to="/resources" className={navFeatureLinkClass}>
              Resources
            </Link>
            {user.role === "ROLE_STUDENT" && (
              <>
                <Link to="/booking" className={navFeatureLinkClass}>
                  Booking
                </Link>
                <Link to="/chatbot" className={navFeatureLinkClass}>
                  Chatbot
                </Link>
                <Link to="/forum" className={navFeatureLinkClass}>
                  Forum
                </Link>
                <Link to="/my-appointments" className={navFeatureLinkClass}>
                  My Appointments
                </Link>
              </>
            )}
            {user.role === "ROLE_COUNSELLOR" && (
              <Link to="/counsellor" className={navFeatureLinkClass}>
                Appointments
              </Link>
            )}
          </>
        )}
      </div>

      {/* Desktop Right Actions */}
      <div className="hidden md:flex items-center gap-6 ml-auto">
        {!user ? (
          <>
            <Link to="/login" className="{navActionClass} text-lg">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary text-lg btn-sm font-semibold">
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className={`btn btn-sm font-semibold px-6  text-xl hover:shadow-lg transition-all duration-300 ${
              isHomePage
                ? "bg-rose-100 text-black border-0 hover:bg-red-200"
                : "btn-error"
            }`}
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggle />
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className={`btn btn-ghost btn-circle ${
              isHomePage
                ? isDarkTheme
                  ? "text-slate-100 hover:bg-white/15"
                  : "text-slate-800 hover:bg-slate-900/10"
                : ""
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {isMenuOpen && (
            <ul tabIndex={0} className={mobileMenuClass}>
              {!user ? (
                <>
                  <li>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {/* <li>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </li> */}
                  <li>
                    <Link to="/resources" onClick={() => setIsMenuOpen(false)}>
                      Resources
                    </Link>
                  </li>
                  <li>
                    <Link to="/booking" onClick={() => setIsMenuOpen(false)}>
                      Booking
                    </Link>
                  </li>
                  <li>
                    <Link to="/chatbot" onClick={() => setIsMenuOpen(false)}>
                      Chatbot
                    </Link>
                  </li>
                  <li>
                    <Link to="/forum" onClick={() => setIsMenuOpen(false)}>
                      Forum
                    </Link>
                  </li>
                  {user.role === "ROLE_COUNSELLOR" && (
                    <li>
                      <Link to="/counsellor" onClick={() => setIsMenuOpen(false)}>
                        Appointments
                      </Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="text-error font-semibold">
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;