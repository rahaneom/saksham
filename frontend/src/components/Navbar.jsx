import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import ThemeToggle from "./ThemeToggle";
import ProfileCard from "./ProfileCard";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProfile } from "../services/authService";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const profileCloseTimeoutRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(() =>
    document.documentElement.getAttribute("data-theme") === "dark",
  );
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const res = await getProfile();
          setProfile(res.data);
        } catch (err) {
          console.error("Failed to fetch profile for navbar:", err);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  const openProfileCard = () => {
    if (profileCloseTimeoutRef.current) {
      clearTimeout(profileCloseTimeoutRef.current);
      profileCloseTimeoutRef.current = null;
    }
    setIsProfileCardOpen(true);
  };

  const closeProfileCardWithDelay = () => {
    if (profileCloseTimeoutRef.current) {
      clearTimeout(profileCloseTimeoutRef.current);
    }

    // Small delay lets pointer cross from avatar to card without flicker/hide.
    profileCloseTimeoutRef.current = setTimeout(() => {
      setIsProfileCardOpen(false);
    }, 180);
  };

  useEffect(() => {
    const root = document.documentElement;
    const updateThemeFlag = () => {
      setIsDarkTheme(root.getAttribute("data-theme") === "dark");
    };

    updateThemeFlag();

    const observer = new MutationObserver(updateThemeFlag);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      observer.disconnect();
      if (profileCloseTimeoutRef.current) {
        clearTimeout(profileCloseTimeoutRef.current);
      }
    };
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
      ? "dropdown-content left-0 z-[1] menu p-4 shadow-lg bg-[#0d4b6a]/95 text-slate-100 rounded-lg w-64 border border-white/20 backdrop-blur-md animate-slideDown"
      : "dropdown-content left-0 z-[1] menu p-4 shadow-lg bg-white/98 text-slate-800 rounded-lg w-64 border border-slate-300/80 backdrop-blur-md animate-slideDown"
    : "dropdown-content left-0 z-[1] menu p-4 shadow-lg bg-base-100 rounded-lg w-64 border border-base-300 animate-slideDown";

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
      <div className="hidden md:flex items-center gap-4 ml-auto">
        {!user ? (
          <>
            <Link to="/login" className="{navActionClass} text-base">
              Sign In
            </Link>
            <Link to="/register" className="btn bg-slate-800 text-white btn-sm font-semibold px-4 text-base">
              Sign Up
            </Link>
          </>
        ) : (
          <div
            className="relative dropdown dropdown-end"
            onMouseEnter={openProfileCard}
            onMouseLeave={closeProfileCardWithDelay}
          >
            <button
              tabIndex={0}
              className={`w-12 h-12 rounded-full font-extrabold text-white flex items-center justify-center border-4 transition-all duration-300 hover:shadow-lg ${
                isHomePage
                  ? "bg-slate-800 border-primary/30"
                  : "bg-slate-800 border-primary/30"
              }`}
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
            </button>
            {isProfileCardOpen && (
              <div className="pt-2" onMouseEnter={openProfileCard} onMouseLeave={closeProfileCardWithDelay}>
                <ProfileCard
                  profile={profile}
                  user={user}
                  onProfile={() => {
                    setIsProfileCardOpen(false);
                    setIsUserDropdownOpen(false);
                    window.location.href = "/profile";
                  }}
                  onAppointments={() => {
                    setIsProfileCardOpen(false);
                    setIsUserDropdownOpen(false);
                    window.location.href = user.role === "ROLE_COUNSELLOR" ? "/counsellor" : "/my-appointments";
                  }}
                  onLogout={() => {
                    setIsProfileCardOpen(false);
                    setIsUserDropdownOpen(false);
                    handleLogout();
                  }}
                />
              </div>
            )}
            {isUserDropdownOpen && (
              <ul
                tabIndex={0}
                className={`dropdown-content z-[1] menu p-2 shadow-lg rounded-box w-52 border ${
                  isHomePage
                    ? isDarkTheme
                      ? "bg-[#0d4b6a]/95 text-slate-100 border-white/20"
                      : "bg-white/95 text-slate-800 border-slate-300/80"
                    : "bg-base-100 border-base-300"
                } animate-slideDown`}
              >
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-6 h-" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                </li>
                {user.role === "ROLE_STUDENT" && (
                  <li>
                    <Link
                      to="/my-appointments"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      My Appointments
                    </Link>
                  </li>
                )}
                {user.role === "ROLE_COUNSELLOR" && (
                  <li>
                    <Link
                      to="/counsellor"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Appointments
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-error font-semibold flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden ml-auto flex items-center gap-3">
        <ThemeToggle />
        {user && profile && (
          <div
            className="relative"
            onMouseEnter={openProfileCard}
            onMouseLeave={closeProfileCardWithDelay}
          >
            <button
              tabIndex={0}
              className="w-10 h-10 rounded-full bg-primary text-white font-extrabold text-sm flex items-center justify-center border-4 border-primary/30 hover:shadow-md transition-all"
              onClick={() => setIsProfileCardOpen((prev) => !prev)}
            >
              {profile.name?.[0]?.toUpperCase() || "U"}
            </button>
            {isProfileCardOpen && (
              <div className="absolute right-0 top-full pt-2" onMouseEnter={openProfileCard} onMouseLeave={closeProfileCardWithDelay}>
                <ProfileCard
                  profile={profile}
                  user={user}
                  onProfile={() => {
                    setIsProfileCardOpen(false);
                    setIsUserDropdownOpen(false);
                    window.location.href = "/profile";
                  }}
                  onAppointments={() => {
                    setIsProfileCardOpen(false);
                    setIsUserDropdownOpen(false);
                    window.location.href =
                      user.role === "ROLE_COUNSELLOR" ? "/counsellor" : "/my-appointments";
                  }}
                  onLogout={() => {
                    setIsProfileCardOpen(false);
                    setIsUserDropdownOpen(false);
                    handleLogout();
                  }}
                />
              </div>
            )}
          </div>
        )}
        <button
          className={`btn btn-ghost btn-circle btn-sm ${
            isHomePage
              ? isDarkTheme
                ? "text-slate-100 hover:bg-white/15"
                : "text-slate-800 hover:bg-slate-900/10"
              : ""
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Left Side Drawer Menu */}
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/20 z-30 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            {/* Drawer */}
            <div
              className={`fixed left-0 top-0 h-screen w-64 z-40 md:hidden transform transition-transform duration-300 ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              } ${
                isHomePage
                  ? isDarkTheme
                    ? "bg-[#0d4b6a]/95 text-slate-100 border-r border-white/20"
                    : "bg-white/98 text-slate-800 border-r border-slate-300/80"
                  : "bg-base-100 border-r border-base-300"
              }`}
            >
              <div className="p-4">
                <button
                  className="btn btn-ghost btn-circle btn-sm float-right"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ✕
                </button>
              </div>
              <nav className="menu p-4 space-y-2">
                {!user ? (
                  <>
                    <li>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-base">
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-base">
                        Sign Up
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/resources" onClick={() => setIsMenuOpen(false)} className="text-base">
                        Resources
                      </Link>
                    </li>
                    {user.role === "ROLE_STUDENT" && (
                      <>
                        <li>
                          <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="text-base">
                            Booking
                          </Link>
                        </li>
                        <li>
                          <Link to="/chatbot" onClick={() => setIsMenuOpen(false)} className="text-base">
                            Chatbot
                          </Link>
                        </li>
                        <li>
                          <Link to="/forum" onClick={() => setIsMenuOpen(false)} className="text-base">
                            Forum
                          </Link>
                        </li>
                      </>
                    )}
                    {user.role === "ROLE_COUNSELLOR" && (
                      <li>
                        <Link to="/counsellor" onClick={() => setIsMenuOpen(false)} className="text-base">
                          Appointments
                        </Link>
                      </li>
                    )}
                  </>
                )}
              </nav>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;