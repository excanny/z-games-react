// Player Selector Component
const PlayerSelector = ({ players, selectedPlayer, onPlayerChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Select Player
    </label>
    <select
      value={selectedPlayer}
      onChange={(e) => onPlayerChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Choose a player...</option>
      {players.map(player => (
        <option key={player.id} value={player.id}>
          {player.name} ({player.teamName})
        </option>
      ))}
    </select>
  </div>
);

export default PlayerSelector;