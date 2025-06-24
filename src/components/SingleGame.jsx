// src/pages/SingleGame.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";

const SingleGame = () => {
  const { gameId } = useParams();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [longestStreak, setLongestStreak] = useState(null);
  const [currentGame, setCurrentGame] = useState({
    name: 'Loading...',
    gameCode: '',
    icon: '🎮'
  });
  const [loading, setLoading] = useState(true);
  const [showUpdateScore, setShowUpdateScore] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [newScore, setNewScore] = useState('');
  const [showControls, setShowControls] = useState(false);

  const getGameDetails = async (gameId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/games/${gameId}`);
      console.log('Game details:', response.data.data);
      setCurrentGame(response.data.data);
    } catch (err) {
      console.error('Error fetching game details:', err);
      // Fallback game data
      setCurrentGame({
        name: `Game ${gameId}`,
        gameCode: gameId,
        icon: '🎮'
      });
    }
  };

  const getLeaderboardData = async (gameId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/games/${gameId}/leaderboard`);
      setLeaderboardData(response.data.data.leaderboard);
      setLongestStreak(response.data.data.longestStreak);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      // Set fallback data for development
      setLeaderboardData([
        { name: 'Alice', score: 600, streak: 5, rank: 1 },
        { name: 'Bob', score: 100, streak: 0, rank: 2 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScore = (player, event) => {
    event.preventDefault();
    const scoreInput = event.target.querySelector('input[type="number"]');
    const scoreValue = scoreInput.value;
    
    if (!scoreValue) {
      alert('Please enter a score');
      return;
    }

    setSelectedPlayer(player);
    setNewScore(scoreValue);
    submitScoreUpdate(player, scoreValue);
    scoreInput.value = ''; // Clear the input
  };

  const submitScoreUpdate = async (player, score) => {
    debugger
    try {
      const response = await axios.patch(`http://localhost:5000/api/games/${gameId}/participants/score`, {
        name: player.name,
        scoreDelta: parseInt(score)
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.status === 'success') {
        await getLeaderboardData(gameId);
        setShowUpdateScore(false);
        setSelectedPlayer(null);
        setNewScore('');
      }
    } catch (err) {
      console.error('Error updating score:', err);
      alert('Failed to update score. Please try again.');
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankClass = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 border-2 border-yellow-400';
      case 2: return 'bg-gray-100 border-2 border-gray-400';
      case 3: return 'bg-orange-100 border-2 border-orange-400';
      default: return 'bg-blue-100';
    }
  };

  // Fetch leaderboard data when selected game changes
  useEffect(() => {
    const initializeData = async () => {
      await getLeaderboardData(gameId);
      await getGameDetails(gameId);
    };
    
    initializeData();
  }, [gameId]);

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-blue-500 to-blue-700 min-h-screen text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-700 min-h-screen text-white">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="bg-blue-600 rounded-2xl p-6 shadow-xl mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                {currentGame.icon} <span>{currentGame.name}</span>
              </h1>
              <p className="mt-2 text-sm text-blue-100">
                Game Code:  
                <span className="inline-block bg-blue-800 text-yellow-300 font-mono px-3 py-1 rounded-md shadow-sm ml-2">
                  {currentGame.gameCode}
                </span>
              </p>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-500 rounded-xl p-6 shadow text-center">
              <div className="text-3xl font-bold">{leaderboardData.length}</div>
              <div className="text-sm text-blue-100">Participants</div>
            </div>
            <div className="bg-blue-500 rounded-xl p-6 shadow text-center">
              <div className="text-3xl font-bold">
                {leaderboardData.length > 0 ? Math.max(...leaderboardData.map(p => p.score)) : 0}
              </div>
              <div className="text-sm text-blue-100">Highest Score</div>
            </div>
            <div className="bg-blue-500 rounded-xl p-6 shadow text-center">
              <div className="text-3xl font-bold">{leaderboardData.length}</div>
              <div className="text-sm text-blue-100">Active Players</div>
            </div>
          </div>
        </div>

        {/* Participants with Score Update and Streak King Highlight */}
        <div className="bg-white text-gray-800 rounded-xl p-6 shadow mb-8">
          {/* Hottest Streak Champion */}
          {longestStreak && (
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6 shadow-xl mb-8 border-l-4 border-yellow-400">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🔥</div>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight mb-1 text-yellow-300">Hottest Streak Champion</h2>
                  <p className="text-lg font-medium text-gray-200">
                    {longestStreak.playerName} is on fire with a {longestStreak.longestStreak} win streak!
                  </p>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4">Overall Rankings</h2>
          <ul className="space-y-4">
            {leaderboardData.map((player, index) => (
              <li key={player.name} className={`p-4 rounded-lg ${getRankClass(player.rank || index + 1)}`}>
                <div className="flex justify-between items-center mb-2">
              
        
                  <div className="flex items-center gap-3 font-medium">
                    <span className="bg-gray-300 text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full">
                      {getRankIcon(player.rank || index + 1)} {player.rank || index + 1}
                      {player.rank === 1 ? 'st' : player.rank === 2 ? 'nd' : player.rank === 3 ? 'rd' : 'th'}
                    </span>
                    <span className="flex items-center gap-2">
                      {player.name} 
                      {player.name.startsWith('A') ? '👩' : '🧑'}
                      {player.rank === 1 && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full shadow-lg font-extrabold text-sm animate-pulse">
                          <span className="text-2xl drop-shadow-lg leading-none" style={{filter: 'brightness(1.5) contrast(1.2)', lineHeight: '1'}}>👑</span> 
                          <span className="leading-none">STREAK KING</span>
                        </span>
                      )}
                    </span>
                    {player.streak > 0 && (
                      <span className="text-xs bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded-md">
                        Streak: {player.streak} Wins 🔥
                      </span>
                    )}
                  </div>
                  <span className="text-sm bg-yellow-200 text-yellow-900 font-semibold px-3 py-1 rounded-full shadow-sm">
                    Score: {player.score}
                  </span>
                </div>
                <form className="flex gap-2 items-center" onSubmit={(e) => handleUpdateScore(player, e)}>
                  <input 
                    type="number" 
                    className="w-32 border border-gray-300 rounded-md p-2" 
                    placeholder="Score" 
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Update
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>

        {/* Toggle Controls */}
        <div className="mt-6">
          <button 
            onClick={toggleControls} 
            className="text-sm text-white underline hover:text-blue-200"
          >
            ⚙️ More Options
          </button>
          {showControls && (
            <div className="mt-4">
              <div className="flex gap-4">
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-xl shadow">
                  ➕ Add New Player
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-xl shadow">
                  🗑️ Delete Game
                </button>
              </div>
            </div>
          )}
        </div>


        <footer className="mt-6 text-center text-sm text-white">
          <p>&copy; 2025 Z Games. All rights reserved.</p>
        </footer>
      </div>

      
    </div>
  );
};

export default SingleGame;