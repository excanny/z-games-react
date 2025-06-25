import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Assuming you're using React Router

const Scoreboard = () => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [longLoading, setLongLoading] = useState(false);

  const avatarEmojis = {
    'bear': '🐻',
    'rabbit': '🐰',
    'cat': '🐱',
    'dog': '🐶',
    'fox': '🦊',
    'lion': '🦁',
    'tiger': '🐯',
    'panda': '🐼'
  };

  const getColorClass = (hexColor, rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    const colorMap = {
      '#8C33FF': 'text-purple-500',
      '#FF33F5': 'text-pink-500',
      '#33FF57': 'text-green-500',
      '#3357FF': 'text-blue-500',
      '#FF5733': 'text-red-500',
      '#FFFF33': 'text-yellow-500',
      '#33FFFF': 'text-cyan-500'
    };
    return colorMap[hexColor] || 'text-blue-500';
  };

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        setError(null);
        setLongLoading(false);

        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('gameid') || window.location.pathname.split('/').pop();

        if (!gameId) {
          throw new Error('No game ID provided');
        }

        const response = await axios.get(`http://localhost:5000/api/games/${gameId}/leaderboard`, {
          timeout: 10000, // 10 seconds timeout
        });

        const apiResponse = response.data;

        if (apiResponse.status !== 'success') {
          throw new Error(apiResponse.message || 'Failed to fetch game data');
        }

        const transformedData = {
          name: apiResponse.data.name,
          type: 'Game',
          round: 'Live',
          gameId: apiResponse.data.gameId,
          players: apiResponse.data.leaderboard.map(player => ({
            name: player.name,
            points: player.score,
            rank: player.rank,
            avatar: player.avatar,
            color: getColorClass(player.color, player.rank),
            hexColor: player.color
          })),
          longestStreak: apiResponse.data.longestStreak
        };

        setGameData(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();

    const timer = setTimeout(() => {
      if (loading) setLongLoading(true);
    }, 10000);  // Show loading warning after 10 seconds

    return () => clearTimeout(timer);
  }, [retryCount]);

  const getRankDisplay = (rank) => {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}.`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8 px-4 flex items-center justify-center font-inter">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-slate-600">Loading game data...</p>
          {longLoading && (
            <p className="text-red-500 mt-4">This is taking longer than expected. Check your connection or try refreshing.</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8 px-4 flex items-center justify-center font-inter">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error loading game</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => setRetryCount(prev => prev + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
          >
            Retry
          </button>
          <div>
            <Link to="/" className="text-blue-600 hover:underline">
              ⬅️ Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { name, type, round, players } = gameData;
  const highestScore = Math.max(...players.map(p => p.points));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8 px-4">
      <div className="max-w-4xl mx-auto font-inter">
        
        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-4xl font-black text-blue-600 mb-1">
            Z-GAMES <span className="text-lg text-slate-600 italic font-medium">Scoreboard</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">{name}</h1>
          <Link to="/" className="text-sm text-blue-600 hover:underline">⬅️ Back to Home</Link>
        </div>

        {/* Scoreboard Card */}
        <div className="bg-white rounded-3xl shadow-soft border border-slate-200/60 overflow-hidden">
          
          {/* Card Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">Live Rankings</h2>
            <div className="text-center text-slate-300 text-sm mt-2">Updated in real-time</div>
          </div>

          {/* Rankings */}
          <div className="p-8 space-y-4">
            {players.map(player => {
              const isTopThree = player.rank <= 3;
              return (
                <div 
                  key={player.name}
                  className={`flex items-center justify-between p-6 rounded-xl transition-all duration-300 hover:shadow-soft ${
                    isTopThree 
                      ? 'bg-gradient-to-r from-blue-50 to-slate-50 border-2 border-blue-100' 
                      : 'bg-slate-50/50 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-slate-700 w-12 text-center">
                        {getRankDisplay(player.rank)}
                      </span>
                      <span className="text-2xl">
                        {avatarEmojis[player.avatar] || '👤'}
                      </span>
                    </div>
                    <div>
                      <div className={`text-xl font-bold ${isTopThree ? 'text-slate-800' : 'text-slate-700'}`}>
                        {player.name}
                      </div>
                      {isTopThree && (
                        <div className="text-sm text-slate-500 font-medium">
                          {player.rank === 1 ? 'Champion' : player.rank === 2 ? 'Runner-up' : 'Third Place'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${isTopThree ? 'text-blue-600' : 'text-slate-600'}`}>
                      {player.points.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500">points</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
            <div className="flex justify-between items-center text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live {type}</span>
              </div>
              <div>Last updated: Just now</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-soft border border-slate-200/60 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{players.length}</div>
            <div className="text-slate-600 font-medium">Active Players</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft border border-slate-200/60 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{highestScore.toLocaleString()}</div>
            <div className="text-slate-600 font-medium">Highest Score</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft border border-slate-200/60 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{round}</div>
            <div className="text-slate-600 font-medium">Current Round</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .font-inter { font-family: 'Inter', sans-serif; }
        .shadow-soft { box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      `}</style>
    </div>
  );
};

export default Scoreboard;
