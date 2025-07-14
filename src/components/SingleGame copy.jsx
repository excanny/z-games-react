
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient'; 
import { ToastContainer, toast } from 'react-toastify';

const SingleGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [longestStreak, setLongestStreak] = useState(null);
  const [currentGame, setCurrentGame] = useState({
    name: 'Loading...',
    gameCode: '',
    icon: '🎮'
  });
  const [loading, setLoading] = useState(true);
  const [longLoading, setLongLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showControls, setShowControls] = useState(false);
  
  // Bulk operations state
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [showBulkRemove, setShowBulkRemove] = useState(false);
  const [bulkPlayers, setBulkPlayers] = useState('');
  const [selectedPlayersForRemoval, setSelectedPlayersForRemoval] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [playersToAdd, setPlayersToAdd] = useState([]);

  // Available avatars and colors
  const availableAvatars = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄'];
  const availableColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43', '#10AC84', '#EE5A24', '#0984E3', '#A29BFE', '#FD79A8', '#E17055', '#81ECEC', '#74B9FF', '#A29BFE', '#FD79A8'];

  //Notification functions
   const addedPlayersNotification = () => toast(`Successfully added players!`);
   const removedPlayersNotification = () => toast('Player(s) removed successfully!');
   const scoreUpdatedNotification = () => toast('Score updated successfully!');
   const gameDeactivatedNotification = () => toast('Game deactivated successfully!');
  const enterPlayerNamesNotification = () => toast('Please enter player name(s)');

  // Helper function to check if game has meaningful progress
  const hasGameProgress = () => {
    const maxScore = leaderboardData.length > 0 ? Math.max(...leaderboardData.map(p => p.score)) : 0;
    const hasStreaks = leaderboardData.some(p => p.streak > 0);
    return maxScore > 0 || hasStreaks;
  };

  // Helper function to check if streaks should be shown
  const shouldShowStreaks = () => {
    return longestStreak && longestStreak.longestStreak > 0 && hasGameProgress();
  };

  const getGameDetails = async (gameId) => {
    try {
      const response = await axiosClient.get(`/games/${gameId}`);
      console.log('Game details:', response.data.data);
      setCurrentGame(response.data.data);
    } catch (err) {
      console.error('Error fetching game details:', err);
      setError(err.message);
      // Fallback game data
      setCurrentGame({
        name: `Game ${gameId}`,
        gameCode: gameId,
        icon: '🎮'
      });
    }
  };

  const getLeaderboardData = async (gameId, shouldSetLoading = true) => {
    try {
      if (shouldSetLoading) {
        setLoading(true);
      }
      setError(null);
      setLongLoading(false);
      
      const response = await axiosClient.get(`/games/${gameId}/leaderboard`, {
        timeout: 10000,
      });
      setLeaderboardData(response.data.data.leaderboard);
      setLongestStreak(response.data.data.longestStreak);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message);
      // Set fallback data for development
      setLeaderboardData([
        { name: 'Alice', score: 600, streak: 5, rank: 1 },
        { name: 'Bob', score: 100, streak: 0, rank: 2 }
      ]);
    } finally {
      if (shouldSetLoading) {
        setLoading(false);
      }
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

    submitScoreUpdate(player, scoreValue);
    scoreInput.value = ''; // Clear the input
  };

  const submitScoreUpdate = async (player, score) => {
    try {
      const response = await axiosClient.patch(`/games/${gameId}/participants/score`, {
        name: player.name,
        scoreDelta: parseInt(score)
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.status === 'success') {
        scoreUpdatedNotification();
        // Don't show loading spinner for score updates
        await getLeaderboardData(gameId, false);
      }
    } catch (err) {
      console.error('Error updating score:', err);
      alert('Failed to update score. Please try again.');
    }
  };

  // Process bulk player names input
  const processBulkPlayerNames = () => {
    if (!bulkPlayers.trim()) {
      //alert('Please enter player names'); 
      enterPlayerNamesNotification();
      return;
    }

    const playerNames = bulkPlayers.split('\n').filter(name => name.trim());
    const newPlayersToAdd = playerNames.map((name, index) => ({
      id: Date.now() + index,
      name: name.trim(),
      avatar: availableAvatars[index % availableAvatars.length], // Cycle through avatars
      color: availableColors[index % availableColors.length] // Cycle through colors
    }));

    setPlayersToAdd(newPlayersToAdd);
    setBulkPlayers('');
  };

  // Update individual player details
  const updatePlayerDetails = (playerId, field, value) => {
    setPlayersToAdd(prev => 
      prev.map(player => 
        player.id === playerId ? { ...player, [field]: value } : player
      )
    );
  };

  // Remove player from the list
  const removePlayerFromList = (playerId) => {
    setPlayersToAdd(prev => prev.filter(player => player.id !== playerId));
  };

  // Bulk add players
  const handleBulkAddPlayers = async () => {
    if (playersToAdd.length === 0) {
      alert('No players to add');
      return;
    }

    const playersData = playersToAdd.map(player => ({
      name: player.name,
      avatar: player.avatar,
      color: player.color
    }));

    try {
      const response = await axiosClient.post(`/games/${gameId}/players/bulk`, {
        action: "add",
        players: playersData
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        await getLeaderboardData(gameId, false);
        setPlayersToAdd([]);
        setShowBulkAdd(false);
  
        addedPlayersNotification();
      }
    } catch (err) {
      console.error('Error adding players:', err);
      alert('Failed to add players. Please try again.');
    }
  };

  // Bulk remove players
  const handleBulkRemovePlayers = async () => {
    if (selectedPlayersForRemoval.length === 0) {
      alert('Please select players to remove');
      return;
    }

    const playersToRemove = selectedPlayersForRemoval.map(playerName => {
      const player = leaderboardData.find(p => p.name === playerName);
      return {
        name: playerName,
        avatar: player?.avatar || "default",
        color: player?.color || "#000000"
      };
    });

    try {
      const response = await axiosClient.post(`/games/${gameId}/players/bulk`, {
        action: "remove",
        players: playersToRemove
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        await getLeaderboardData(gameId, false);
        setSelectedPlayersForRemoval([]);
        setShowBulkRemove(false);
        //alert(`Successfully removed ${playersToRemove.length} players!`);
        removedPlayersNotification();
      }
    } catch (err) {
      console.error('Error removing players:', err);
      alert('Failed to remove players. Please try again.');
    }
  };

  // Delete/deactivate game
  const handleDeactivateGame = async () => {
    try {
      const response = await axiosClient.put(`/games/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        //alert('Game has been deactivated successfully!');
        gameDeactivatedNotification();
        navigate('/admin-dashboard'); 
      }
    } catch (err) {
      console.error('Error deleting game:', err);
      alert('Failed to delete game. Please try again.');
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const togglePlayerSelection = (playerName) => {
    setSelectedPlayersForRemoval(prev => 
      prev.includes(playerName) 
        ? prev.filter(name => name !== playerName)
        : [...prev, playerName]
    );
  };

  const getRankIcon = (rank) => {
    if (!hasGameProgress()) {
      return '•'; 
    }
    
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';  
      case 3: return '🥉';
      default: return ``;
    }
  };

  const getRankClass = (rank) => {
    if (!hasGameProgress()) {
      return 'bg-gray-50 border border-gray-200'; // Neutral styling when no progress
    }
    
    switch (rank) {
      case 1: return 'bg-yellow-100 border-2 border-yellow-400';
      case 2: return 'bg-gray-100 border-2 border-gray-400';
      case 3: return 'bg-orange-100 border-2 border-orange-400';
      default: return 'bg-blue-100';
    }
  };

  // Fetch leaderboard data when component mounts or gameId changes
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);
      setLongLoading(false);
      
      try {
        await Promise.all([
          getLeaderboardData(gameId, false),
          getGameDetails(gameId)
        ]);
      } catch (err) {
        console.error('Error initializing data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initializeData();

    // Set up timer for long loading indicator
    const timer = setTimeout(() => {
      setLongLoading(true);
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [gameId]); // Only depend on gameId, not loading

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
            <button 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:underline"
            >
              ⬅️ Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="bg-gradient-to-b from-blue-500 to-blue-700 min-h-screen text-white px-4 sm:px-6">
  <div className="max-w-5xl mx-auto py-6">
    {/* Header */}
    <div className="bg-blue-600 rounded-2xl p-6 shadow-xl mb-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
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

    {/* Participants */}
    <div className="bg-white text-gray-800 rounded-xl p-6 shadow mb-8">
      {shouldShowStreaks() && (
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

      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        {hasGameProgress() ? 'Overall Rankings' : 'Players'}
      </h2>

      <ul className="space-y-4">
        {(() => {
          const streakKingName = longestStreak && longestStreak.longestStreak > 0 && hasGameProgress()
            ? longestStreak.playerName
            : null;

          return leaderboardData.map((player, index) => {
            const isStreakKing = player.name === streakKingName;

            return (
              <li key={player.name} className={`p-4 rounded-lg ${getRankClass(player.rank || index + 1)}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex flex-wrap items-center gap-3 font-medium">
                    {showBulkRemove && (
                      <input
                        type="checkbox"
                        checked={selectedPlayersForRemoval.includes(player.name)}
                        onChange={() => togglePlayerSelection(player.name)}
                        className="w-4 h-4"
                      />
                    )}
                    {hasGameProgress() && (
                      <span className="bg-gray-300 text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full">
                        {getRankIcon(player.rank || index + 1)} {player.rank || index + 1}
                        {player.rank === 1 ? 'st' : player.rank === 2 ? 'nd' : player.rank === 3 ? 'rd' : 'th'}
                      </span>
                    )}
                    <span className="flex items-center gap-2 flex-wrap">
                      {player.name} {player.name.startsWith('A') ? '👩' : '🧑'}
                      {isStreakKing && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full shadow-lg font-extrabold text-sm animate-pulse">
                          <span className="text-2xl drop-shadow-lg" style={{ filter: 'brightness(1.5) contrast(1.2)' }}>👑</span> 
                          <span>STREAK KING</span>
                        </span>
                      )}
                    </span>
                    {player.streak > 0 && hasGameProgress() && (
                      <span className="text-xs bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded-md">
                        Streak: {player.streak} Wins 🔥
                      </span>
                    )}
                  </div>
                  <span className="text-sm bg-yellow-200 text-yellow-900 font-semibold px-3 py-1 rounded-full shadow-sm">
                    Score: {player.score}
                  </span>
                </div>
                {!showBulkRemove && (
                  <form
                    className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center mt-3"
                    onSubmit={(e) => handleUpdateScore(player, e)}
                  >
                    <input 
                      type="number" 
                      className="w-full sm:w-32 border border-gray-300 rounded-md p-2" 
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
                )}
              </li>
            );
          });
        })()}
      </ul>
    </div>

    {/* Controls */}
    <div className="mt-6">
      <button 
        onClick={toggleControls} 
        className="text-sm text-white underline hover:text-blue-200"
      >
        ⚙️ More Options
      </button>
      {showControls && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
            <button 
              onClick={() => setShowBulkAdd(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-xl shadow"
            >
              ➕ Add Player(s)
            </button>
            <button 
              onClick={() => setShowBulkRemove(!showBulkRemove)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-xl shadow"
            >
              ➖ Remove Players
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-xl shadow"
            >
              🗑️ Deactivate Game
            </button>
          </div>

          {showBulkRemove && (
            <div className="bg-orange-100 p-4 rounded-lg">
              <p className="text-gray-800 mb-3">Select players to remove:</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleBulkRemovePlayers}
                  disabled={selectedPlayersForRemoval.length === 0}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Remove Selected ({selectedPlayersForRemoval.length})
                </button>
                <button
                  onClick={() => {
                    setShowBulkRemove(false);
                    setSelectedPlayersForRemoval([]);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>

   {/* Bulk Add Players Modal */}
   {showBulkAdd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Player(s)</h3>
              
              {playersToAdd.length === 0 ? (
                // Step 1: Enter player names
                <div>
                  <p className="text-sm text-gray-600 mb-3">Enter player names, one per line:</p>
                  <textarea
                    value={bulkPlayers}
                    onChange={(e) => setBulkPlayers(e.target.value)}
                    placeholder="Player 1&#10;Player 2&#10;Player 3"
                    className="w-full h-32 border border-gray-300 rounded-md p-3 text-gray-800"
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={processBulkPlayerNames}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Next: Customize Player(s)
                    </button>
                    <button
                      onClick={() => {
                        setShowBulkAdd(false);
                        setBulkPlayers('');
                        setPlayersToAdd([]);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Step 2: Customize avatars and colors
                <div>
                  <p className="text-sm text-gray-600 mb-4">Customize each player's avatar and color:</p>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {playersToAdd.map((player) => (
                      <div key={player.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                              style={{ backgroundColor: player.color }}
                            >
                              {player.avatar}
                            </div>
                            <span className="font-medium text-gray-800">{player.name}</span>
                          </div>
                          <button
                            onClick={() => removePlayerFromList(player.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ✕ Remove
                          </button>
                        </div>
                        
                        {/* Avatar Selection */}
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Avatar:</label>
                          <div className="flex flex-wrap gap-2">
                            {availableAvatars.map((avatar) => (
                              <button
                                key={avatar}
                                onClick={() => updatePlayerDetails(player.id, 'avatar', avatar)}
                                className={`w-10 h-10 rounded-full text-xl hover:scale-110 transition-transform ${
                                  player.avatar === avatar 
                                    ? 'ring-2 ring-blue-500 bg-blue-100' 
                                    : 'hover:bg-gray-100'
                                }`}
                              >
                                {avatar}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Color Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Color:</label>
                          <div className="flex flex-wrap gap-2">
                            {availableColors.map((color) => (
                              <button
                                key={color}
                                onClick={() => updatePlayerDetails(player.id, 'color', color)}
                                className={`w-8 h-8 rounded-full hover:scale-110 transition-transform ${
                                  player.color === color 
                                    ? 'ring-2 ring-gray-600' 
                                    : ''
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-6 pt-4 border-t">
                    <button
                      onClick={handleBulkAddPlayers}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium"
                    >
                      Add {playersToAdd.length} Players
                    </button>
                    <button
                      onClick={() => setPlayersToAdd([])}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      ← Back to Names
                    </button>
                    <button
                      onClick={() => {
                        setShowBulkAdd(false);
                        setBulkPlayers('');
                        setPlayersToAdd([]);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Game Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">⚠️ Deactivate Game</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to deactivate this game? This action will deactivate the game and cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeactivateGame}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  Yes, Deactivate Game
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

    <footer className="mt-10 text-center text-sm text-white">
      <p>&copy; 2025 Z Games. All rights reserved.</p>
    </footer>

    <ToastContainer />
  </div>
</div>

  );
};

export default SingleGame;