import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BedDouble,
  CalendarCheck,
  Receipt,
  BarChart3,
  UserCircle,
  Bell,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface SidebarProps {
  isOpen: boolean;
}

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/rooms", label: "Room", icon: BedDouble },
  { to: "/tenant", label: "Tenant", icon: Users },
  { to: "/booking-requests", label: "Booking", icon: CalendarCheck },
  { to: "/payment-bill", label: "Payment & Bill", icon: Receipt },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell, isNotification: true },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const unreadNotifications = 5;

  const handleLogout = () => {
    // Show full-screen loading
    setIsLoggingOut(true);

    setTimeout(() => {
      // Simulate logout API call
      setIsLoggingOut(false);
      navigate("/login-admin");
    }, 1500); // 1.5 seconds loading
  };

  return (
    <>
      <div
        className={`h-screen flex flex-col justify-between transition-all duration-300 border-r shadow-[4px_0_10px_rgba(0,0,0,0.2)] ${
          isOpen ? "w-64" : "w-20"
        }`}
        style={{ backgroundColor: "#001F3D" }}
      >
        <div>
          {/* ADMIN HEADER */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/20">
            <UserCircle className="h-10 w-10 text-white" />
            {isOpen && (
              <div className="leading-tight">
                <p className="text-sm font-semibold text-white">Admin User</p>
                <span className="text-xs text-white/70">Administrator</span>
              </div>
            )}
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-col mt-4 space-y-3">
            {navItems.map(({ to, label, icon: Icon, isNotification }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3 transition-all w-[90%] rounded-r-xl shadow-[3px_3px_6px_rgba(0,0,0,0.4)] text-white ${
                    isActive ? "bg-white/25 font-bold scale-105" : "bg-white/10 font-medium"
                  }`
                }
                style={({ isActive }) => ({
                  width: isOpen ? "90%" : "100%",
                  justifyContent: isOpen ? "flex-start" : "center",
                  paddingLeft: isOpen ? "1.5rem" : "0",
                  borderTopRightRadius: isOpen ? 12 : 0,
                  borderBottomRightRadius: isActive ? 12 : 0,
                })}
              >
                <div className="relative">
                  <Icon className="h-6 w-6 text-white" />
                  {isNotification && unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {unreadNotifications}
                    </span>
                  )}
                </div>
                {isOpen && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* BOTTOM SECTION: Sign Out Drop-Up */}
        <div className="relative w-full mb-4">
          <button
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            className={`flex items-center gap-3 py-3 transition-all w-[90%] rounded-r-xl shadow-[3px_3px_6px_rgba(0,0,0,0.4)] bg-white/10 text-white hover:bg-red-600`}
            style={{
              justifyContent: isOpen ? "flex-start" : "center",
              paddingLeft: isOpen ? "1.5rem" : "0",
            }}
          >
            <LogOut className="h-6 w-6" />
            {isOpen && <span>Sign Out</span>}
          </button>

          {/* DROP-UP MENU */}
          {showLogoutMenu && isOpen && (
            <div className="absolute bottom-14 left-0 w-[90%] bg-white/10 rounded-xl shadow-lg py-2 flex flex-col gap-1 z-10">
              {/* SETTINGS LINK */}
              <NavLink
                to="/settings"
                className="flex items-center gap-2 text-white px-4 py-2 hover:bg-white/20 rounded-lg"
                onClick={() => setShowLogoutMenu(false)}
              >
                <SettingsIcon className="h-5 w-5" />
                <span>Settings</span>
              </NavLink>

              {/* CONFIRM LOGOUT */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white px-4 py-2 hover:bg-red-600 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>

              {/* CANCEL BUTTON */}
              <button
                onClick={() => setShowLogoutMenu(false)}
                className="text-white px-4 py-2 text-left hover:bg-white/20 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FULL SCREEN LOADING OVERLAY */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-2 bg-white/10 p-6 rounded-xl shadow-lg">
            <svg
              className="animate-spin h-10 w-10 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="text-white text-lg font-medium">Logging out...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
