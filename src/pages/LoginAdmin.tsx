import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('user'); // pre-fill temp username
  const [password, setPassword] = useState('123456'); // pre-fill temp password
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = () => {
    const tempUsername = 'Louigie';
    const tempPassword = '12345';

    if (username === tempUsername && password === tempPassword) {
      setLoading(true);
      toast.success('Login successful! Redirecting Orayytttttt...');
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 1500);
    } else {
      toast.error('Invalid username or password');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: '#050E3C' }}
    >
      {/* ⭐ Toast at top CENTER */}
      <Toaster
        position="top-center"
        gutter={12}
        reverseOrder={false}
        toastOptions={{
          style: {
            marginTop: '40px',
          },
        }}
      />

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(./Image/Apartment.jpg)',
          opacity: 0.15,
        }}
      ></div>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: '#050E3C', opacity: 0.85 }}
      ></div>

      <div className="relative w-full max-w-5xl flex shadow-2xl rounded-3xl overflow-hidden">
        {/* Left side */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="./Image/Vector-A.jpg"
            alt="Left Side"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(5,14,60,0.5)' }}
          ></div>
          <svg
            className="absolute right-0 top-0 h-full w-32"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M100,0 Q50,50 100,100 L100,0 Z" fill="white" />
          </svg>
        </div>

        {/* Right side */}
        <div className="w-full lg:w-1/2 relative bg-white">
          <div className="p-8 sm:p-12 lg:p-16 h-full flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome</h1>
              <p className="text-gray-500 mb-8">
                Log in to your account to continue
              </p>

              <div className="space-y-5">
                {/* Username */}
                <div className="relative">
                  <div className="flex items-center mb-2">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600 font-medium">Username</span>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <div className="flex items-center mb-2">
                    <Lock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600 font-medium">Password</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••"
                      className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex justify-end items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-gray-600">
                    Remember me
                  </label>
                </div>

                {/* Login Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full flex items-center justify-center text-white py-3 rounded-full font-semibold transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl ${
                    loading ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  style={{ backgroundColor: '#050E3C' }}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Log In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-12 w-12 text-white mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
              ></path>
            </svg>
            <span className="text-white text-lg font-medium">
              Logging in...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
