// Leaderboard Card Component
const LeaderboardCard = ({ team, index }) => (
  <div className={`p-4 rounded-lg border-2 ${
    index === 0 ? 'border-yellow-400 bg-yellow-50' :
    index === 1 ? 'border-gray-400 bg-gray-50' :
    index === 2 ? 'border-amber-600 bg-amber-50' :
    'border-gray-200 bg-white'
  }`}>
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
          index === 0 ? 'bg-yellow-400 text-white' :
          index === 1 ? 'bg-gray-400 text-white' :
          index === 2 ? 'bg-amber-600 text-white' :
          'bg-gray-200 text-gray-700'
        }`}>
          {index + 1}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
          <p className="text-sm text-gray-600">{team.players.map(p => p.name).join(', ')}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-blue-600">{team.totalScore}</p>
        <p className="text-sm text-gray-500">Total Points</p>
        <p className="text-xs text-gray-400">
          Team: {team.teamScoreTotal} | Players: {team.playerScoreTotal}
        </p>
      </div>
    </div>
  </div>
);

export default LeaderboardCard;