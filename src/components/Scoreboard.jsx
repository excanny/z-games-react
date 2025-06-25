import React from 'react';

const Scoreboard = () => {
  const players = [
    { name: 'Player Alpha', points: 2450, rank: 1, color: 'text-yellow-500' },
    { name: 'Player Beta', points: 2100, rank: 2, color: 'text-gray-400' },
    { name: 'Player Gamma', points: 1850, rank: 3,  color: 'text-amber-600' },
    { name: 'Player Delta', points: 1600, rank: 4,  color: 'text-blue-500' },
    { name: 'Player Echo', points: 1350, rank: 5, color: 'text-blue-500' }
  ];

  const getRankDisplay = (rank) => {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}.`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8 px-4 font-inter">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="text-6xl font-black text-slate-800">Z</div>
            <div className="text-6xl font-black text-blue-600">GAMES</div>
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full mx-auto mb-6"></div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
            {/* <Trophy className="text-blue-600" size={36} /> */}
            Scoreboard
          </h1>
          <p className="text-lg text-slate-600 font-light italic">Current Tournament Rankings</p>
        </div>

        {/* Scoreboard Card */}
        <div className="bg-white rounded-3xl shadow-soft border border-slate-200/60 overflow-hidden">
          
          {/* Card Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">Live Rankings</h2>
            <div className="text-center text-slate-300 text-sm mt-2">Updated in real-time</div>
          </div>

          {/* Rankings List */}
          <div className="p-8">
            <div className="space-y-4">
              {players.map((player) => {
                const Icon = player.icon;
                const isTopThree = player.rank <= 3;
                
                return (
                  <div 
                    key={player.name}
                    className={`flex items-center justify-between p-6 rounded-xl transition-all duration-300 hover:shadow-soft ${
                      isTopThree 
                        ? 'bg-gradient-to-r from-blue-50 to-slate-50 border-2 border-blue-100' 
                        : 'bg-slate-50/50 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {/* Rank and Icon */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-slate-700 w-12 text-center">
                          {getRankDisplay(player.rank)}
                        </span>
                        {/* {isTopThree && (
                          <Icon className={`${player.color} animate-pulse`} size={24} />
                        )} */}
                      </div>
                      
                      {/* Player Info */}
                      <div>
                        <div className={`text-xl font-bold ${isTopThree ? 'text-slate-800' : 'text-slate-700'}`}>
                          {player.name}
                        </div>
                        {isTopThree && (
                          <div className="text-sm text-slate-500 font-medium">
                            {player.rank === 1 ? 'Champion' : player.rank === 2 ? 'Runner-up' : 'Third Place'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${isTopThree ? 'text-blue-600' : 'text-slate-600'}`}>
                        {player.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500 font-medium">points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
            <div className="flex justify-between items-center text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Tournament</span>
              </div>
              <div>Last updated: Just now</div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-soft border border-slate-200/60 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
            <div className="text-slate-600 font-medium">Active Players</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft border border-slate-200/60 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2,450</div>
            <div className="text-slate-600 font-medium">Highest Score</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft border border-slate-200/60 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">Round 3</div>
            <div className="text-slate-600 font-medium">Current Round</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .font-inter { font-family: 'Inter', sans-serif; }
        .shadow-soft { box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      `}</style>
    </div>
  );
};

export default Scoreboard;