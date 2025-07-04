// Score Input Component
const ScoreInput = ({ scoreValue, onScoreChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Score (positive to award, negative to deduct)
    </label>
    <input
      type="number"
      value={scoreValue}
      onChange={(e) => onScoreChange(e.target.value)}
      step="1"
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter score... (e.g., 10 or -5)"
    />
    <p className="text-xs text-gray-500 mt-1">
      Examples: 10 (award 10 points), -5 (deduct 5 points)
    </p>
  </div>
);

export default ScoreInput;