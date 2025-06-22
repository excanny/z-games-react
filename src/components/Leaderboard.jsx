import React, { useState, useEffect } from 'react';
import axios from "axios";

const Leaderboard = () => {
  const [selectedGame, setSelectedGame] = useState('');
  const [games, setGames] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [longestStreak, setLongestStreak] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  // Fetch leaderboard data when selected game changes
  useEffect(() => {
    if (selectedGame) {
      getLeaderboardData(selectedGame);
    }
  }, [selectedGame]);

  const fetchGames = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/games');
      setGames(response.data.data);
      
      // Set the active game as selected by default
      if (response.data.data && response.data.data.length > 0) {
        const activeGame = response.data.data.find(game => game.isActive);
        if (activeGame) {
          setSelectedGame(activeGame._id);
        }
      }
    } catch (err) {
      console.error('Error fetching games:', err);
    }
  };

  const getLeaderboardData = async (gameId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/games/${gameId}/leaderboard`);
      // Update to handle the new response structure
      setLeaderboardData(response.data.data.leaderboard);
      setLongestStreak(response.data.data.longestStreak);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  // Handle game selection change
  const handleGameChange = (e) => {
    setSelectedGame(e.target.value);
  };

  // Find the current selected game
  const currentGame = games.find(game => game._id === selectedGame);

  const getRankClass = (rank) => {
    switch (rank) {
      case 1:
        return 'border-warning bg-light';
      case 2:
        return 'border-secondary bg-light';
      case 3:
        return 'border-warning bg-light';
      default:
        return 'border-light';
    }
  };

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/4.6.2/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <style>
        {`
          body { background-color: #f8f9fa; }
          .rank-item { 
            transition: transform 0.2s; 
            border-left: 4px solid transparent;
          }
          .rank-item:hover { 
            transform: scale(1.02); 
          }
          .rank-1 { border-left-color: #ffc107; }
          .rank-2 { border-left-color: #6c757d; }
          .rank-3 { border-left-color: #cd7f32; }
          .custom-select { 
            background-image: none;
            padding-right: 2rem;
          }
          .select-wrapper { position: relative; }
          .select-arrow { 
            position: absolute; 
            right: 1rem; 
            top: 50%; 
            transform: translateY(-50%);
            pointer-events: none;
          }
          .gradient-header {
            background: linear-gradient(135deg, #007bff, #6f42c1);
          }
          .game-header {
            background: linear-gradient(135deg, #e9ecef, #f8f9fa);
          }
          .streak-highlight {
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: bold;
          }
        `}
      </style>
      
      <div className="container-fluid" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="row justify-content-center">
          <div className="col-12">
            
            {/* Header */}
            <div className="text-center py-5">
              <h1 className="display-4 font-weight-bold text-dark mb-3">
                🏆 Game Leaderboard
              </h1>
              <p className="lead text-muted">Compete with players worldwide and climb to the top!</p>
            </div>
            <div className="row">
                <div className="col-md-6">
                    {/* Game Selector */}
                    <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <label className="font-weight-bold text-secondary mb-2">Select Game</label>
                        <div className="select-wrapper">
                        <select
                            value={selectedGame}
                            onChange={handleGameChange}
                            className="form-control form-control-lg custom-select"
                        >
                            {games.map((game) => (
                            <option key={game._id} value={game._id}>
                                 {game.name}
                            </option>
                            ))}
                        </select>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="col-md-6">
                    {/* Current Game Header */}
                    <div className="card shadow-sm mb-4 game-header">
                    <div className="card-body text-center py-4">
                        <span className="display-4 mr-3">{currentGame?.icon || '🎮'}</span>
                        <h2 className="h2 font-weight-bold text-dark d-inline-block mb-0">
                        {currentGame?.name || 'Select a Game'}
                        </h2>
                    </div>
                    </div>
                </div>
            </div>
            
            {/* Longest Streak Highlight */}
            {longestStreak && (
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h5 className="font-weight-bold text-dark mb-1">
                        🔥 Hottest Streak Champion
                      </h5>
                      <p className="text-muted mb-0">
                        <strong>{longestStreak.playerName}</strong> is on fire with an incredible streak!
                      </p>
                    </div>
                    <div className="col-md-4 text-right">
                      <span className="streak-highlight">
                        {longestStreak.longestStreak} consecutive scores!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Leaderboard */}
            <div className="card shadow">
              <div className="gradient-header text-white">
                <div className="card-header border-0">
                  <h3 className="h4 font-weight-bold text-center mb-0">Overall Standings</h3>
                </div>
              </div>
              
              <div className="card-body p-0">
                {leaderboardData.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">No leaderboard data available</p>
                  </div>
                ) : (
                  leaderboardData.map((player) => (
                    <div
                      key={player.rank}
                      className={`p-3 border-bottom rank-item rank-${player.rank} ${getRankClass(player.rank)}`}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            {/* Rank badges can be added here */}
                          </div>
                          <div className="d-flex align-items-center">
                            <span className="h3 mr-3 mb-0">{player.avatar}</span>
                            <div>
                              <h5 className="font-weight-bold text-dark mb-1">
                                {player.name}
                                {longestStreak && player.name === longestStreak.playerName && (
                                  <span className="ml-2 badge badge-warning">
                                    🔥 Streak King
                                  </span>
                                )}
                              </h5>
                              <div className="d-flex align-items-center">
                                <small className="text-muted">
                                  Rank #{player.rank}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="h4 font-weight-bold text-dark mb-0">
                            {player.score.toLocaleString()}
                          </div>
                          <small className="text-muted">points</small>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer Stats */}
            <div className="row mt-4 mb-5">
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm text-center">
                  <div className="card-body">
                    <div className="h3 font-weight-bold text-primary">
                      {leaderboardData.length}
                    </div>
                    <small className="text-muted">Active Players</small>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm text-center">
                  <div className="card-body">
                    <div className="h3 font-weight-bold text-success">
                      {longestStreak ? longestStreak.longestStreak : 0}
                    </div>
                    <small className="text-muted">{longestStreak ? `${longestStreak.playerName}'s Best Streak` : 'Best Streak'}</small>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm text-center">
                  <div className="card-body">
                    <div className="h3 font-weight-bold" style={{ color: '#6f42c1' }}>
                      {leaderboardData.length > 0 ? Math.max(...leaderboardData.map(p => p.score)).toLocaleString() : 0}
                    </div>
                    <small className="text-muted">Highest Score</small>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;