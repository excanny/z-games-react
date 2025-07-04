import { Users, User } from 'lucide-react';
import ScoreSection from './ScoreSection';

// Team Card Component
const TeamCard = ({ team, index, games, getTeamScores, getPlayerScores }) => (
  <div className={`border-2 rounded-lg p-4 ${
    index === 0 ? 'border-yellow-400 bg-yellow-50' :
    index === 1 ? 'border-gray-400 bg-gray-50' :
    index === 2 ? 'border-amber-600 bg-amber-50' :
    'border-gray-200 bg-white'
  }`}>
    {/* Team Header */}
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center space-x-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
          index === 0 ? 'bg-yellow-400 text-white' :
          index === 1 ? 'bg-gray-400 text-white' :
          index === 2 ? 'bg-amber-600 text-white' :
          'bg-gray-200 text-gray-700'
        }`}>
          {index + 1}
        </div>
        <h4 className="font-semibold text-gray-800">{team.name}</h4>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-blue-600">{team.totalScore}</p>
        <p className="text-xs text-gray-500">Total Points</p>
      </div>
    </div>

    {/* Score Breakdown */}
    <div className="space-y-2 text-sm">
      {/* Team Scores */}
      {getTeamScores(team.id).length > 0 && (
        <ScoreSection 
          title="Team Scores"
          icon={Users}
          scores={getTeamScores(team.id)}
          total={team.teamScoreTotal}
          games={games}
          bgColor="bg-blue-50"
          textColor="text-blue-800"
          totalColor="text-blue-600"
        />
      )}

      {/* Individual Player Scores */}
      {getPlayerScores(team.id).length > 0 && (
        <ScoreSection 
          title="Individual Scores"
          icon={User}
          scores={getPlayerScores(team.id)}
          total={team.playerScoreTotal}
          games={games}
          bgColor="bg-green-50"
          textColor="text-green-800"
          totalColor="text-green-600"
          showPlayerName={true}
        />
      )}

      {/* Calculation Check */}
      <div className="border-t pt-2 mt-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Calculation Check:</span>
          <span>
            {team.teamScoreTotal} + {team.playerScoreTotal} = {team.totalScore}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default TeamCard;