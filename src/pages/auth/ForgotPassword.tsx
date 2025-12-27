    // ForgotPasswordPage.tsx
    import { useState, useRef, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';

    const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const emailInputRef = useRef<HTMLInputElement>(null);

    // Focus email input on mount
    useEffect(() => {
        emailInputRef.current?.focus();
    }, []);

    // Handle countdown redirect
    useEffect(() => {
        let timer: number; // ✅ Fixed: use 'number' instead of 'NodeJS.Timeout'
        if (success && countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (success && countdown === 0) {
        navigate('/login-tenant');
        }
        return () => clearTimeout(timer);
    }, [success, countdown, navigate]);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
        }

        setIsLoading(true);
        
        try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/forgot-password`, {
            email,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        setSuccess(true);
        } catch (err: any) {
        if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } else {
            setError('Network error. Please try again.');
        }
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            <button
            onClick={() => navigate('/login-tenant')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Back to login"
            >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to login
            </button>

            <div className="bg-white rounded shadow-lg p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
            </p>

            {success ? (
                <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-green-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <p className="text-green-600 font-medium mb-4">
                    Password reset link sent to your email
                </p>
                <p className="text-gray-600">
                    Redirecting to login in {countdown} seconds...
                </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                    >
                    Email address
                    </label>
                    <div className="relative">
                    <input
                        ref={emailInputRef}
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 rounded border ${
                        error 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-[#001F3D] focus:border-[#001F3D]'
                        } focus:outline-none transition-colors`}
                        placeholder="you@example.com"
                        aria-invalid={!!error}
                        aria-describedby={error ? "email-error" : undefined}
                    />
                    </div>
                    {error && (
                    <p id="email-error" className="mt-2 text-sm text-red-600" role="alert">
                        {error}
                    </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001F3D] transition-all ${
                    isLoading
                        ? 'bg-[#001F3D] opacity-75 cursor-not-allowed'
                        : 'bg-[#001F3D] hover:bg-[#00284d] active:bg-[#001428]'
                    }`}
                >
                    {isLoading ? (
                    <div className="flex items-center justify-center">
                        <svg 
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                        </svg>
                        Sending...
                    </div>
                    ) : (
                    'Send Reset Link'
                    )}
                </button>
                </form>
            )}
            </div>
        </div>
        </div>
    );
    };

    export default ForgotPasswordPage;