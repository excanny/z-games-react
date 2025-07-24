import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';


const Leaderboard = () => {
  const [selectedGame, setSelectedGame] = useState('');
  const [games, setGames] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState({
    combined: [],
    teams: [],
    players: []
  });
  const [tournamentData, setTournamentData] = useState(null);
  const [topPerformer, setTopPerformer] = useState(null);
  const [viewMode, setViewMode] = useState('combined'); // 'combined', 'teams', 'players'

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (selectedGame) {
      getLeaderboardData(selectedGame);
    }
  }, [selectedGame]);

  const fetchGames = async () => {
    try {
      const response = await axiosClient.get('/games');
      setGames(response.data.data || []);
      
      if (response.data.data && response.data.data.length > 0) {
        const activeGame = response.data.data.find(game => game.isActive);
        if (activeGame) {
          setSelectedGame(activeGame.id);
        }
      }
    } catch (err) {
      console.error('Error fetching games:', err);
      setGames([]);
    }
  };

  const getLeaderboardData = async (gameId) => {
    try {
      const response = await axiosClient.get(`/games/${gameId}/leaderboard`);
      
      if (response.data?.data?.teams) {
        const data = response.data.data;
        setTournamentData(data);
        processLeaderboardData(data);
        findTopPerformer(data);
      } else {
        resetLeaderboard();
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      resetLeaderboard();
    }
  };

  const resetLeaderboard = () => {
    setLeaderboardData({
      combined: [],
      teams: [],
      players: []
    });
    setTournamentData(null);
    setTopPerformer(null);
  };

  const processLeaderboardData = (data) => {
    const combined = [];
    const teams = [];
    const players = [];

    // Process teams
    if (data.teams) {
      data.teams.forEach(team => {
        const teamEntry = {
          id: team.id,
          name: team.name,
          score: team.totalScore || 0,
          positiveScore: team.positiveScore || 0,
          deductions: team.totalDeductions || 0,
          rank: team.rank,
          type: 'team',
          avatar: '🏆',
          playerCount: team.players?.length || 0
        };
        
        teams.push(teamEntry);
        combined.push(teamEntry);

        // Process players within teams
        if (team.players) {
          team.players.forEach(player => {
            const playerEntry = {
              id: player.id,
              name: player.name,
              score: player.totalScore || 0,
              rank: player.overallRank || 0,
              teamRank: player.teamRank || 0,
              type: 'player',
              avatar: getAnimalEmoji(player.animal?.name),
              teamName: team.name,
              teamId: team.id
            };
            
            players.push(playerEntry);
            combined.push(playerEntry);
          });
        }
      });
    }

    // Sort each array by score (descending)
    const sortByScore = (a, b) => b.score - a.score;
    combined.sort(sortByScore);
    teams.sort(sortByScore);
    players.sort(sortByScore);

    // Assign proper ranks for combined view
    combined.forEach((entry, index) => {
      entry.combinedRank = index + 1;
    });

    setLeaderboardData({
      combined,
      teams,
      players
    });
  };

  const findTopPerformer = (data) => {
    let topPlayer = null;
    let highestScore = -1;

    if (data.teams) {
      data.teams.forEach(team => {
        if (team.players) {
          team.players.forEach(player => {
            if (player.totalScore > highestScore) {
              highestScore = player.totalScore;
              topPlayer = {
                name: player.name,
                score: player.totalScore,
                teamName: team.name,
                avatar: getAnimalEmoji(player.animal?.name)
              };
            }
          });
        }
      });
    }

    setTopPerformer(topPlayer);
  };

  const getAnimalEmoji = (animalName) => {
    const animalEmojis = {
      'Cat': '🐱',
      'Tiger': '🐅',
      'Dog': '🐶',
      'Lion': '🦁',
      'Bear': '🐻',
      'Wolf': '🐺',
      'Fox': '🦊',
      'Rabbit': '🐰',
      'Mouse': '🐭',
      'Elephant': '🐘'
    };
    return animalEmojis[animalName] || '🎮';
  };

  const handleGameChange = (e) => {
    setSelectedGame(e.target.value);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const getCurrentLeaderboard = () => {
    if (!leaderboardData || !leaderboardData[viewMode]) return [];
    return leaderboardData[viewMode];
  };

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

  const getHighestScore = () => {
    const current = getCurrentLeaderboard();
    if (!current || current.length === 0) return 0;
    return Math.max(...current.map(p => p.score)).toLocaleString();
  };

  const currentGame = games.find(game => game.id === selectedGame);
  const currentLeaderboard = getCurrentLeaderboard();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            🏆 Tournament Leaderboard
          </h1>
          <p className="text-lg text-gray-600">Compete with players worldwide and climb to the top!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Game Selector */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Game</label>
            <select
              value={selectedGame}
              onChange={handleGameChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a game...</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          {/* Current Game Header */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm p-6 text-center">
            <span className="text-4xl mr-3">{currentGame?.icon || '🎮'}</span>
            <h2 className="text-2xl font-bold text-gray-800 inline-block">
              {currentGame?.name || 'Select a Game'}
            </h2>
          </div>
        </div>

        {/* Tournament Summary */}
        {tournamentData && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  🎯 {tournamentData.name}
                </h3>
                <p className="text-gray-600 mb-2">{tournamentData.description}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  tournamentData.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {tournamentData.status}
                </span>
              </div>
              <div className="text-right">
                <div className="space-y-2 text-gray-600">
                  <div><span className="font-semibold">{tournamentData.summary?.totalTeams || 0}</span> Teams</div>
                  <div><span className="font-semibold">{tournamentData.summary?.totalPlayers || 0}</span> Players</div>
                  <div><span className="font-semibold">{tournamentData.summary?.totalGames || 0}</span> Games</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Performer */}
        {topPerformer && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  🔥 Top Individual Performer
                </h3>
                <p className="text-gray-600">
                  <span className="text-2xl mr-2">{topPerformer.avatar}</span>
                  <strong>{topPerformer.name}</strong> from <em>{topPerformer.teamName}</em>
                </p>
              </div>
              <div className="text-right">
                <div className="bg-gradient-to-r from-red-400 to-yellow-400 text-white px-4 py-2 rounded-full font-bold">
                  {topPerformer.score.toLocaleString()} points
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode Selector */}
        {leaderboardData?.combined && leaderboardData.combined.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleViewModeChange('combined')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'combined'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Combined View
              </button>
              <button
                onClick={() => handleViewModeChange('teams')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'teams'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Teams Only
              </button>
              <button
                onClick={() => handleViewModeChange('players')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'players'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Players Only
              </button>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
            <h3 className="text-xl font-bold text-center">
              {viewMode === 'combined' && 'Overall Standings'}
              {viewMode === 'teams' && 'Team Rankings'}
              {viewMode === 'players' && 'Player Rankings'}
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {!currentLeaderboard || currentLeaderboard.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No leaderboard data available. Please select a game.</p>
              </div>
            ) : (
              currentLeaderboard.map((entry, index) => {
                const displayRank = viewMode === 'combined' ? entry.combinedRank : entry.rank || index + 1;
                
                return (
                  <div
                    key={`${entry.type}-${entry.id}`}
                    className={`p-4 hover:bg-gray-50 transition-colors ${getRankClass(displayRank)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-gray-800">
                          #{displayRank}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{entry.avatar}</span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-lg font-bold text-gray-800">
                                {entry.name}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                entry.type === 'team'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {entry.type.toUpperCase()}
                              </span>
                              {topPerformer && entry.name === topPerformer.name && entry.type === 'player' && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                  🔥 TOP SCORER
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {entry.teamName && entry.type === 'player' && (
                                <span>Team: {entry.teamName}</span>
                              )}
                              {entry.type === 'team' && entry.playerCount && (
                                <span>{entry.playerCount} players</span>
                              )}
                              {entry.deductions > 0 && (
                                <span className="ml-2 text-red-600">
                                  (-{entry.deductions} deductions)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">
                          {entry.score.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">points</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Stats */}
        {tournamentData && (
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentLeaderboard.length}
              </div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {tournamentData.summary?.totalTeams || 0}
              </div>
              <div className="text-sm text-gray-600">Active Teams</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {getHighestScore()}
              </div>
              <div className="text-sm text-gray-600">Highest Score</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {tournamentData.summary?.totalDeductions || 0}
              </div>
              <div className="text-sm text-gray-600">Total Deductions</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
