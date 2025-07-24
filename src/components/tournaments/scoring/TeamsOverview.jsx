import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User } from 'lucide-react';

// Teams Overview Component
const TeamsOverview = ({ tournamentData }) => {
  const teams = tournamentData?.teams || [];
  
  const getPlayerScoreCount = (player) => {
    return player?.gameScores?.length || 0;
  };

  const getTeamTotalScore = (team) => {
    return team?.totalScore || 0;
  };

  const getTeamRank = (team) => {
    return team?.rank || 0;
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Medal className="w-4 h-4 text-orange-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">{rank}</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Users className="w-6 h-6 mr-2 text-purple-500" />
        Teams & Players
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map(team => {
          const teamRank = getTeamRank(team);
          const teamScore = getTeamTotalScore(team);
          
          return (
            <div key={team.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{team.name}</h3>
                {teamRank > 0 && (
                  <div className="flex items-center space-x-1">
                    {getRankIcon(teamRank)}
                    <span className="text-sm font-medium text-gray-600">#{teamRank}</span>
                  </div>
                )}
              </div>
              
              {/* Team Score Breakdown */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="bg-green-50 rounded p-2 text-center">
                  <div className="text-green-800 font-medium">{team.playersScore || 0}</div>
                  <div className="text-green-600 text-xs">Players Score</div>
                </div>
                <div className="bg-purple-50 rounded p-2 text-center">
                  <div className="text-purple-800 font-medium">{team.teamOnlyScore || 0}</div>
                  <div className="text-purple-600 text-xs">Team Bonus</div>
                </div>
              </div>

              {/* Deductions if any */}
              {team.totalDeductions > 0 && (
                <div className="bg-red-50 rounded p-2 mb-3 text-sm text-center">
                  <div className="text-red-800 font-medium">-{team.totalDeductions}</div>
                  <div className="text-red-600 text-xs">Deductions</div>
                </div>
              )}
              
              <div className="space-y-2">
                {team.players?.map((player) => {
                  const scoreCount = getPlayerScoreCount(player);
                  const playerScore = player?.totalScore || 0;
                  
                  return (
                    <div key={player.id} className="flex justify-between items-center bg-white p-2 rounded border">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{player.name}</span>
                        {player.animal && (
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                            {player.animal.name}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">{playerScore} pts</div>
                        <div className="text-xs text-gray-500">{scoreCount} games</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Team Total:</span>
                  <span className="text-lg font-bold text-blue-600">{teamScore} points</span>
                </div>
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                  <span>Games Played:</span>
                  <span>{team.gameScores?.length || 0}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {teams.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No teams created for this tournament</p>
        </div>
      )}
    </div>
  );
};

// Sample usage component with the actual API data structure
const TeamsOverviewDashboard = ({tournamentData}) => {


  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tournament Teams Overview</h1>
        <p className="text-gray-600">Tournament: {tournamentData.name}</p>
        <div className="mt-2 text-sm text-gray-500">
          Status: <span className={`px-2 py-1 rounded text-xs ${
            tournamentData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {tournamentData.status}
          </span>
        </div>
      </div>

      <TeamsOverview tournamentData={tournamentData} />
    </div>
  );
};

export default TeamsOverviewDashboard;