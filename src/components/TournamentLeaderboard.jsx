import React, { useState, useEffect } from 'react';
import { Trophy, Users, User, Medal, Clock, Target, TrendingUp, Calendar, Award } from 'lucide-react';

const TournamentLeaderboard = ({ tournamentId }) => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('teams');
  const [includeGameDetails, setIncludeGameDetails] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, [tournamentId, includeGameDetails]);

  const fetchLeaderboard = async () => {
    var tournamentId = '6866a66421ce6af5cd32e068';
    try {
      setLoading(true);
      const response = await fetch(`/api/tournaments/${tournamentId}/leaderboard?includeGameDetails=${includeGameDetails}`);
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.data);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to fetch leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-600 bg-yellow-50';
      case 2: return 'text-gray-600 bg-gray-50';
      case 3: return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-600" />;
      case 2: return <Medal className="w-5 h-5 text-gray-600" />;
      case 3: return <Award className="w-5 h-5 text-orange-600" />;
      default: return <span className="text-sm font-semibold">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Leaderboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchLeaderboard}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!leaderboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Leaderboard Data</h2>
            <p className="text-gray-600">No tournament data available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Tournament Leaderboard</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Last Updated: {formatDate(leaderboard.lastUpdated)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>{leaderboard.gameLeaderboards?.length || 0} Games</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={includeGameDetails}
                  onChange={(e) => setIncludeGameDetails(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Include Game Details
              </label>
              <button
                onClick={fetchLeaderboard}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Winner Banner */}
        {leaderboard.winner && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 mb-6 text-white">
            <div className="text-center">
              <Trophy className="w-12 h-12 mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">🎉 Tournament Winner! 🎉</h2>
              <p className="text-lg">
                {leaderboard.winner.type === 'team' ? 'Team' : 'Player'}: {leaderboard.winner.name}
              </p>
              <p className="text-sm opacity-90">Total Points: {leaderboard.winner.totalPoints}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('teams')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'teams'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Team Rankings
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'players'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <User className="w-5 h-5 inline mr-2" />
              Player Rankings
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'games'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Target className="w-5 h-5 inline mr-2" />
              Game Results
            </button>
          </div>

          {/* Team Rankings */}
          {activeTab === 'teams' && (
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Team Rankings</h3>
              <div className="space-y-3">
                {leaderboard.overallTeamRankings?.map((team, index) => (
                  <div
                    key={team.teamId}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      index < 3 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankColor(team.rank)}`}>
                          {getRankIcon(team.rank)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{team.teamName}</h4>
                          <p className="text-sm text-gray-600">{team.playerRankings?.length || 0} Players</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{team.totalPoints}</div>
                        <div className="text-sm text-gray-600">
                          Avg: {team.averageScore?.toFixed(1) || 0} | Won: {team.gamesWon || 0}/{team.gamesPlayed || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Player Rankings */}
          {activeTab === 'players' && (
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Player Rankings</h3>
              <div className="space-y-3">
                {leaderboard.overallPlayerRankings?.map((player, index) => (
                  <div
                    key={player.playerId}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      index < 3 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankColor(player.rank)}`}>
                          {getRankIcon(player.rank)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{player.playerName}</h4>
                          <p className="text-sm text-gray-600">{player.teamName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{player.totalPoints}</div>
                        <div className="text-sm text-gray-600">
                          Avg: {player.averageScore?.toFixed(1) || 0} | Contribution: {player.contributionPercentage?.toFixed(1) || 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Game Results */}
          {activeTab === 'games' && (
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Game Results</h3>
              <div className="space-y-4">
                {leaderboard.gameLeaderboards?.map((game) => (
                  <div key={game.gameId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{game.gameName}</h4>
                        {game.gameDetails && (
                          <p className="text-sm text-gray-600">{game.gameDetails.description}</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {formatDate(game.lastUpdated)}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Top Teams</h5>
                        <div className="space-y-2">
                          {game.teamScores?.slice(0, 3).map((team) => (
                            <div key={team.teamId} className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                {getRankIcon(team.rank)}
                                {team.teamName}
                              </span>
                              <span className="font-semibold">{team.totalScore}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Top Players</h5>
                        <div className="space-y-2">
                          {game.teamScores?.flatMap(team => 
                            team.playerScores?.map(player => ({ ...player, teamName: team.teamName }))
                          ).sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 3).map((player, index) => (
                            <div key={player.playerId} className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                {getRankIcon(index + 1)}
                                {player.playerName}
                              </span>
                              <span className="font-semibold">{player.score}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentLeaderboard;