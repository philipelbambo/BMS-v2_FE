import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <img 
            src="/block.png" 
            alt="Logo" 
            className="h-20 w-20 object-contain" 
          />
        </div>
        <h1 className="text-6xl font-bold text-black mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-black mb-6">Page Not Found</h2>
        <p className="text-black max-w-md mx-auto">
          Sorry, the page you were looking for doesn't exist or has been moved.
        </p>
        
        <Link 
        to="/" 
        className="inline-flex items-center bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
      >
        <Home size={18} className="mr-2" />
        Back to Home
      </Link>

      </div>
    </div>
  );
};

export default NotFound;