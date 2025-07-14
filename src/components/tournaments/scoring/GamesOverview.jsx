import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User } from 'lucide-react';

// Games Overview Component
const GamesOverview = ({ tournamentData }) => {
  const games = tournamentData?.selectedGames || [];
  const playerRankings = tournamentData?.leaderboard?.overallLeaderboard?.playerRankings || [];
  
  const getScoresByGame = (gameId) => {
    const scoresForGame = [];
    playerRankings.forEach(player => {
      const gameBreakdown = player.gameBreakdown || [];
      const gameScore = gameBreakdown.find(g => g.gameId === gameId);
      if (gameScore) {
        scoresForGame.push({
          playerId: player.playerId,
          score: gameScore.score,
          gameRank: gameScore.gameRank,
          performanceRating: gameScore.performanceRating
        });
      }
    });
    return scoresForGame;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Gamepad2 className="w-6 h-6 mr-2 text-green-500" />
        Games Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map(game => {
          const gameScores = getScoresByGame(game._id);
          const totalScore = gameScores.reduce((sum, score) => sum + score.score, 0);
          const avgScore = gameScores.length > 0 ? Math.round(totalScore / gameScores.length) : 0;
          
          return (
            <div key={game._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">{game.name}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{game.description}</p>
              <div className="space-y-1">
                <p className="text-sm text-blue-600 font-medium">
                  {gameScores.length} players participated
                </p>
                <p className="text-sm text-green-600">
                  Avg Score: {avgScore}
                </p>
                <p className="text-sm text-purple-600">
                  Total Points: {totalScore}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {games.length === 0 && (
        <div className="text-center py-8">
          <Gamepad2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No games selected for this tournament</p>
        </div>
      )}
    </div>
  );
};

export default GamesOverview;