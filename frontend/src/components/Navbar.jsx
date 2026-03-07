import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 shadow-md border-b border-base-300 px-4 sm:px-6 py-3 transition-all duration-300 animate-slideDown">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          Saksham
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-2 items-center">
        <ThemeToggle />
        {!user ? (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm font-semibold hover:bg-base-300 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm font-semibold">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="btn btn-ghost btn-sm  hover:bg-base-300 transition-colors text-sm">
              Dashboard
            </Link>
            <Link to="/resources" className="btn btn-ghost btn-sm  hover:bg-base-300 transition-colors text-sm">
              Resources
            </Link>
          {user.role === "ROLE_STUDENT" && (
              <>
                <Link to="/booking" className="btn btn-ghost btn-sm font-semibold hover:bg-base-300 transition-colors text-sm">
              Booking
            </Link>
            <Link to="/chatbot" className="btn btn-ghost btn-sm font-semibold hover:bg-base-300 transition-colors text-sm">
              Chatbot
            </Link>
            <Link to="/forum" className="btn btn-ghost btn-sm font-semibold hover:bg-base-300 transition-colors text-sm">
              Forum
            </Link>

            <Link to="/my-appointments" className="btn btn-ghost btn-sm font-semibold hover:bg-base-300 transition-colors text-sm">
              My Appointments
            </Link>
              </>
            )}
            {user.role === "ROLE_COUNSELLOR" && (
              <Link to="/counsellor" className="btn btn-ghost btn-sm font-semibold hover:bg-base-300 transition-colors text-sm">
                Appointments
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-error btn-sm font-bold px-3 hover:shadow-lg transition-all duration-300"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggle />
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="btn btn-ghost btn-circle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {isMenuOpen && (
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300 animate-slideDown">
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
                  <li>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </li>
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