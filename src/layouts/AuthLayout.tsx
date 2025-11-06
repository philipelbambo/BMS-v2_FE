import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/login" className="flex items-center">
            <img 
              src="/block.png" 
              alt="Logo" 
              className="h-10 w-10 object-contain" 
            />
            <span className="ml-2 text-2xl font-semibold text-black">Cocolumber</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;