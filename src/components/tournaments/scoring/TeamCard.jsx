import React, { useState } from 'react';
import { Users, ChevronDown, ChevronRight } from 'lucide-react';

const animalEmojis = {
  Lion: '🦁',
  Tiger: '🐅',
  Eagle: '🦅',
  Cat: '🐱',
  Shark: '🦈',
  Dog: '🐶',
  Whale: '🐋',
  Horse: '🐴',
  Bison: '🦬',
  Moose: '🫎',
  Goose: '🪿',
  Turtle: '🐢',
  Beaver: '🦫',
  Bear: '🐻',
  Frog: '🐸',
  Rabbit: '🐰',
  Wolf: '🐺',
  Human: '🧑',
  Monkey: '🐵',
  Chameleon: '🦎'
};

const TeamCard = ({ 
  team, 
  index, 
  games, 
  getTeamScores
}) => {
  const [showTeamDeductions, setShowTeamDeductions] = useState(false);
  const [showTeamGamePerformance, setShowTeamGamePerformance] = useState(false);
  const [playerDeductionState, setPlayerDeductionState] = useState({});
  const [playerGamePerformanceState, setPlayerGamePerformanceState] = useState({});

  const togglePlayerDeductions = (playerId) => {
    setPlayerDeductionState((prev) => ({
      ...prev,
      [playerId]: !prev[playerId],
    }));
  };

  const togglePlayerGamePerformance = (playerId) => {
    setPlayerGamePerformanceState((prev) => ({
      ...prev,
      [playerId]: !prev[playerId],
    }));
  };

  // Helper function to get team's rank for a specific game
  const getTeamGameRank = (teamId, gameId) => {
    // Get all teams' scores for this game and sort them
    const gameTeamScores = [];
    
    // Find this team's score for the game
    const teamGameScore = team.gameScores?.find(gs => gs.gameId === gameId);
    if (!teamGameScore) return 0;
    
    // This is a simplified ranking - in a real scenario, you'd compare with all teams
    // For now, we'll use a placeholder ranking logic
    return 1; // Placeholder - should be calculated based on comparison with other teams
  };

  // Helper function to get player's individual score for a specific game
  const getPlayerGameScore = (playerId, gameId) => {
    const player = team.players?.find(p => p.id === playerId);
    if (!player) return 0;
    
    const gameScore = player.gameScores?.find(gs => gs.gameId === gameId);
    return gameScore?.totalScore || 0;
  };

  // Helper function to get player's rank for a specific game (placeholder implementation)
  const getPlayerGameRank = (playerId, gameId) => {
    const playerScore = getPlayerGameScore(playerId, gameId);
    if (playerScore === 0) return 0;
    
    // This is a simplified ranking - in a real scenario, you'd compare with all players across all teams
    return playerScore >= 500 ? 1 : playerScore >= 100 ? 2 : 3;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`border-2 rounded-lg p-4 ${
        index === 0 ? 'border-yellow-400 bg-yellow-50' :
        index === 1 ? 'border-gray-400 bg-gray-50' :
        index === 2 ? 'border-amber-600 bg-amber-50' :
        'border-gray-200 bg-white'
      }`}>
        {/* Team Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
              index === 0 ? 'bg-yellow-400 text-white' :
              index === 1 ? 'bg-gray-400 text-white' :
              index === 2 ? 'bg-amber-600 text-white' :
              'bg-gray-200 text-gray-700'
            }`}>
              {index + 1}
            </div>
            <h4 className="font-semibold text-gray-800">{team.name}</h4>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-blue-600">{team.totalScore || getTeamScores}</p>
            <p className="text-xs text-gray-500">Total Points</p>
          </div>
        </div>

        {/* Team Score Breakdown */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
          <div className="text-xs font-medium text-gray-700 mb-2">Score Breakdown:</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-100 border border-orange-200 rounded-lg p-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-orange-700 font-medium">Team Bonus</span>
                <span className="bg-orange-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                  {team.teamOnlyScore || 0}
                </span>
              </div>
            </div>
            <div className="bg-green-100 border border-green-200 rounded-lg p-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-green-700 font-medium">Players Score</span>
                <span className="bg-green-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                  {team.playersScore || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-2 text-sm">
          {/* Team Performance by Game - Collapsible */}
          {team.gameScores && team.gameScores.length > 0 && (
            <div className="mb-3">
              <button
                onClick={() => setShowTeamGamePerformance((prev) => !prev)}
                className="flex items-center text-gray-700 hover:text-gray-900 text-xs mb-2 font-medium cursor-pointer bg-transparent border-none p-0"
              >
                {showTeamGamePerformance ? (
                  <ChevronDown className="w-3 h-3 mr-1" />
                ) : (
                  <ChevronRight className="w-3 h-3 mr-1" />
                )}
                Team Games Performance:
              </button>
              
              {showTeamGamePerformance && (
                <div className="grid grid-cols-1 gap-2">
                  {team.gameScores.map((gameScore, gameIndex) => {
                    const game = games?.find(g => g.id === gameScore.gameId || g.game_id === gameScore.gameId);
                    const teamRank = getTeamGameRank(team.id, gameScore.gameId);
                    
                    return (
                      <div key={gameIndex} className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-700">
                            {game?.name || gameScore.gameName || 'Unknown Game'}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600">
                              Rank #{teamRank}
                            </span>
                            <span className="bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                              {gameScore.totalScore}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Positive: {gameScore.positiveScore}</span>
                          <span>Deductions: -{gameScore.deductions}</span>
                        </div>
                        {gameScore.deductions > 0 && (
                          <div className="text-xs text-red-600 mt-1">
                            Impact: -{gameScore.deductions} points
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Team Deductions */}
          {team.gameScores?.some(gs => gs.deductions > 0) && (
            <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <button
                onClick={() => setShowTeamDeductions((prev) => !prev)}
                className="text-red-700 underline text-xs mb-2 h-auto p-0 bg-transparent border-none cursor-pointer"
              >
                {showTeamDeductions
                  ? 'Hide Team Deductions'
                  : 'Show Team Deductions'}
              </button>
              {showTeamDeductions && (
                <ul className="space-y-2">
                  {team.gameScores
                    .filter(gs => gs.deductions > 0)
                    .map((gameScore, idx) => (
                    <li key={idx} className="text-xs text-red-800">
                      <div className="flex justify-between">
                        <span className="font-semibold">
                          {gameScore.gameName}
                        </span>
                        <span className="font-bold text-red-600">
                          -{gameScore.deductions}
                        </span>
                      </div>
                      <div className="italic">
                        Deduction entries: {gameScore.scoreEntries?.filter(se => se.scoreChange < 0).length || 0}
                      </div>
                      <div className="text-[10px] text-red-500 mt-1">
                        Last updated: {new Date(gameScore.lastScoreDate).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {/* Team Players */}
          <div className="border-t pt-2 mt-2">
            <div className="flex items-center text-xs text-gray-600 mb-2">
              <Users className="w-3 h-3 mr-1" />
              <span>Team Players:</span>
            </div>
            <div className="space-y-2">
              {team.players?.map((player, playerIndex) => (
                <div 
                  key={playerIndex} 
                  className="bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-lg p-3 hover:from-blue-200 hover:to-purple-200 transition-colors"
                >
                  {/* Player Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">
                          {animalEmojis[player.animal?.name]}
                        </span>
                        <span className="text-xs text-gray-600">
                          {player.animal?.name}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">{player.name}</span>
                    </div>
                    <div className="bg-green-500 text-white rounded-full px-3 py-1 text-sm font-bold">
                      {player.totalScore}
                    </div>
                  </div>

                  {/* Player Game Performance - Collapsible */}
                  {player.gameScores && player.gameScores.length > 0 && (
                    <div className="ml-4 mb-2">
                      <button
                        onClick={() => togglePlayerGamePerformance(player.id)}
                        className="flex items-center text-gray-600 hover:text-gray-800 text-xs mb-2 cursor-pointer bg-transparent border-none p-0"
                      >
                        {playerGamePerformanceState[player.id] ? (
                          <ChevronDown className="w-3 h-3 mr-1" />
                        ) : (
                          <ChevronRight className="w-3 h-3 mr-1" />
                        )}
                        Games Performance:
                      </button>
                      
                      {playerGamePerformanceState[player.id] && (
                        <div className="space-y-1">
                          {player.gameScores.map((gameScore, gameIndex) => {
                            const game = games?.find(g => g.id === gameScore.gameId || g.game_id === gameScore.gameId);
                            const gameRank = getPlayerGameRank(player.id, gameScore.gameId);
                            
                            return (
                              <div key={gameIndex} className="flex justify-between items-center text-xs">
                                <span className="text-gray-600">
                                  {game?.name || gameScore.gameName}
                                </span>
                                <div className="flex items-center space-x-2">
                                  {gameRank > 0 && (
                                    <span className="text-gray-500">Rank #{gameRank}</span>
                                  )}
                                  <span className="bg-gray-600 text-white rounded-full px-2 py-0.5 font-medium">
                                    {gameScore.totalScore}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Player Deductions */}
                  {player.gameScores?.some(gs => gs.deductions > 0) && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                      <button
                        onClick={() => togglePlayerDeductions(player.id)}
                        className="text-red-700 underline text-xs mb-2 h-auto p-0 bg-transparent border-none cursor-pointer"
                      >
                        {playerDeductionState[player.id]
                          ? 'Hide Player Deductions'
                          : 'Show Player Deductions'}
                      </button>
                      {playerDeductionState[player.id] && (
                        <ul className="space-y-2">
                          {player.gameScores
                            .filter(gs => gs.deductions > 0)
                            .map((gameScore, idx) => (
                            <li key={idx} className="text-xs text-red-800">
                              <div className="flex justify-between">
                                <span className="font-semibold">
                                  {gameScore.gameName}
                                </span>
                                <span className="font-bold text-red-600">
                                  -{gameScore.deductions}
                                </span>
                              </div>
                              <div className="italic">
                                Deduction entries: {gameScore.scoreEntries?.filter(se => se.scoreChange < 0).length || 0}
                              </div>
                              <div className="text-[10px] text-red-500 mt-1">
                                {new Date(gameScore.lastScoreDate).toLocaleString()}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Player Superpower */}
                  {player.animalAvatar?.superpower && (
                    <div className="mt-2 text-xs bg-purple-100 border border-purple-200 rounded p-2">
                      <div className="font-medium text-purple-800">🦸 Superpower:</div>
                      <div className="text-purple-700">{player.animalAvatar.superpower.description}</div>
                      {player.animalAvatar.superpower.specialRules && (
                        <div className="text-purple-600 mt-1">
                          <span className="font-medium">Special Rules:</span> {player.animalAvatar.superpower.specialRules}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;