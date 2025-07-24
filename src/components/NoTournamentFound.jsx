import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, RefreshCw, ArrowLeft } from 'lucide-react';

const NoTournamentFound = () => {
  const [loading, setLoading] = useState(false);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 500); // Optional delay for better UX
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-slate-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">No Active Game Session</h2>
        <p className="text-slate-600 mb-6">
          There's no game session running right now. Contact your game master to start a new game session.
        </p>

        <div className="space-y-3">
          <button 
            onClick={handleReload} 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Checking...' : 'Check Again'}
          </button>

          <Link 
            to="/" 
            className="w-full bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <p className="text-xs text-slate-400 mt-6">
          Last checked: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default NoTournamentFound;
