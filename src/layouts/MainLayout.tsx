import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/NavigationMenu/Sidebar';
import Header from '../components/NavigationMenu/Header';
import { useTheme } from '../contexts/ThemeContext';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { darkMode } = useTheme();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;