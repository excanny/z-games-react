import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from "../utils/axiosClient"; 
import ZGamesLogo from '../assets/Z Games logo with illustration.png';

const Home = () => {
    const [gameCode, setGameCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleCodeSubmit = async () => {
        // Prevent submission if already loading or if game code is empty
        if (isLoading || !gameCode.trim()) {
            if (!gameCode.trim()) {
                setErrorMessage('Please enter a game code.');
            }
            return;
        }

        setIsLoading(true);
        
        try {
            setErrorMessage(''); // Clear any previous errors
            
            // Make API call to validate the game code
            const response = await axiosClient.get(
                `/games/code/${gameCode.trim().toUpperCase()}`,
                { timeout: 10000 } // 10 second timeout
            );
            
            // If the API call is successful, navigate to scoreboard
            if (response.status === 200) {
                navigate("/scoreboard/" + response.data.data._id, { 
                    state: { gameCode: gameCode.trim().toUpperCase() } 
                });
            }
            
        } catch (error) {
            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                if (error.response.status === 404) {
                    setErrorMessage('Invalid game code. Please try again or contact the games master.');
                } else if (error.response.status === 400) {
                    setErrorMessage('Bad request. Please check your game code.');
                } else {
                    setErrorMessage('Server error. Please try again later.');
                }
            } else if (error.request) {
                // Network error
                setErrorMessage('Network error. Please check your connection.');
            } else if (error.code === 'ECONNABORTED') {
                // Timeout error
                setErrorMessage('Request timed out. Please try again.');
            } else {
                // Other error
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
            
            // Clear the game code input only on error
            setGameCode('');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCodeSubmit();
        }
    };

    // Handle input change with validation
    const handleInputChange = (e) => {
        const value = e.target.value.toUpperCase();
        // Only allow alphanumeric characters
        const sanitizedValue = value.replace(/[^A-Z0-9]/g, '');
        setGameCode(sanitizedValue);
        
        // Clear error message when user starts typing
        if (errorMessage) {
            setErrorMessage('');
        }
    };
    
    // Main home page
    return (
        <>
            <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex">
                    {/* Left Image Section */}
                    <div className="flex-1 bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center p-8 relative">
                        <img
                            src={ZGamesLogo}
                            alt="Z Games Logo"
                            className="max-w-full max-h-full object-contain"
                        />
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-900 rotate-45 translate-x-1/2 translate-y-1/2" />
                    </div>
    
                    {/* Right Content Section */}
                    <div className="flex-1 bg-slate-50 relative p-10 flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-800 rounded-bl-full" />
    
                        <p className="text-slate-500 text-sm mb-3">Blak Comms.</p>
    
                        <h1 className="text-4xl font-extrabold text-slate-800 leading-tight mb-2">
                            Welcome to <span className="text-blue-800">Z-Games</span>
                        </h1>
    
                        <p className="text-lg italic text-slate-600 mb-6">
                            Your ultimate destination for in-door party games!
                        </p>
    
                        <div className="mb-2">
                            <label
                                htmlFor="gameCode"
                                className="block text-sm text-slate-700 font-semibold mb-2"
                            >
                                Enter Game Code:
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    id="gameCode"
                                    placeholder="ENTER GAME CODE"
                                    className={`flex-1 px-4 py-3 border rounded-l-md text-center text-base tracking-wider uppercase focus:outline-none focus:ring-2 transition-all ${
                                        errorMessage 
                                            ? 'border-red-300 focus:ring-red-300' 
                                            : 'border-slate-300 focus:ring-blue-300'
                                    }`}
                                    value={gameCode}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    disabled={isLoading}
                                    autoComplete="off"
                                />
                                <button 
                                    className={`px-6 py-3 text-white text-sm font-bold uppercase rounded-r-md transition-all ${
                                        isLoading || !gameCode.trim()
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-br from-blue-700 to-blue-500 hover:shadow-md hover:-translate-y-0.5'
                                    }`}
                                    onClick={handleCodeSubmit}
                                    disabled={isLoading || !gameCode.trim()}
                                >
                                    {isLoading ? 'Loading...' : 'Enter'}
                                </button>
                            </div>
                        </div>
    
                        {errorMessage && (
                            <div className="mb-1 p-1 bg-red-100 border border-red-300 rounded-md">
                                <p className="text-red-700 text-sm">{errorMessage}</p>
                            </div>
                        )}
    
                        <div className="mt-3">
                            <div className="bg-slate-800 text-white text-sm rounded-md px-5 py-2 shadow flex items-center justify-center">
                                <span className="font-normal">Need a game code? Contact the games master!</span>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Footer INSIDE blue background */}
                <footer className="footer mt-6 text-center text-sm text-blue-200">
                    <p>&copy; 2025 Z Games. All rights reserved.</p>
                    <p>
                        <a href="/admin-login" className="underline hover:text-white transition-colors duration-200">
                            Admin Login
                        </a>
                    </p>
                </footer>

            </div>
        </>
    );
    
    
};

export default Home;