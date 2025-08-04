import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/axiosClient";
import { setAuthToken, getAuthToken, isTokenExpired, getUserFromToken } from "../utils/jwtUtils"; 

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Check if user is already logged in
    useEffect(() => {
        const checkExistingAuth = async () => {
            const token = getAuthToken();
            if (token && !isTokenExpired(token)) {
                try {
                    // Optionally verify token is still valid with server
                    await api.get('/auth/verify');
                    // If valid, redirect to dashboard
                    const from = location.state?.from?.pathname || "/admin-dashboard";
                    navigate(from, { replace: true });
                } catch (error) {
                    // Token is invalid on server, remove it
                    setAuthToken(null);
                }
            } else if (token && isTokenExpired(token)) {
                // Token exists but is expired;
                setAuthToken(null);
            }
        };

        checkExistingAuth();
    }, [navigate, location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear error when user starts typing
        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", formData);
        
            // Extract JWT token from response
            const token = response.data.token || response.data.data?.token || response.data.accessToken;
            
            if (token) {
                // Validate JWT structure
                const userInfo = getUserFromToken(token);
                if (userInfo) {
               
                    // Save token using utility function
                    setAuthToken(token);
                    
                    // Redirect to the page they were trying to access, or dashboard
                    const from = location.state?.from?.pathname || "/admin-dashboard";
                    navigate(from, { replace: true });
                } else {
                    setError("Invalid token format received. Please try again.");
                }
            } else {
                setError("Login successful but no token received. Please try again.");
            }

        } catch (err) {
            console.error("Login error:", err);
            console.error("Error response:", err.response?.data); // Additional debug info
            
            // Handle different error response structures
            let errorMessage = "Login failed. Please check your credentials.";
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToHome = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex flex-col items-center justify-center px-2 sm:px-4 py-4 sm:py-8">
            {/* Back to Home Button */}
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg mb-4">
                <button
                    onClick={handleBackToHome}
                    className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors duration-200 text-sm"
                    disabled={loading}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </button>
            </div>

            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-blue-700 to-blue-500 px-4 sm:px-6 md:px-8 py-6 sm:py-8 relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-blue-900 rounded-bl-full opacity-30" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-blue-900 rotate-45 translate-x-1/2 translate-y-1/2 opacity-20" />
                    
                    <div className="text-center relative z-10">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
                            <span className="text-blue-100">Z-Games</span> Admin
                        </h1>
                        <p className="text-blue-100 text-sm sm:text-base">
                            Access your admin dashboard
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="bg-slate-50 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
                    <p className="text-slate-500 text-xs sm:text-sm mb-4">Blak Comms.</p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                placeholder="Enter your admin email"
                                className={`
                                    w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-md text-sm sm:text-base transition-all duration-200
                                    ${loading 
                                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                                        : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-400'
                                    }
                                `}
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                required
                                autoComplete="email"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">
                                Password
                            </label>
                            <input 
                                type="password" 
                                placeholder="Enter your password"
                                className={`
                                    w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-md text-sm sm:text-base transition-all duration-200
                                    ${loading 
                                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                                        : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-400'
                                    }
                                `}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-sm">
                            <label className="flex items-center gap-2 text-slate-600">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" 
                                    disabled={loading} 
                                />
                                Remember me
                            </label>
                            <button 
                                type="button" 
                                className="text-blue-600 hover:text-blue-700 hover:underline transition-colors text-left sm:text-right"
                                disabled={loading}
                            >
                                Forgot password?
                            </button>
                        </div>
                        
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`
                                w-full font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-all duration-200 text-sm sm:text-base
                                ${loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-br from-blue-700 to-blue-500 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                                }
                                text-white relative overflow-hidden
                            `}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing In...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Sign In to Dashboard</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    </form>

                </div>
            </div>

            {/* Footer */}
            <footer className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-blue-200 px-4">
                <p>&copy; 2025 Z Games. All rights reserved.</p>
                <p className="mt-1">
                    <span className="text-blue-300">Admin Portal</span> • Secure Access
                </p>
            </footer>
        </div>
    );
};

export default AdminLogin;