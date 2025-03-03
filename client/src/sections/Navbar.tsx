import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTicketAlt, FaUserCircle, FaSignInAlt, FaUserPlus, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import useAuth from "../store/useAuth";

import  { ReactNode } from "react";
const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    // logout();
    navigate("/login");
    setUserMenuOpen(false);
  };

  // Close menus when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md text-gray-800" : "bg-transparent text-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div 
              className={`rounded-lg p-2 ${isScrolled ? "bg-blue-600 text-white" : "bg-white/20 backdrop-blur-sm"}`}
            >
              <FaTicketAlt className="text-xl" />
            </div>
            <span className="text-xl font-bold">SupportSphere</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {isAuthenticated && (
              <div className="flex items-center space-x-6">
                <NavLink to="/dashboard" isScrolled={isScrolled}>Dashboard</NavLink>
                <NavLink to="/tickets" isScrolled={isScrolled}>Tickets</NavLink>
                {user?.role === "admin" && (
                  <NavLink to="/admin" isScrolled={isScrolled}>Admin</NavLink>
                )}
              </div>
            )}

            {/* Auth buttons */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center space-x-2 rounded-full px-3 py-2 transition-colors ${
                      isScrolled
                        ? "hover:bg-gray-100"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <FaUserCircle className="text-xl" />
                    <span className="font-medium text-sm">
                      {user?.firstName || ""} {user?.lastName || ""}
                    </span>
                    <FaChevronDown className="text-xs" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-700">
                          {user?.firstName || ""} {user?.lastName || ""}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                      isScrolled
                        ? "text-blue-600 hover:bg-blue-50"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg ${
                      isScrolled
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                    }`}
                  >
                    <FaUserPlus />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className={`lg:hidden ${isScrolled ? "bg-white" : "bg-gray-900"} pb-4`}>
          <div className="container mx-auto px-4 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/dashboard" isScrolled={isScrolled}>Dashboard</MobileNavLink>
                <MobileNavLink to="/tickets" isScrolled={isScrolled}>Tickets</MobileNavLink>
                {user?.role === "admin" && (
                  <MobileNavLink to="/admin" isScrolled={isScrolled}>Admin</MobileNavLink>
                )}
                
                <div className="pt-4 mt-2 border-t border-gray-700">
                  <div className="px-4 py-2">
                    <p className={`font-medium ${isScrolled ? "text-gray-700" : "text-white"}`}>
                      {user?.firstName || ""} {user?.lastName || ""}
                    </p>
                    <p className={`text-xs ${isScrolled ? "text-gray-500" : "text-gray-400"}`}>
                      {user?.email || ""}
                    </p>
                  </div>
                  <MobileNavLink to="/profile" isScrolled={isScrolled}>Your Profile</MobileNavLink>
                  <MobileNavLink to="/settings" isScrolled={isScrolled}>Settings</MobileNavLink>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left block px-4 py-2 text-sm ${
                      isScrolled ? "text-red-600 hover:bg-red-50" : "text-red-400 hover:bg-gray-800"
                    }`}
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-4 py-2">
                <Link
                  to="/login"
                  className={`flex items-center justify-center space-x-1 px-4 py-2 rounded-lg ${
                    isScrolled
                      ? "border border-blue-600 text-blue-600 hover:bg-blue-50"
                      : "border border-white/30 text-white hover:bg-white/10"
                  }`}
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className={`flex items-center justify-center space-x-1 px-4 py-2 rounded-lg ${
                    isScrolled
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                  }`}
                >
                  <FaUserPlus />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};



const NavLink = ({ to, children, isScrolled }: { to: string; children: ReactNode; isScrolled: boolean }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link
      to={to}
      className={`relative px-1 py-2 transition-colors ${
        isActive
          ? isScrolled
            ? "text-blue-600"
            : "text-white"
          : isScrolled
          ? "text-gray-700 hover:text-blue-600"
          : "text-gray-100 hover:text-white"
      }`}
    >
      {children}
      {isActive && (
        <span
          className={`absolute bottom-0 left-0 w-full h-0.5 ${
            isScrolled ? "bg-blue-600" : "bg-white"
          }`}
        />
      )}
    </Link>
  );
};

const MobileNavLink = ({ to, children, isScrolled }: { to: string; children: React.ReactNode; isScrolled: boolean }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link
      to={to}
      className={`block px-4 py-2 rounded-lg ${
        isActive
          ? isScrolled
            ? "bg-blue-50 text-blue-600"
            : "bg-gray-800 text-white"
          : isScrolled
          ? "text-gray-700 hover:bg-gray-100"
          : "text-gray-200 hover:bg-gray-800"
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;