    import React, { useState } from "react";
    import { NavLink, useNavigate } from "react-router-dom";
    import { LayoutDashboard, Eye, FilePlus, CreditCard, CheckCircle, LogOut } from "lucide-react";
    import { useTheme } from "../../contexts/ThemeContext";

    interface TenantSidebarProps {
    isOpen?: boolean;
    }

    const tenantMenu = [
    { to: "/tenant/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/tenant/view", label: "View", icon: Eye },
    { to: "/tenant/request", label: "Request", icon: FilePlus },
    { to: "/tenant/pay", label: "Pay", icon: CreditCard },
    { to: "/tenant/status", label: "Check Status", icon: CheckCircle },
    ];

    const TenantSidebar: React.FC<TenantSidebarProps> = ({ isOpen = true }) => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logout = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        setIsLoggingOut(false);
        navigate("/login-admin");
        }, 1000);
    };

    return (
        <>
        <div
            className={`h-screen flex flex-col justify-between transition-all duration-300 ease-in-out shadow-lg ${
            isOpen ? "w-64" : "w-20"
            }`}
            style={{ backgroundColor: "#001F3D" }}
        >
            <div>
            {/* HEADER */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/20 min-h-[72px]">
                <span className="font-bold text-white text-lg truncate">{isOpen ? "Tenant Dashboard" : "TD"}</span>
            </div>

            {/* NAVIGATION */}
            <nav className="flex flex-col mt-4 space-y-2">
                {tenantMenu.map(({ to, label, icon: Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 rounded-r-xl transition-all duration-200 ${
                        isActive ? "bg-white/25 font-semibold" : "hover:bg-white/10"
                    } text-white` // <-- Force all text white
                    }
                >
                    <Icon className="h-5 w-5 text-white flex-shrink-0" />
                    {isOpen && <span className="truncate">{label}</span>}
                </NavLink>
                ))}
            </nav>
            </div>

            {/* LOGOUT */}
            <div className="relative w-full mb-4">
            <button
                onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                className="flex items-center gap-3 px-6 py-4 w-full rounded-r-xl transition-all duration-200 hover:bg-red-600 text-white"
            >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span className="truncate">Logout</span>}
            </button>

            {showLogoutMenu && isOpen && (
                <div className="absolute bottom-14 left-0 w-[90%] bg-white/10 rounded-xl shadow-lg py-2 flex flex-col gap-1 z-10 transition-all duration-200 ease-in-out">
                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-white px-4 py-2 hover:bg-red-600 rounded-lg transition-colors duration-200"
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">Confirm Logout</span>
                </button>
                <button
                    onClick={() => setShowLogoutMenu(false)}
                    className="text-white px-4 py-2 text-left hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                    Cancel
                </button>
                </div>
            )}
            </div>
        </div>

        {/* FULL SCREEN LOADING OVERLAY */}
        {isLoggingOut && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300">
            <div className="flex flex-col items-center gap-2 bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <svg
                className="animate-spin h-10 w-10 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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

    export default TenantSidebar;
