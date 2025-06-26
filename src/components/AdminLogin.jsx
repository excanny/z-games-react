import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosClient"; 

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        console.log("Form data being sent:", formData); // Debug log

        try {
            const response = await api.post("/auth/login", formData);
            console.log("Login successful:", response.data);

            // Example: Save token or redirect
            // localStorage.setItem("token", response.data.token);
            navigate("/admin-dashboard");

        } catch (err) {
            console.error("Login error:", err);
            console.error("Error response:", err.response?.data); // Additional debug info
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br p-4">
            <div className="w-full max-w-[700px] min-w-[500px] bg-white rounded-2xl shadow-xl p-8 border border-blue-200 mx-auto animate-fadeIn">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-700">Z Games Admin</h1>
                    <p className="text-sm text-blue-400 mt-1">Log in to access the dashboard</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md animate-pulse">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-blue-700">Email</label>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className={`
                                w-full px-4 py-3 border rounded-md transition-all duration-200
                                ${loading 
                                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                                    : 'border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                }
                            `}
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1 text-blue-700">Password</label>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className={`
                                w-full px-4 py-3 border rounded-md transition-all duration-200
                                ${loading 
                                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                                    : 'border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                }
                            `}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-blue-500">
                        <label className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                className="accent-blue-600" 
                                disabled={loading} 
                            />
                            Remember me
                        </label>
                        <button type="button" className="hover:underline text-blue-600 transition-colors">
                            Forgot password?
                        </button>
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`
                            group w-full font-semibold py-3 px-6 rounded-md transition-all duration-300 transform
                            ${loading 
                                ? 'bg-blue-400 cursor-not-allowed scale-95 shadow-inner' 
                                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                            }
                            text-white relative overflow-hidden
                        `}
                    >
                        <div className="flex items-center justify-center gap-3 relative z-10">
                            {loading ? (
                                <>
                                    {/* Multi-layer spinner */}
                                    <div className="relative">
                                        <div className="w-5 h-5 border-2 border-white/30 rounded-full"></div>
                                        <div className="absolute top-0 left-0 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                    <span className="animate-pulse">Signing In...</span>
                                    {/* Pulsing dots */}
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <svg 
                                        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </div>
                        
                        {/* Animated background effects */}
                        {loading && (
                            <>
                                {/* Shimmer effect */}
                                <div 
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    style={{
                                        animation: 'shimmer 1.5s infinite',
                                        transform: 'translateX(-100%)'
                                    }}
                                ></div>
                                
                                {/* Progress bar effect */}
                                <div className="absolute bottom-0 left-0 h-1 bg-white/40 transition-all duration-2000 ease-out"
                                     style={{width: '100%'}}></div>
                            </>
                        )}
                        
                        {/* Ripple effect on click */}
                        {!loading && (
                            <div className="absolute inset-0 bg-white/10 scale-0 group-active:scale-100 transition-transform duration-200 rounded-md"></div>
                        )}
                    </button>
                </form>
                   
            </div>

            <footer className="footer mt-6 text-center text-sm text-blue-400">
                    <p>&copy; 2025 Z Games. . All rights reserved.</p>
            </footer>
            
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;