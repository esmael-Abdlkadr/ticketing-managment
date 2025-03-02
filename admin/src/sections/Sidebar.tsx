import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaUsers,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaChevronLeft,
  FaRegClock,
  FaUserCircle,
} from "react-icons/fa";
import useAuth from "../store/useAuth";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState("");
  const { user, clearUser } = useAuth();
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toISOString().split(".")[0].replace("T", " ");
      setCurrentTime(timeString);
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: "/", label: "Dashboard", icon: <FaChartBar /> },
    { path: "/tickets", label: "Tickets", icon: <FaTicketAlt /> },
    { path: "/users", label: "Users", icon: <FaUsers /> },
    { path: "/settings", label: "Settings", icon: <FaCog /> },
  ];
  const handleLogout = () => {
    clearUser();
    navigate("/login", { replace: true });
  };
  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } bg-gray-800 text-white shadow-lg`}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className={`font-bold text-xl ${isOpen ? "block" : "hidden"}`}>
            SupportSphere
          </h1>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            {isOpen ? <FaChevronLeft /> : <FaBars />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    location.pathname === item.path ? "bg-gray-700" : ""
                  }`}
                >
                  <div className="text-lg">{item.icon}</div>
                  <span className={`ml-3 ${isOpen ? "block" : "hidden"}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User & time info */}
        <div className="border-t border-gray-700 p-4 text-sm">
          <div className="flex items-center mb-2">
            <FaRegClock className="text-gray-400" />
            <span
              className={`ml-2 text-gray-300 text-xs ${
                isOpen ? "block" : "hidden"
              }`}
            >
              {currentTime}
            </span>
          </div>

          <div className="flex items-center">
            <FaUserCircle className="text-gray-400" />
            <span
              className={`ml-2 text-gray-300 truncate ${
                isOpen ? "block" : "hidden"
              }`}
            >
              {user?.firstName} {user?.lastName}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className={`mt-4 flex items-center p-2 rounded-lg text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors ${
              !isOpen && "justify-center"
            }`}
          >
            <FaSignOutAlt />
            <span className={`ml-2 ${isOpen ? "block" : "hidden"}`}>
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
