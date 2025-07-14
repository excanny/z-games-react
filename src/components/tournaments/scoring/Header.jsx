import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User } from 'lucide-react';
import TabButton from './TabButton';

const Header = ({ activeTab, setActiveTab }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
          Tournament Scoring System
        </h1>
      </div>

      <div className="flex flex-wrap justify-center sm:justify-end gap-2">
        <TabButton 
          active={activeTab === 'scoring'} 
          onClick={() => setActiveTab('scoring')}
          icon={Plus}
          label="Score Game"
        />
        <TabButton 
          active={activeTab === 'leaderboard'} 
          onClick={() => setActiveTab('leaderboard')}
          icon={Medal}
          label="Leaderboard"
        />
        <TabButton 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
          icon={Eye}
          label="Overview"
        />
      </div>
    </div>
  </div>
);

export default Header;
