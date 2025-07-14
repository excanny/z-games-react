import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User } from 'lucide-react';

// All Scores Table Component
const AllScoresTable = ({ tournamentData }) => {
  const games = tournamentData?.selectedGames || [];
  const teams = tournamentData?.teams || [];
  const playerRankings = tournamentData?.leaderboard?.overallLeaderboard?.playerRankings || [];
  
  // Transform player rankings into individual score entries
  const allScores = [];
  playerRankings.forEach(player => {
    const team = teams.find(t => t.players.some(p => p._id === player.playerId));
    const playerDetails = team?.players.find(p => p._id === player.playerId);
    
    if (player.gameBreakdown) {
      player.gameBreakdown.forEach(gameScore => {
        const game = games.find(g => g._id === gameScore.gameId);
        allScores.push({
          gameId: gameScore.gameId,
          gameName: game?.name || 'Unknown Game',
          teamId: team?._id || null,
          teamName: team?.name || 'Unknown Team',
          playerId: player.playerId,
          playerName: playerDetails?.name || 'Unknown Player',
          score: gameScore.score,
          gameRank: gameScore.gameRank,
          performanceRating: gameScore.performanceRating,
          timestamp: new Date() // You might want to use actual timestamp from your data
        });
      });
    }
  });

  // Sort by score descending
  allScores.sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
        All Scores
      </h2>
      {allScores.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Game</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Team</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Player</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Score</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Rank</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Rating</th>
              </tr>
            </thead>
            <tbody>
              {allScores.map((score, index) => (
                <tr key={`${score.playerId}-${score.gameId}`} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{score.gameName}</td>
                  <td className="px-4 py-3 text-gray-600">{score.teamName}</td>
                  <td className="px-4 py-3 text-gray-600">{score.playerName}</td>
                  <td className={`px-4 py-3 font-bold ${score.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {score.score >= 0 ? '+' : ''}{score.score}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      {score.gameRank === 1 && <Trophy className="w-4 h-4 text-yellow-500" />}
                      {score.gameRank === 2 && <Medal className="w-4 h-4 text-gray-400" />}
                      {score.gameRank === 3 && <Medal className="w-4 h-4 text-orange-600" />}
                      <span className="text-gray-600">#{score.gameRank}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {score.performanceRating ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-gray-600">{score.performanceRating}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No scores recorded yet</p>
        </div>
      )}
    </div>
  );
};


export default AllScoresTable;