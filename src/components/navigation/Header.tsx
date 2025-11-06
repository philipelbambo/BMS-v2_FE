import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  
  return (
    <header className="bg-white border-b border-transparent py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="text-black hover:text-gray-700 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700 focus:outline-none relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="relative">
          <button 
            className="flex items-center focus:outline-none"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-black">User</p>
              <p className="text-xs text-black">Admin</p>
            </div>
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
              <Link 
                to="/settings" 
                className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
              >
                Settings
              </Link>
              <Link 
                to="/login" 
                className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
