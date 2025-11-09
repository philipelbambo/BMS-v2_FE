import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div 
      className={`bg-white border-r border-transparent transition-all duration-300 flex flex-col ${isOpen ? 'w-60' : 'w-20'}`}
    >
      {/* Header with your custom logo */}
      <div className="p-4 border-b border-red-400 flex items-center justify-center bg-white ">
        <img 
          src="/construction.png" 
          alt="Logo" 
          className="h-10 w-10 object-contain"
        />
        {isOpen && (
          <div className="ml-2">
            <h1 className="text-xl font-bold text-red-900">COCOLUMBER</h1>
          </div>
        )}
      </div>
      
      {/* Sidebar background section */}
      <div 
        className="flex-1 overflow-y-auto py-4 rounded-t-lg"
        style={{
          backgroundImage: 'url("/sidebar-v5.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <nav className="px-3 space-y-1">
          {/* Dashboard */}
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center px-2 py-2 text-lg font-medium rounded-md w-[80%] ${
                isActive 
                  ? 'text-black' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`
            }
            end
          >
            <LayoutDashboard className="mr-3 h-5 w-5 text-red-700" />
            {isOpen && <span>Dashboard</span>}
          </NavLink>

          {/* Inventory */}
          <NavLink 
            to="/inventory" 
            className={({ isActive }) => 
              `flex items-center px-2 py-2 text-lg font-medium rounded-md w-[80%] ${
                isActive 
                  ? 'text-black' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`
            }
          >
            <Package className="mr-3 h-5 w-5 text-red-700" />
            {isOpen && <span>Inventory</span>}
          </NavLink>

          {/* POS */}
          <NavLink 
            to="/pos" 
            className={({ isActive }) => 
              `flex items-center px-2 py-2 text-lg font-medium rounded-md w-[80%] ${
                isActive 
                  ? 'text-black' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`
            }
          >
            <ShoppingBag className="mr-3 h-5 w-5 text-red-700" />
            {isOpen && <span>POS</span>}
          </NavLink>

          {/* Report */}
          <NavLink 
            to="/report" 
            className={({ isActive }) => 
              `flex items-center px-2 py-2 text-lg font-medium rounded-md w-[80%] ${
                isActive 
                  ? 'text-black' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`
            }
          >
            <BarChart3 className="mr-3 h-5 w-5 text-red-700" />
            {isOpen && <span>Report</span>}
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
