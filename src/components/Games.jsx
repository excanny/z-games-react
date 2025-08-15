import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import axiosClient from '../utils/axiosClient'; 

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch games from API
  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get('/games');
      const gamesData = response.data.data || response.data || [];
      setGames(gamesData);
    } catch (error) {
      console.error('Error fetching games:', error);
      setError('Failed to load games. Please try again.');
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch games on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  // Select game function (you might want to implement this based on your needs)
  const selectGame = (game) => {
    console.log('Selected game:', game);
    // Add your game selection logic here
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center gap-4">
              🎮 Games
            </h1>
          </div>
          <div className="flex items-center justify-center py-32">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-200 rounded-full animate-spin animate-reverse opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center gap-4">
              🎮 Games
            </h1>
          </div>
          <div className="flex items-center justify-center py-32">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={fetchGames}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center gap-4">
              🎮 Games
            </h1>
            <p className="text-blue-100 text-xl">Discover and play amazing games</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="group px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 rounded-2xl transition-all duration-300 flex items-center gap-3 hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium"> Home</span>
            </Link>
            <button 
              onClick={fetchGames}
              className="group px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 rounded-2xl transition-all duration-300 flex items-center gap-3 hover:shadow-lg"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-medium">Refresh</span>
            </button>
          </div>
        </div>
        
        {games && games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <div 
                key={game.id}
                className="group bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-3xl"
              >
                <div className="p-8">
                  {/* Game Header */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      🎯 {game.name || `Game ${index + 1}`}
                    </h2>
                    
                    {/* Game Details Grid */}
                    <div className="space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                          {game.description || 'A fun and engaging game experience awaiting you.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Launch Button */}
                  <Link to={`/game/${game.id}`} className="block">
                    <button 
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:from-blue-400 hover:to-blue-500 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 active:scale-95"
                      onClick={() => selectGame(game)}
                    >
                      <span className="flex items-center justify-center gap-3 text-lg">
                        🚀 View Game Details
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-32">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center shadow-lg">
                <span className="text-4xl">🎮</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No games available</h3>
              <p className="text-gray-600 text-lg">Check back later for new games to discover</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;