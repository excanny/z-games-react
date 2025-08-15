import {Link} from "react-router-dom";
import { Users, Gamepad2, Clock } from "lucide-react";

const TournamentInfo = ({ tournamentData }) => {
  if (!tournamentData) return null;

  const {
    tournamentName,
    totalTeams = 0,
    selectedGames,
    lastUpdated,
    updatedAt,
  } = tournamentData;

  const formattedTime = new Date(lastUpdated || updatedAt).toLocaleTimeString();

  return (
    <div className="text-center mb-8 relative">
      <Link 
        to="/games" 
        className="absolute top-0 right-0 text-xs text-slate-500 hover:text-slate-700 transition-colors"
      >
        All Games Overview
      </Link>
      <h2 className="text-4xl font-bold text-slate-800 mb-2">{tournamentName}</h2>
      <div className="flex items-center justify-center gap-4 text-slate-600">
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {totalTeams} Teams
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Gamepad2 className="w-4 h-4" />
          {selectedGames?.count} Games
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          Last Updated: {formattedTime}
        </span>
      </div>
    </div>
  );
};

export default TournamentInfo;