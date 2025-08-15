import { Handshake, Users, Trophy, Gamepad2 } from 'lucide-react';

const TournamentStatsCards = ({ tournamentData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Total Teams */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total Teams</p>
            <p className="text-3xl font-bold text-slate-800">
              {tournamentData.totalTeams?.toLocaleString?.()}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Handshake className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Total Players */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total Players</p>
            <p className="text-3xl font-bold text-slate-800">
              {tournamentData.totalPlayers?.toLocaleString?.()}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Highest Scores */}
      {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Highest Scores</p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <div className="mt-3 text-sm text-slate-700 space-y-1">
          <p>
            <span className="font-semibold">Team:</span>{' '}
            {tournamentData.highestTeam?.name}{' '}
            <span className="font-bold">
              ({tournamentData.highestTeam?.score?.toLocaleString?.()})
            </span>
          </p>
          <p>
            <span className="font-semibold">Player:</span>{' '}
            {tournamentData.highestPlayer?.name}{' '}
            <span className="font-bold">
              ({tournamentData.highestPlayer?.score?.toLocaleString?.()})
            </span>
          </p>
        </div>
      </div> */}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-slate-600 text-sm font-medium">Highest Scores</p>
    </div>
    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
      <Trophy className="w-6 h-6 text-yellow-600" />
    </div>
  </div>
  <div className="mt-3 text-sm text-slate-700 space-y-1">
    {(!tournamentData.highestTeam?.score || tournamentData.highestTeam.score === 0) && 
     (!tournamentData.highestPlayer?.score || tournamentData.highestPlayer.score === 0) ? (
      <p className="text-slate-500 italic">No scores yet</p>
    ) : (
      <>
        <p>
          <span className="font-semibold">Team:</span>{' '}
          {tournamentData.highestTeam?.score > 0 ? (
            <>
              {tournamentData.highestTeam?.name}{' '}
              <span className="font-bold">
                ({tournamentData.highestTeam?.score?.toLocaleString?.()})
              </span>
            </>
          ) : (
            <span className="text-slate-500 italic">No team scores yet</span>
          )}
        </p>
        <p>
          <span className="font-semibold">Player:</span>{' '}
          {tournamentData.highestPlayer?.score > 0 ? (
            <>
              {tournamentData.highestPlayer?.name}{' '}
              <span className="font-bold">
                ({tournamentData.highestPlayer?.score?.toLocaleString?.()})
              </span>
            </>
          ) : (
            <span className="text-slate-500 italic">No player scores yet</span>
          )}
        </p>
      </>
    )}
  </div>
</div>

      {/* Games */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Games</p>
            <p className="text-3xl font-bold text-slate-800">
              {tournamentData.selectedGames?.count?.toLocaleString?.()}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentStatsCards;
