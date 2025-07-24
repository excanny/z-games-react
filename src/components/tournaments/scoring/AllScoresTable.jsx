import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User } from 'lucide-react';

// All Scores Table Component
const AllScoresTable = ({ tournamentData }) => {
  const games = tournamentData?.selectedGames || [];
  const teams = tournamentData?.teams || [];
  
  // Transform player and team scores into individual score entries
  const allScores = [];
  
  // Add team scores
  teams.forEach(team => {
    team.gameScores?.forEach(gameScore => {
      const game = games.find(g => g.game_id === gameScore.gameId);
      allScores.push({
        gameId: gameScore.gameId,
        gameName: gameScore.gameName || game?.name || 'Unknown Game',
        teamId: team.id,
        teamName: team.name,
        playerId: null,
        playerName: null,
        score: gameScore.totalScore,
        scoreType: 'team',
        positiveScore: gameScore.positiveScore,
        deductions: gameScore.deductions,
        totalEntries: gameScore.totalEntries,
        timestamp: new Date(gameScore.lastScoreDate)
      });
    });
  });
  
  // Add individual player scores
  teams.forEach(team => {
    team.players?.forEach(player => {
      player.gameScores?.forEach(gameScore => {
        const game = games.find(g => g.game_id === gameScore.gameId);
        allScores.push({
          gameId: gameScore.gameId,
          gameName: gameScore.gameName || game?.name || 'Unknown Game',
          teamId: team.id,
          teamName: team.name,
          playerId: player.id,
          playerName: player.name,
          score: gameScore.totalScore,
          scoreType: 'player',
          positiveScore: gameScore.positiveScore,
          deductions: gameScore.deductions,
          totalEntries: gameScore.totalEntries,
          overallRank: player.overallRank,
          teamRank: player.teamRank,
          timestamp: new Date(gameScore.lastScoreDate)
        });
      });
    });
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
                <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Score</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Positive</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Deductions</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Rank</th>
              </tr>
            </thead>
            <tbody>
              {allScores.map((score) => (
                <tr key={`${score.teamId}-${score.playerId || 'team'}-${score.gameId}`} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{score.gameName}</td>
                  <td className="px-4 py-3 text-gray-600">{score.teamName}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {score.playerName || (
                      <span className="text-gray-400 italic">Team Score</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      score.scoreType === 'team' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {score.scoreType === 'team' ? 'Team' : 'Player'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-bold ${score.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {score.score >= 0 ? '+' : ''}{score.score}
                  </td>
                  <td className="px-4 py-3 text-green-600 font-medium">
                    +{score.positiveScore || 0}
                  </td>
                  <td className="px-4 py-3 text-red-600 font-medium">
                    -{score.deductions || 0}
                  </td>
                  <td className="px-4 py-3">
                    {score.scoreType === 'player' && score.overallRank ? (
                      <div className="flex items-center space-x-1">
                        {score.overallRank === 1 && <Trophy className="w-4 h-4 text-yellow-500" />}
                        {score.overallRank === 2 && <Medal className="w-4 h-4 text-gray-400" />}
                        {score.overallRank === 3 && <Medal className="w-4 h-4 text-orange-600" />}
                        <span className="text-gray-600">#{score.overallRank}</span>
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