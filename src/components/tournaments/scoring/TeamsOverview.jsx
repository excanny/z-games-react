import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User } from 'lucide-react';

// Teams Overview Component
const TeamsOverview = ({ tournamentData }) => {
  const teams = tournamentData?.teams || [];
  const playerRankings = tournamentData?.leaderboard?.overallLeaderboard?.playerRankings || [];
  const teamRankings = tournamentData?.leaderboard?.overallLeaderboard?.teamRankings || [];
  
  const getPlayerScoreCount = (playerId) => {
    const player = playerRankings.find(p => p.playerId === playerId);
    return player?.gameBreakdown?.length || 0;
  };

  const getTeamTotalScore = (teamId) => {
    const team = teamRankings.find(t => t.teamId === teamId);
    return team?.totalScore || 0;
  };

  const getTeamRank = (teamId) => {
    const team = teamRankings.find(t => t.teamId === teamId);
    return team?.overallRank || 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Users className="w-6 h-6 mr-2 text-purple-500" />
        Teams & Players
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map(team => {
          const teamRank = getTeamRank(team._id);
          const teamScore = getTeamTotalScore(team._id);
          
          return (
            <div key={team._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{team.name}</h3>
                {teamRank > 0 && (
                  <div className="flex items-center space-x-1">
                    {teamRank === 1 && <Trophy className="w-4 h-4 text-yellow-500" />}
                    {teamRank === 2 && <Medal className="w-4 h-4 text-gray-400" />}
                    {teamRank === 3 && <Medal className="w-4 h-4 text-orange-600" />}
                    <span className="text-sm font-medium text-gray-600">#{teamRank}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {team.players.map((player) => {
                  const scoreCount = getPlayerScoreCount(player._id);
                  const playerRanking = playerRankings.find(p => p.playerId === player._id);
                  const playerScore = playerRanking?.totalScore || 0;
                  
                  return (
                    <div key={player._id} className="flex justify-between items-center bg-white p-2 rounded border">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{player.name}</span>
                        {player.animalAvatar && (
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                            {player.animalAvatar.name}
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
              </div>
            </div>
          );
        })}
      </div>
      {teams.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No teams created for this game session</p>
        </div>
      )}
    </div>
  );
};

export default TeamsOverview;