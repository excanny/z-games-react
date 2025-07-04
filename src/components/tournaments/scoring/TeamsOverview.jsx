import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User } from 'lucide-react';

// Teams Overview Component
const TeamsOverview = ({ teams, scores, getTeamTotalScore }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <Users className="w-6 h-6 mr-2 text-purple-500" />
      Teams & Players
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {teams.map(team => (
        <div key={team.id} className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">{team.name}</h3>
          <div className="space-y-1">
            {team.players.map((player, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{player.name}</span>
                <span className="text-sm font-medium text-blue-600">
                  {scores.filter(s => s.playerId === player.id).length} scores
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700">
              Team Total: <span className="text-blue-600">{getTeamTotalScore(team.id)} points</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TeamsOverview;