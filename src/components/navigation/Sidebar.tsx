import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Home,
  CreditCard,
  Wrench,
  BarChart3,
  ClipboardList,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`h-screen transition-all duration-300 flex flex-col ${
        isOpen ? "w-64" : "w-20"
      } ${darkMode ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-200"} 
      border-r shadow-[4px_0_10px_rgba(0,0,0,0.2)]`}
    >
      <div className="flex flex-col h-full justify-between">
        {/* TOP */}
        <div className="flex flex-col items-start">
          {/* Logo Container */}
          <div className="w-full flex items-center justify-center px-4 py-4 border-b border-[#ED3F27] mb-4">
            <img
              src="/ADMIN.png"
              alt="Logo"
              className="h-20 w-50 object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col w-full space-y-3 items-start">
            {[
              { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
              { to: "/tenants", label: "Tenants", icon: Users },
              { to: "/requested-changes", label: "Requested", icon: ClipboardList },
              { to: "/apartments", label: "Apartments", icon: Home },
              { to: "/rent-payments", label: "Rent & Payments", icon: CreditCard },
              { to: "/maintenance", label: "Maintenance", icon: Wrench },
              { to: "/reports", label: "Reports", icon: BarChart3 },
            ].map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={`flex items-center gap-3 py-3 transition-all w-[90%] bg-[#ED3F27] text-white rounded-r-xl shadow-[3px_3px_6px_rgba(0,0,0,0.4)]
                  ${darkMode ? 'hover:bg-[#d63a20]' : 'hover:bg-[#c4351c]'}`}
                style={({ isActive }) => ({
                  // REMOVED OPACITY (No more halap/faded look)
                  width: isOpen ? "90%" : "100%",
                  borderTopLeftRadius: "0px",
                  borderBottomLeftRadius: "0px",
                  borderTopRightRadius: isOpen ? "12px" : "0px",
                  borderBottomRightRadius: isOpen ? "12px" : "0px",
                  justifyContent: isOpen ? "flex-start" : "center",
                  paddingLeft: isOpen ? "1.5rem" : "0px",
                  // Makes the active one look even sharper
                  transform: isActive ? "scale(1.02)" : "scale(1)",
                  fontWeight: isActive ? "700" : "400"
                })}
              >
                <Icon className="h-6 w-6 text-white" />
                {isOpen && <span className="font-medium">{label}</span>}
              </NavLink>
            ))}

          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;