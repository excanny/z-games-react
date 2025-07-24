import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User, Star } from 'lucide-react';

const PlayerCard = ({ player, teamRank }) => {
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
    <div className="bg-white rounded-md p-3 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getRankIcon(teamRank)}
          <div>
            <span className="font-medium text-gray-800">{player.name}</span>
            {player.animal && (
              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {player.animal.name}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">{player.totalScore}</div>
          <div className="text-xs text-gray-500">Total Score</div>
        </div>
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div className="bg-green-50 rounded p-2 text-center">
          <div className="text-green-800 font-medium">{player.gameScores?.length || 0}</div>
          <div className="text-green-600 text-xs">Games</div>
        </div>
        <div className="bg-purple-50 rounded p-2 text-center">
          <div className="text-purple-800 font-medium">
            {player.gameScores?.length > 0 ? Math.round(player.totalScore / player.gameScores.length) : 0}
          </div>
          <div className="text-purple-600 text-xs">Avg</div>
        </div>
      </div>

      {/* Game Performance */}
      <div className="space-y-2">
        {player.gameScores && player.gameScores.map((game, gameIndex) => (
          <div key={game.gameId} className="flex items-center justify-between bg-gray-50 rounded p-2">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                {gameIndex + 1}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {game.gameName || `Game ${gameIndex + 1}`}
                </div>
                <div className="text-xs text-gray-500 flex items-center space-x-2">
                  <span>Entries: {game.totalEntries}</span>
                  {game.deductions > 0 && (
                    <span className="text-red-500">-{game.deductions}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-800">{game.totalScore}</div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeaderboardCard = ({ team, gameNamesMap }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">{rank}</div>;
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getRankIcon(team.rank)}
          <div>
            <h3 className="font-semibold text-gray-800">{team.name}</h3>
            <p className="text-sm text-gray-600">{team.players?.length || 0} players</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{team.totalScore}</div>
          <div className="text-xs text-gray-500">Total Score</div>
        </div>
      </div>
      
      {/* Score Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="bg-green-100 rounded-md p-2">
          <div className="text-green-800 font-medium">{team.playersScore}</div>
          <div className="text-green-600 text-xs">Players Score</div>
        </div>
        <div className="bg-purple-100 rounded-md p-2">
          <div className="text-purple-800 font-medium">{team.teamOnlyScore}</div>
          <div className="text-purple-600 text-xs">Team Bonus</div>
        </div>
      </div>

      {/* Deductions Info */}
      {team.totalDeductions > 0 && (
        <div className="bg-red-50 rounded-md p-2 mb-4 text-sm">
          <div className="text-red-800 font-medium">-{team.totalDeductions}</div>
          <div className="text-red-600 text-xs">Total Deductions</div>
        </div>
      )}

      {/* Team Players Ranked */}
      <div className="border-t pt-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Users className="w-4 h-4 mr-1" />
          Team Players (Ranked)
        </h4>
        <div className="space-y-3">
          {team.playersRanked && team.playersRanked.map((player, playerIndex) => (
            <PlayerCard 
              key={player.id} 
              player={player} 
              teamRank={playerIndex + 1}
              gameNamesMap={gameNamesMap}
            />
          ))}
        </div>
      </div>

      {/* Game Breakdown */}
      <div className="border-t pt-3 mt-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Gamepad2 className="w-4 h-4 mr-1" />
          Team Game Performance
        </h4>
        <div className="space-y-2">
          {team.gameScores && team.gameScores.map((game, gameIndex) => (
            <div key={game.gameId} className="flex items-center justify-between bg-gray-50 rounded-md p-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  {gameIndex + 1}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {game.gameName}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center space-x-2">
                    <span>Entries: {game.totalEntries}</span>
                    {game.deductions > 0 && (
                      <span className="text-red-500">Deductions: {game.deductions}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800">{game.totalScore}</div>
                <div className="text-xs text-gray-500">Team Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Leaderboard = ({ tournamentData }) => {
  // Create game names mapping from selectedGames
  const gameNamesMap = tournamentData?.selectedGames?.reduce((acc, game) => {
    acc[game.game_id] = game.name;
    return acc;
  }, {}) || {};

  // Transform the data to include ranked players within each team
  const transformedLeaderboard = () => {
    const teams = tournamentData?.teams || [];
    
    return teams.map(team => {
      // Sort players by total score (descending) and add team rank
      const playersRanked = [...(team.players || [])].sort((a, b) => b.totalScore - a.totalScore);

      return {
        ...team,
        playersRanked: playersRanked
      };
    }).sort((a, b) => a.rank - b.rank); // Sort teams by rank
  };

  const transformedData = transformedLeaderboard();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Medal className="w-6 h-6 mr-2 text-yellow-500" />
        Team Leaderboard with Player Rankings
      </h2>
      
      <div className="space-y-4">
        {transformedData.map((team, index) => (
          <LeaderboardCard 
            key={team.id} 
            team={team} 
            index={index} 
            gameNamesMap={gameNamesMap}
          />
        ))}
      </div>
    </div>
  );
};

// Sample usage component with proper tournamentData definition
const PlayerLeaderboardDashboard = ({ tournamentData }) => {


  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tournament Dashboard</h1>
        <p className="text-gray-600">Tournament: {tournamentData.name}</p>
        <div className="mt-2 text-sm text-gray-500">
          Status: <span className={`px-2 py-1 rounded text-xs ${
            tournamentData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {tournamentData.status}
          </span>
        </div>
      </div>

      <Leaderboard 
        tournamentData={tournamentData}
      />
    </div>
  );
};

export default PlayerLeaderboardDashboard;