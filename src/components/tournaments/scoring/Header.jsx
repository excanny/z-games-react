import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User } from 'lucide-react';
import TabButton from './TabButton';

const Header = ({ activeTab, setActiveTab }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-gray-800">Tournament Scoring System</h1>
      </div>
      <div className="flex space-x-2">
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