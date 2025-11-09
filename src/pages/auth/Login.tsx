    import React, { useState } from 'react';
    import { User, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
    import { useNavigate } from 'react-router-dom';

    export default function LoginPage() {
    const navigate = useNavigate();

    // Temporary credentials
    const TEMP_USERNAME = "junivs";
    const TEMP_PASSWORD = "sajol";

    const [username, setUsername] = useState(TEMP_USERNAME); // pre-filled
    const [password, setPassword] = useState(TEMP_PASSWORD); // pre-filled
    const [showError, setShowError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        if (username === TEMP_USERNAME && password === TEMP_PASSWORD) {
        setShowError(false);

        // Set authToken for ProtectedRoute
        localStorage.setItem("authToken", "temporary_token_123");

        // Redirect to dashboard
        navigate("/dashboard");
        } else {
        setShowError(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-white flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row min-h-[600px]">

            {/* Left Side Image */}
            <div
                className="w-full md:w-1/2 bg-cover bg-center flex items-center justify-center"
                style={{
                backgroundImage:
                    'url("https://img.freepik.com/premium-vector/two-male-workers-hardware-store-with-tools-paint-supplies-smiling-young-employee-assisting_169479-4012.jpg")',
                }}
            ></div>

            {/* Right Side - Neumorphism Card */}
            <div
                className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center"
                style={{
                background: "#ffffff",
                boxShadow:
                    "8px 8px 16px rgba(0,0,0,0.15), -8px -8px 16px rgba(255,255,255,1)",
                }}
            >
                <div className="w-full max-w-md">

                {/* Logo */}
                <div className="flex items-center justify-center mb-6">
                    <img
                    src="/construction.png"
                    alt="Logo"
                    className="w-20 h-20 mr-3 object-contain"
                    />
                </div>

                {/* Error */}
                {showError && (
                    <div className="text-center mb-4">
                    <p className="font-semibold" style={{ color: "#DC0E0E" }}>
                        Wrong Username or Password!
                    </p>
                    </div>
                )}

                {/* Welcome */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold" style={{ color: "#DC0E0E" }}>
                    WELCOME BACK
                    </h1>
                    <p className="text-gray-500">Give your best report today!</p>
                </div>

                {/* Form */}
                <div className="space-y-6">

                    {/* Username */}
                    <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5" style={{ color: "#DC0E0E" }} />
                    </div>
                    <input
                        type="text"
                        placeholder="Username / Email"
                        value={username}
                        onChange={(e) => {
                        setUsername(e.target.value);
                        if (e.target.value) setShowError(false);
                        }}
                        className="w-full pl-12 pr-12 py-4 rounded-full bg-white outline-none border border-gray-200 text-gray-800 placeholder-gray-400"
                        style={{
                        boxShadow:
                            "inset 6px 6px 12px rgba(0,0,0,0.10), inset -6px -6px 12px rgba(255,255,255,1)",
                        }}
                    />
                    </div>

                    {/* Password */}
                    <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5" style={{ color: "#DC0E0E" }} />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 rounded-full bg-white outline-none border border-gray-200 text-gray-800 placeholder-gray-400"
                        style={{
                        boxShadow:
                            "inset 6px 6px 12px rgba(0,0,0,0.10), inset -6px -6px 12px rgba(255,255,255,1)",
                        }}
                    />
                    {/* Show/Hide Icon */}
                    <div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                        <EyeOff className="w-5 h-5" style={{ color: "#DC0E0E" }} />
                        ) : (
                        <Eye className="w-5 h-5" style={{ color: "#DC0E0E" }} />
                        )}
                    </div>
                    </div>

                    {/* Login Button */}
                    <button
                    onClick={handleLogin}
                    className="w-full py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                    style={{
                        background: "#ffffff",
                        color: "#DC0E0E",
                        boxShadow:
                        "8px 8px 16px rgba(0,0,0,0.15), -8px -8px 16px rgba(255,255,255,1)",
                    }}
                    >
                    <LogIn className="w-5 h-5" style={{ color: "#DC0E0E" }} />
                    <span>Login</span>
                    </button>
                </div>

                {/* Forgot Password */}
                <div className="mt-6 text-center">
                    <a
                    href="#"
                    className="text-sm hover:underline"
                    style={{ color: "#DC0E0E" }}
                    >
                    Forgot Password?
                    </a>
                </div>

                </div>
            </div>

            </div>
        </div>
        </div>
    );
    }
