import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, CheckCircle, XCircle } from 'lucide-react';

// Toast Component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm ${
        type === 'success' 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}>
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600" />
        )}
        <span className="font-medium text-sm">{message}</span>
        <button 
          onClick={onClose}
          className={`ml-2 ${type === 'success' ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600'} transition-colors`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleLogin = () => {
    // Check credentials
    if (username === 'admin' && password === 'admin123') {
      // Admin login - redirect to admin dashboard
      setIsLoading(true);
      setToast({ message: 'Login successful! Redirecting to Admin Dashboard...', type: 'success' });
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } else if (username === 'tenant' && password === 'tenant123') {
      // Tenant login - redirect to tenant dashboard
      setIsLoading(true);
      setToast({ message: 'Login successful! Redirecting to Tenant Portal...', type: 'success' });
      
      setTimeout(() => {
        window.location.href = '/tenant-dashboard';
      }, 1500);
    } else {
      // Failed login
      setToast({ message: 'Invalid username or password', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-[#e7e7e7] relative overflow-hidden flex items-center justify-center p-4">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes slide-down {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>



      {/* Login Card */}
      <div className="relative w-full max-w-md z-10">
        <div className="bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 md:p-10 border border-slate-100">
          {/* Logo/Brand Area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#001F3D] to-[#003366] rounded-full mb-4 shadow-lg shadow-[#001F3D]/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome</h1>
            <p className="text-slate-500 text-sm">Welcome back! Please login to your account.</p>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 transition-colors ${focusedField === 'username' ? 'text-[#001F3D]' : 'text-slate-400'}`} />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001F3D] focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-[#001F3D]' : 'text-slate-400'}`} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001F3D] focus:border-transparent transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#001F3D] bg-white border-slate-300 rounded focus:ring-[#001F3D] focus:ring-2"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-700 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-[#001F3D] text-white py-3 rounded-lg font-semibold hover:bg-[#003366] active:scale-[0.98] transition-all shadow-lg shadow-[#001F3D]/20 hover:shadow-xl hover:shadow-[#001F3D]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#001F3D] disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>
        </div>


      </div>
    </div>
  );
}