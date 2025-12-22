import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from 'lucide-react';

// Toast Component
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm ${
          type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600" />
        )}
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      // Set authentication token and user data for admin
      localStorage.setItem('auth_token', 'admin_token_123');
      localStorage.setItem('user', JSON.stringify({ role: 'admin', username: 'admin' }));
      
      setIsLoading(true);
      setToast({
        message: 'Login successful! Redirecting to Admin Dashboard...',
        type: 'success',
      });
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 1500);
    } else if (username === 'tenant' && password === 'tenant123') {
      // Set authentication token and user data for tenant
      localStorage.setItem('auth_token', 'tenant_token_123');
      localStorage.setItem('user', JSON.stringify({ role: 'tenant', username: 'tenant' }));
      
      setIsLoading(true);
      setToast({
        message: 'Login successful! Redirecting to Tenant Portal...',
        type: 'success',
      });
      setTimeout(() => {
        window.location.href = '/tenant/dashboard';
      }, 1500);
    } else {
      setToast({ message: 'Invalid username or password', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-[#e7e7e7] flex items-center justify-center p-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @keyframes slide-down {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="relative bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 md:p-10 border border-slate-100">

          {/* 🔙 Back Arrow (ONLY ADDITION) */}
          <button
            onClick={() => window.history.back()}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>

          {/* Logo / Brand Area (UNCHANGED) */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#001F3D] to-[#003366] rounded-full mb-4 shadow-lg shadow-[#001F3D]/20">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome
            </h1>
            <p className="text-slate-500 text-sm">
              Welcome back! Please login to your account.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    focusedField === 'username'
                      ? 'text-[#001F3D]'
                      : 'text-slate-400'
                  }`}
                />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#001F3D]"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    focusedField === 'password'
                      ? 'text-[#001F3D]'
                      : 'text-slate-400'
                  }`}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#001F3D]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#001F3D]"
              />
              <span className="ml-2 text-sm text-slate-700">
                Remember me
              </span>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-[#001F3D] text-white py-3 rounded-lg font-semibold hover:bg-[#003366] transition"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
