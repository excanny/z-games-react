const GameSelector = ({ games, selectedGame, onGameChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Select Game
    </label>
    <select
      value={selectedGame}
      onChange={(e) => onGameChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Choose a game...</option>
      {games.map(game => (
        <option key={game.id} value={game.id}>
          {game.name}
        </option>
      ))}
    </select>
  </div>
);

export default GameSelector;