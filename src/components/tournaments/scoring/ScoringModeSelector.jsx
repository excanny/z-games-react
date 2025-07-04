// Scoring Mode Component
const ScoringModeSelector = ({ scoringMode, onModeChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Scoring Mode
    </label>
    <div className="flex space-x-4">
      <label className="flex items-center">
        <input
          type="radio"
          value="team"
          checked={scoringMode === 'team'}
          onChange={(e) => onModeChange(e.target.value)}
          className="mr-2"
        />
        Score Team
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          value="player"
          checked={scoringMode === 'player'}
          onChange={(e) => onModeChange(e.target.value)}
          className="mr-2"
        />
        Score Individual Player
      </label>
    </div>
  </div>
);

export default ScoringModeSelector;