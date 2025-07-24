import React from "react";
import { Link } from "react-router-dom";
import zGameLogo from '../assets/Z Games logo with illustration.png';
import { Trophy, Wifi, WifiOff, ArrowLeft } from "lucide-react"; // Adjust if you use a different icon library

const ScoreboardHeader = ({ isConnected }) => (
  <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div className="max-w-6xl mx-auto px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={zGameLogo}
              alt="Z Games Logo" 
              className="w-24 h-20 object-contain"
            />
            <Trophy className="w-8 h-8 text-blue-600 hidden" />
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Scoreboard</h1>
              <span className="text-sm text-slate-500">Live Rankings</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            isConnected 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {isConnected ? 'Live' : 'Offline'}
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default ScoreboardHeader;