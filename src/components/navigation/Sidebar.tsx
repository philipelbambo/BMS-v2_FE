import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  // Replace 'your-image-url.jpg' with the actual path to your background image.
  // The bg-[#DC0E0E] is kept as a fallback color and is used for the overlay.
  return (
    <div
      className={`h-screen transition-all duration-300 flex flex-col relative
      ${isOpen ? "w-64" : "w-20"} bg-[#DC0E0E] rounded-r-[30px] shadow-xl
      bg-[url('/sidebar-v5.jpg')]  bg-center`} 
      // ↑ Key changes here: bg-[url(...)], bg-cover, bg-center
    >
      {/* Overlay to improve text readability */}
      <div className="absolute inset-0 rounded-r-[30px] z-0"></div>
      
      {/* Content wrapper with z-index to place it above the overlay */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-6">
          <img src="/construction.png" alt="Logo" className="h-10 w-10" />
          {isOpen && <h1 className="text-lg font-bold text-red-700">COCOLUMBER</h1>}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-4 space-y-2">
          {[
            { to: "/", label: "Dashboard", icon: LayoutDashboard },
            { to: "/inventory", label: "Inventory", icon: Package },
            { to: "/pos", label: "POS", icon: ShoppingBag },
            { to: "/report", label: "Report", icon: BarChart3 },
          ].map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-[30px] mx-3 transition-all duration-200
                ${isActive
                  ? "bg-white text-red-700 shadow-md"
                  : "text-black hover:bg-white/20"}`
              }
            >
              <Icon className="h-6 w-6" />
              {isOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;