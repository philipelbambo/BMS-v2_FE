    import React, { useState, useEffect } from 'react';
    import { useNavigate, useLocation } from 'react-router-dom';

    interface FormData {
    email: string;
    password: string;
    }

    const Login: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<Partial<FormData> & { form?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle success message from registration
    useEffect(() => {
        if (location.state?.message && location.state.type === 'success') {
        setErrors({ form: location.state.message });
        navigate('.', { replace: true, state: {} });
        }
    }, [location.state, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof FormData]) {
        setErrors((prev) => {
            const updated = { ...prev };
            delete updated[name as keyof FormData];
            return updated;
        });
        }
    };

    // Mock login function for prototype
    const mockLogin = async (email: string, password: string) => {
        setIsSubmitting(true);

        // Simulate loading
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Only check temporary account for prototype
        if (email === 'tenant@example.com' && password === 'Temporary123') {
        localStorage.setItem('auth_token', 'mock-token');
        localStorage.setItem(
            'user',
            JSON.stringify({ id: 1, name: 'Tenant User', email, role: 'tenant' })
        );
        navigate('/tenant-dashboard', { replace: true });
        } else {
        setErrors({ form: 'Invalid email or password.' });
        }

        setIsSubmitting(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        mockLogin(formData.email, formData.password);
    };

    const handleTempAccount = () => {
        const tempData = {
        email: 'tenant@example.com',
        password: 'Temporary123',
        };
        setFormData(tempData);
        mockLogin(tempData.email, tempData.password);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8 md:p-10 space-y-6 relative">
            {/* Back Button */}
            <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute -top-2 -left-2 w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Go back"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#001F3D]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            </button>

            {/* Accent bar */}
            <div className="h-1.5 bg-[#001F3D] rounded-t-xl -mx-8 -mt-8 mb-5"></div>

            {/* Logo */}
            <div className="flex justify-center items-center space-x-3 pt-2">
            <div className="w-9 h-9 rounded-full bg-[#001F3D]"></div>
            <h1 className="text-xl font-bold text-[#001F3D]">BoardingHouse</h1>
            </div>

            <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
            </div>

            {/* Message banner */}
            {errors.form && (
            <div className="border px-4 py-3 rounded-lg text-sm bg-red-50 border-red-200 text-red-700">
                {errors.form}
            </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
                </label>
                <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition border-gray-300 focus:ring-[#001F3D]/20 focus:border-[#001F3D]`}
                placeholder="your@email.com"
                />
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
                </label>
                <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition border-gray-300 focus:ring-[#001F3D]/20 focus:border-[#001F3D]`}
                placeholder="Enter your password"
                />

                <div className="mt-2 text-right">
                <a href="/forgot-password" className="text-sm text-[#001F3D] hover:underline font-medium">
                    Forgot password?
                </a>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
                isSubmitting
                    ? 'bg-[#001F3D]/70 cursor-not-allowed'
                    : 'bg-[#001F3D] hover:bg-[#003566] active:bg-[#002a57] shadow-sm'
                }`}
            >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
            </form>

            {/* Register link */}
            <div className="text-center text-gray-600 mt-4">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-[#001F3D] hover:underline">
                Create one
            </a>
            </div>
        </div>
        </div>
    );
    };

    export default Login;