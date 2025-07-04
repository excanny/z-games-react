import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User } from 'lucide-react';

// Games Overview Component
const GamesOverview = ({ games, getScoresByGame }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <Gamepad2 className="w-6 h-6 mr-2 text-green-500" />
      Games Overview
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {games.map(game => {
        const gameScores = getScoresByGame(game.id);
        return (
          <div key={game.id} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800">{game.name}</h3>
            <p className="text-sm text-gray-600">Max Score: {game.maxScore}</p>
            <p className="text-sm text-blue-600 font-medium">
              {gameScores.length} scores recorded
            </p>
          </div>
        );
      })}
    </div>
  </div>
);

export default GamesOverview;