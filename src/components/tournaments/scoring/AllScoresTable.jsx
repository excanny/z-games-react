// All Scores Table Component
const AllScoresTable = ({ scores, games, teams }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">All Scores</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Game</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Team</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Player</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Score</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => {
            const game = games.find(g => g.id === score.gameId);
            const team = teams.find(t => t.id === score.teamId);
            return (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-2">{game?.name}</td>
                <td className="px-4 py-2">{team?.name}</td>
                <td className="px-4 py-2">{score.playerName || '-'}</td>
                <td className={`px-4 py-2 font-medium ${score.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {score.score >= 0 ? '+' : ''}{score.score}
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {new Date(score.timestamp).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default AllScoresTable;