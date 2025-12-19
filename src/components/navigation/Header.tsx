import React from 'react';
import { Bell, User, LogOut, Moon, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

/* ===============================
   Thin Fries Toggle Icon
================================ */
const FriesToggleIcon: React.FC<{
  size?: number;
  color?: string;
  isOpen?: boolean;
}> = ({ size = 26, color = '#001F3D', isOpen = false }) =>
  isOpen ? (
    // X icon (nipis)
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ) : (
    // Thin fries icon
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="2" rx="1" fill={color} />
      <rect x="3" y="11" width="14" height="2" rx="1" fill={color} />
      <rect x="3" y="18" width="10" height="2" rx="1" fill={color} />
    </svg>
  );

/* ===============================
   Header Component
================================ */
const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
    toggleSidebar();
  };

  const handleLogout = () => setShowConfirm(true);

  const confirmYes = () => {
    setShowConfirm(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate('/login-admin');
    }, 1500);
  };

  return (
    <>
      {/* LOADING */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#001F3D] border-t-transparent" />
        </div>
      )}

      {/* LOGOUT CONFIRM */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[90%] max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-800">
              Are you sure you want to log out?
            </h2>

            <div className="mt-5 flex justify-center gap-4">
              <button
                onClick={confirmYes}
                className="rounded-lg bg-[#001F3D] px-5 py-2 text-white hover:bg-[#003566]"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg bg-gray-300 px-5 py-2 hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header
        className={`flex items-center justify-between border-b px-6 py-4 ${
          darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* LEFT */}
        <button onClick={handleToggleSidebar} className="focus:outline-none">
          <FriesToggleIcon 
            isOpen={isSidebarOpen} 
            color={darkMode ? '#FFFFFF' : '#001F3D'} 
          />
        </button>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* DARK MODE */}
          <button
            onClick={toggleDarkMode}
            className={`rounded-full p-2 ${
              darkMode
                ? 'text-yellow-400 hover:bg-gray-700'
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* NOTIFICATION */}
          <button className="relative text-gray-500 hover:text-gray-700">
            <Bell size={20} />
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* USER */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#001F3D] text-white">
                <User size={18} />
              </div>
              <div className="text-left">
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                  User
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-black'}`}>
                  Admin
                </p>
              </div>
            </button>

            {showUserMenu && (
              <div
                className={`absolute right-0 mt-2 w-44 rounded-md py-1 shadow-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <Link
                  to="/settings"
                  className={`block px-4 py-2 text-sm ${
                    darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className={`flex w-full items-center px-4 py-2 text-sm ${
                    darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;