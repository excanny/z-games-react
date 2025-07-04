import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User } from 'lucide-react';
import LeaderboardCard from "./LeaderboardCard";


const Leaderboard = ({ leaderboard }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <Medal className="w-6 h-6 mr-2 text-yellow-500" />
      Team Leaderboard
    </h2>
    
    <div className="space-y-4">
      {leaderboard.map((team, index) => (
        <LeaderboardCard key={team.id} team={team} index={index} />
      ))}
    </div>
  </div>
);

export default Leaderboard;