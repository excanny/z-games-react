import { Users, User } from 'lucide-react';
import ScoreSection from './ScoreSection';

const animalEmojis = {
  'Frog': '🐸',
  'Dog': '🐶',
  'Cat': '🐱',
  'Lion': '🦁',
  'Tiger': '🐅',
  'Bear': '🐻',
  'Wolf': '🐺',
  'Fox': '🦊',
  'Rabbit': '🐰',
  'Elephant': '🐘',
  'Monkey': '🐵',
  'Bird': '🐦',
  'Eagle': '🦅',
  'Owl': '🦉',
  'Penguin': '🐧',
  'Turtle': '🐢',
  'Snake': '🐍',
  'Horse': '🐴',
  'Cow': '🐄',
  'Pig': '🐷'
};

// Team Card Component
const TeamCard = ({ team, index, games, getTeamScores, leaderboard}) => {

  //debugger
  const getPlayerScore = (playerId) => {
    const gameLeaderboards = leaderboard?.gameLeaderboards || [];

    return gameLeaderboards.reduce((totalScore, game) => {
      const playerScoreEntry = game.playerScores?.find(p => p.playerId === playerId);
      return totalScore + (playerScoreEntry?.score || 0);
    }, 0);
  };

  // Helper function to get player's individual score for a specific game
  const getPlayerGameScore = (playerId, gameId) => {
    if (leaderboard?.gameLeaderboards) {
      const gameLeaderboard = leaderboard.gameLeaderboards.find(
        gl => gl.gameId === gameId
      );
      
      if (gameLeaderboard?.playerScores) {
        const playerScore = gameLeaderboard.playerScores.find(
          ps => ps.playerId === playerId
        );
        return playerScore?.score || 0;
      }
    }
    return 0;
  };

  // Helper function to get player's performance rating for a specific game
  const getPlayerPerformanceRating = (playerId, gameId) => {
    if (leaderboard?.gameLeaderboards) {
      const gameLeaderboard = leaderboard.gameLeaderboards.find(
        gl => gl.gameId === gameId
      );
      
      if (gameLeaderboard?.playerScores) {
        const playerScore = gameLeaderboard.playerScores.find(
          ps => ps.playerId === playerId
        );
        return playerScore?.performanceRating || 0;
      }
    }
    return 0;
  };

  // Helper function to get player's rank for a specific game
  const getPlayerGameRank = (playerId, gameId) => {
    if (leaderboard?.gameLeaderboards) {
      const gameLeaderboard = leaderboard.gameLeaderboards.find(
        gl => gl.gameId === gameId
      );
      
      if (gameLeaderboard?.playerScores) {
        const playerScore = gameLeaderboard.playerScores.find(
          ps => ps.playerId === playerId
        );
        return playerScore?.gameRank || 0;
      }
    }
    return 0;
  };

  return (
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
          <p className="text-xl font-bold text-blue-600">{getTeamScores}</p>
          <p className="text-xs text-gray-500">Total Points</p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-2 text-sm">
        {/* Team Score Breakdown by Game */}
        {team.gameBreakdown && team.gameBreakdown.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-2 font-medium">Game Performance:</div>
            <div className="grid grid-cols-1 gap-2">
              {team.gameBreakdown.map((game, gameIndex) => (
                <div key={gameIndex} className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-700">
                      {games?.find(g => g._id === game.gameId)?.name || 'Unknown Game'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">
                        Rank #{game.gameRank}
                      </span>
                      <span className="bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                        {game.totalScore}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Team Bonus: {game.teamBonusScore}</span>
                    <span>Individual: {game.individualPlayerScore}</span>
                  </div>
                </div>
              ))}
            </div>
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
                        {animalEmojis[player.animalAvatar?.name] || '🐾'}
                      </span>
                      <span className="text-xs text-gray-600">
                        {player.animalAvatar?.name}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800">{player.name}</span>
                  </div>
                  <div className="bg-green-500 text-white rounded-full px-3 py-1 text-sm font-bold">
                    {getPlayerScore(player._id)}
                  </div>
                </div>

                {/* Player Game Breakdown - Updated to use individual player scores */}
                <div className="ml-4">
                  {games?.map((game, gameIndex) => {
                    const playerScore = getPlayerGameScore(player._id, game._id);
                    const performanceRating = getPlayerPerformanceRating(player._id, game._id);
                    const gameRank = getPlayerGameRank(player._id, game._id);
                    
                    // Only show games where the player has a score
                    if (playerScore > 0 || gameRank > 0) {
                      return (
                        <div key={gameIndex} className="flex justify-between items-center text-xs mb-1">
                          <span className="text-gray-600">
                            {game.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            {gameRank > 0 && (
                              <span className="text-gray-500">Rank #{gameRank}</span>
                            )}
                            <span className="bg-gray-600 text-white rounded-full px-2 py-0.5 font-medium">
                              {playerScore}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

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
  );
};

export default TeamCard;