// Game Details Component
const GameDetails = ({ game, scoringMode }) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h3 className="font-semibold text-blue-900">Game Details</h3>
   
    <p className="text-blue-700 mt-2">Mode: {scoringMode === 'team' ? 'Team Scoring' : 'Individual Player Scoring'}</p>
    <p className="text-sm text-blue-600 mt-2">
      💡 Tip: Enter negative values to deduct points (e.g., -5 for penalties)
    </p>
  </div>
);

export default GameDetails;