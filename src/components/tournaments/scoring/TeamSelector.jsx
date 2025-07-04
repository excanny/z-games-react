// Team Selector Component
const TeamSelector = ({ teams, selectedTeam, onTeamChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Select Team
    </label>
    <select
      value={selectedTeam}
      onChange={(e) => onTeamChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Choose a team...</option>
      {teams.map(team => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ))}
    </select>
  </div>
);

export default TeamSelector;