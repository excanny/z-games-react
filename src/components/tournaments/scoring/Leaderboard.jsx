import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User, Star } from 'lucide-react';

const PlayerCard = ({ player, teamRank, gameNamesMap }) => {
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

  const getPerformanceColor = (rating) => {
    if (rating >= 4) return 'text-green-600 bg-green-100';
    if (rating >= 3) return 'text-blue-600 bg-blue-100';
    if (rating >= 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-md p-3 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getRankIcon(teamRank)}
          <div>
            <span className="font-medium text-gray-800">{player.name}</span>
            {player.animalAvatar && (
              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {player.animalAvatar.name}
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
          <div className="text-green-800 font-medium">{player.gamesPlayed}</div>
          <div className="text-green-600 text-xs">Games</div>
        </div>
        <div className="bg-purple-50 rounded p-2 text-center">
          <div className="text-purple-800 font-medium">
            {player.gamesPlayed > 0 ? Math.round(player.totalScore / player.gamesPlayed) : 0}
          </div>
          <div className="text-purple-600 text-xs">Avg</div>
        </div>
      </div>

      {/* Game Performance */}
      <div className="space-y-2">
        {player.gameBreakdown && player.gameBreakdown.map((game, gameIndex) => (
          <div key={game.gameId} className="flex items-center justify-between bg-gray-50 rounded p-2">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                {gameIndex + 1}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {gameNamesMap[game.gameId] || `Game ${gameIndex + 1}`}
                </div>
                <div className="text-xs text-gray-500 flex items-center space-x-2">
                  <span>Rank #{game.gameRank}</span>
                  {game.performanceRating && (
                    <span className={`px-1 py-0.5 rounded text-xs ${getPerformanceColor(game.performanceRating)}`}>
                      {game.performanceRating}★
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-800">{game.score}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeaderboardCard = ({ team, index, gameNamesMap }) => {
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
          {getRankIcon(team.overallRank)}
          <div>
            <h3 className="font-semibold text-gray-800">{team.name}</h3>
            <p className="text-sm text-gray-600">{team.gamesPlayed} games played</p>
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
          <div className="text-green-800 font-medium">{team.totalIndividualPlayerScore}</div>
          <div className="text-green-600 text-xs">Individual Score</div>
        </div>
        <div className="bg-purple-100 rounded-md p-2">
          <div className="text-purple-800 font-medium">{team.totalTeamBonusScore}</div>
          <div className="text-purple-600 text-xs">Team Bonus</div>
        </div>
      </div>

      {/* Team Players Ranked */}
      <div className="border-t pt-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Users className="w-4 h-4 mr-1" />
          Team Players (Ranked)
        </h4>
        <div className="space-y-3">
          {team.playersRanked && team.playersRanked.map((player, playerIndex) => (
            <PlayerCard 
              key={player._id} 
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
          Game Performance
        </h4>
        <div className="space-y-2">
          {team.gameBreakdown && team.gameBreakdown.map((game, gameIndex) => (
            <div key={game.gameId} className="flex items-center justify-between bg-gray-50 rounded-md p-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  {gameIndex + 1}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {gameNamesMap[game.gameId] || `Game ${gameIndex + 1}`}
                  </div>
                  <div className="text-xs text-gray-500">Rank #{game.gameRank}</div>
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

const Leaderboard = ({ leaderboard, tournamentData }) => {
  // Create game names mapping from selectedGames
  const gameNamesMap = tournamentData?.selectedGames?.reduce((acc, game) => {
    acc[game._id] = game.name;
    return acc;
  }, {}) || {};

  const getPlayerDetails = (playerId) => {
    if (!tournamentData?.teams) return null;
    
    for (const team of tournamentData.teams) {
      const player = team.players.find(p => p._id === playerId);
      if (player) {
        return { ...player, teamName: team.name };
      }
    }
    return null;
  };

  const getPlayerRankings = (playerId) => {
    return tournamentData?.leaderboard?.overallLeaderboard?.playerRankings?.find(
      p => p.playerId === playerId
    );
  };

  // Transform the data to include ranked players within each team
  const transformedLeaderboard = () => {
    const teamLeaderboard = tournamentData?.leaderboard?.overallLeaderboard?.teamRankings || leaderboard;
    
    return teamLeaderboard.map(team => {
      const teamDetails = tournamentData?.teams?.find(t => t._id === team.teamId) || {};
      
      // Get player rankings for this team and sort by total score
      const playersWithRankings = teamDetails.players?.map(player => {
        const playerRankings = getPlayerRankings(player._id);
        return {
          ...player,
          totalScore: playerRankings?.totalScore || 0,
          gamesPlayed: playerRankings?.gamesPlayed || 0,
          gameBreakdown: playerRankings?.gameBreakdown || [],
          achievements: playerRankings?.achievements || []
        };
      }).sort((a, b) => b.totalScore - a.totalScore) || [];

      return {
        _id: team.teamId,
        name: teamDetails.name || `Team ${team.teamId}`,
        totalScore: team.totalScore,
        overallRank: team.overallRank,
        gamesPlayed: team.gamesPlayed,
        totalIndividualPlayerScore: team.totalIndividualPlayerScore,
        totalTeamBonusScore: team.totalTeamBonusScore,
        players: teamDetails.players || [],
        playersRanked: playersWithRankings,
        gameBreakdown: team.gameBreakdown
      };
    });
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
            key={team._id} 
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
      </div>

      <Leaderboard 
        tournamentData={tournamentData}
      />
    </div>
  );
};

export default PlayerLeaderboardDashboard;