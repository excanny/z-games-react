import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';  
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:5000');

const Scoreboard = () => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [longLoading, setLongLoading] = useState(false);

  const { gameId } = useParams();

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

        const response = await axiosClient.get(`/games/${gameId}/leaderboard`, {
          timeout: 10000,
        });

        const apiResponse = response.data;

        if (apiResponse.status !== 'success') {
          throw new Error(apiResponse.message || 'Failed to fetch game data');
        }

        const transformedData = {
          name: apiResponse.data.name,
          type: 'Game',
          round: 'Live',
          lastGamesUpdateAt: new Date(apiResponse.data.lastGamesUpdateAt).toLocaleString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
}),
          players: apiResponse.data.leaderboard.map(player => ({
            name: player.name,
            points: player.score,
            rank: player.rank,
            avatar: player.avatar,
            color: getColorClass(player.color, player.rank)
          }))
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
    }, 10000);

    // ✅ Listen for real-time leaderboard updates
    socket.on('leaderboardUpdated', (data) => {
      console.log('Leaderboard updated for game:', data.gameId);
      // Optional: Check if the update is for this gameId
      if (data.gameId === gameId) {
        fetchGameData();
      }
    });

    // ✅ Cleanup listener on unmount
    return () => {
      clearTimeout(timer);
      socket.off('leaderboardUpdated');
    };
  }, [gameId]);

  const getRankDisplay = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}.`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading game data...</p>
          {longLoading && (
            <p className="text-red-500 mt-2">This is taking longer than expected. Please check your connection.</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Error loading game</h2>
          <p className="mb-4">{error}</p>
          <div className="mt-4">
            <Link to="/" className="text-blue-600 hover:underline">
              ⬅️ Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { name, type, round, players, lastGamesUpdateAt } = gameData;

  console.log('Game data:', gameData);
  const highestScore = Math.max(...players.map(p => p.points));

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="text-4xl text-blue-600 font-extrabold">
            <span>Z</span>
            <span className="text-blue-600">-GAMES</span>
          </div>
          <div className="text-xl font-semibold text-gray-700">Scoreboard</div>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-1">{name}</h1>
          <div className="text-sm">
            <Link to="/" className="text-blue-600 hover:underline">⬅️ Back to Home</Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-soft border overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">Live Rankings</h2>
          </div>

          <div className="p-8 space-y-4">
            {players.map(player => {
              const isTopThree = player.rank <= 3;
              return (
                <div
                  key={player.name}
                  className={`flex items-center justify-between p-6 rounded-xl ${
                    isTopThree
                      ? 'bg-gradient-to-r from-blue-50 to-slate-50 border-2 border-blue-100'
                      : 'bg-slate-50 border'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold w-12 text-center">
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

          <div className="bg-slate-50 px-8 py-6 border-t">
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Live {type}</span>
              <span>Last updated: {lastGamesUpdateAt}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-soft text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{players.length}</div>
            <div className="text-slate-600">Active Players</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{highestScore.toLocaleString()}</div>
            <div className="text-slate-600">Highest Score</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{round}</div>
            <div className="text-slate-600">Current Round</div>
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
