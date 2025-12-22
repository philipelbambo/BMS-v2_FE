import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TenantSidebar from '../components/navigation/TenantSidebar';
import Header from '../components/navigation/Header';
import { useTheme } from '../contexts/ThemeContext';

const TenantLayout: React.FC = () => {
  const { darkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <TenantSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 ${
            darkMode ? 'bg-gray-900 text-white' : 'bg-white text-[#001F3D]'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TenantLayout;