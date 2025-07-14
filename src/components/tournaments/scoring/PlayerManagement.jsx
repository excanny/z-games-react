import { useState } from 'react';
import { User, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

// Animal avatars with emojis
const ANIMAL_AVATARS = [
  { id: 'lion', emoji: '🦁', name: 'Lion' },
  { id: 'tiger', emoji: '🐅', name: 'Tiger' },
  { id: 'bear', emoji: '🐻', name: 'Bear' },
  { id: 'wolf', emoji: '🐺', name: 'Wolf' },
  { id: 'fox', emoji: '🦊', name: 'Fox' },
  { id: 'cat', emoji: '🐱', name: 'Cat' },
  { id: 'dog', emoji: '🐶', name: 'Dog' },
  { id: 'rabbit', emoji: '🐰', name: 'Rabbit' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'koala', emoji: '🐨', name: 'Koala' },
  { id: 'monkey', emoji: '🐵', name: 'Monkey' },
  { id: 'elephant', emoji: '🐘', name: 'Elephant' },
  { id: 'giraffe', emoji: '🦒', name: 'Giraffe' },
  { id: 'zebra', emoji: '🦓', name: 'Zebra' },
  { id: 'horse', emoji: '🐴', name: 'Horse' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
  { id: 'dragon', emoji: '🐉', name: 'Dragon' },
  { id: 'penguin', emoji: '🐧', name: 'Penguin' },
  { id: 'eagle', emoji: '🦅', name: 'Eagle' },
  { id: 'owl', emoji: '🦉', name: 'Owl' },
  { id: 'dolphin', emoji: '🐬', name: 'Dolphin' },
  { id: 'shark', emoji: '🦈', name: 'Shark' },
  { id: 'octopus', emoji: '🐙', name: 'Octopus' },
  { id: 'turtle', emoji: '🐢', name: 'Turtle' }
];

// Player Management Component
const PlayerManagement = ({ teams, onAddPlayer, onRemovePlayer, onUpdatePlayer, tournamentId }) => {
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAvatar, setNewPlayerAvatar] = useState('');
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editPlayerName, setEditPlayerName] = useState('');
  const [editPlayerAvatar, setEditPlayerAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedTeam = teams.find(team => team._id === selectedTeamId);

  // Get used avatars in the selected team to avoid duplicates
  const usedAvatars = selectedTeam ? selectedTeam.players.map(p => p.avatar) : [];
  const availableAvatars = ANIMAL_AVATARS.filter(avatar => !usedAvatars.includes(avatar.id));

  // API call to add player
  const addPlayerToAPI = async (teamId, playerData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tournaments/${tournamentId}/teams/${teamId}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerData.name,
          animalAvatar: playerData.avatar
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error adding player:', error);
      throw error;
    }
  };

  // API call to update player
  const updatePlayerInAPI = async (teamId, playerId, playerData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tournaments/${tournamentId}/teams/${teamId}/players/${playerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerData.name,
          animalAvatar: playerData.avatar
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating player:', error);
      throw error;
    }
  };

  // API call to remove player
  const removePlayerFromAPI = async (teamId, playerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tournaments/${tournamentId}/teams/${teamId}/players/${playerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error removing player:', error);
      throw error;
    }
  };

  const handleAddPlayer = async () => {
    if (selectedTeamId && newPlayerName.trim() && newPlayerAvatar) {
      setIsLoading(true);
      setError('');
      
      try {
        const newPlayer = {
          name: newPlayerName.trim(),
          avatar: newPlayerAvatar
        };

        // Call API to add player
        const apiResult = await addPlayerToAPI(selectedTeamId, newPlayer);
        
        // Update local state using the callback
        onAddPlayer(selectedTeamId, {
          _id: apiResult._id || Date.now().toString(),
          name: newPlayer.name,
          avatar: newPlayer.avatar
        });

        // Reset form
        setNewPlayerName('');
        setNewPlayerAvatar('');
      } catch (error) {
        setError('Failed to add player. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player._id);
    setEditPlayerName(player.name);
    setEditPlayerAvatar(player.avatar);
  };

  const handleSavePlayer = async (playerId) => {
    if (editPlayerName.trim() && editPlayerAvatar) {
      setIsLoading(true);
      setError('');

      try {
        const updatedData = {
          name: editPlayerName.trim(),
          avatar: editPlayerAvatar
        };

        // Call API to update player
        await updatePlayerInAPI(selectedTeamId, playerId, updatedData);
        
        // Update local state using the callback
        onUpdatePlayer(selectedTeamId, playerId, updatedData);

        // Reset editing state
        setEditingPlayer(null);
        setEditPlayerName('');
        setEditPlayerAvatar('');
      } catch (error) {
        setError('Failed to update player. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemovePlayer = async (teamId, playerId) => {
    setIsLoading(true);
    setError('');

    try {
      // Call API to remove player
      await removePlayerFromAPI(teamId, playerId);
      
      // Update local state using the callback
      onRemovePlayer(teamId, playerId);
    } catch (error) {
      setError('Failed to remove player. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
    setEditPlayerName('');
    setEditPlayerAvatar('');
  };

  const getAvatarById = (avatarId) => {
    return ANIMAL_AVATARS.find(avatar => avatar.id === avatarId);
  };

  // Get available avatars for editing (include current avatar)
  const getAvailableAvatarsForEdit = (currentAvatar) => {
    const otherUsedAvatars = selectedTeam ? selectedTeam.players
      .filter(p => p._id !== editingPlayer)
      .map(p => p.avatar) : [];
    return ANIMAL_AVATARS.filter(avatar => 
      !otherUsedAvatars.includes(avatar.id) || avatar.id === currentAvatar
    );
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200/60 space-y-4">
      <h3 className="text-lg font-semibold text-orange-800 flex items-center gap-2">
        <User className="w-5 h-5" />
        Player Management
      </h3>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Team Selection */}
      <div>
        <label className="block text-sm font-medium text-orange-700 mb-2">Select Team</label>
        <select
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Choose a team...</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add New Player */}
      {selectedTeamId && (
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Player name..."
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              disabled={isLoading}
              className="px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <select
              value={newPlayerAvatar}
              onChange={(e) => setNewPlayerAvatar(e.target.value)}
              disabled={isLoading}
              className="px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Choose an avatar...</option>
              {availableAvatars.map((avatar) => (
                <option key={avatar.id} value={avatar.id}>
                  {avatar.emoji} {avatar.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddPlayer}
            disabled={!newPlayerName.trim() || !newPlayerAvatar || isLoading}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Player to {selectedTeam?.name}
              </>
            )}
          </button>
        </div>
      )}

      {/* Players List */}
      {selectedTeam && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <h4 className="text-sm font-medium text-orange-700">
            Players in {selectedTeam.name} ({selectedTeam.players.length})
          </h4>
          {selectedTeam.players.map((player) => {
            const avatar = getAvatarById(player.avatar);
            return (
              <div key={player._id} className="bg-white/80 rounded-lg p-3 border border-orange-200/50">
                {editingPlayer === player._id ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editPlayerName}
                        onChange={(e) => setEditPlayerName(e.target.value)}
                        disabled={isLoading}
                        className="px-2 py-1 border border-orange-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
                      />
                      <select
                        value={editPlayerAvatar}
                        onChange={(e) => setEditPlayerAvatar(e.target.value)}
                        disabled={isLoading}
                        className="px-2 py-1 border border-orange-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
                      >
                        {getAvailableAvatarsForEdit(player.avatar).map((avatar) => (
                          <option key={avatar.id} value={avatar.id}>
                            {avatar.emoji} {avatar.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleSavePlayer(player._id)}
                        disabled={isLoading}
                        className="p-1 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                        className="p-1 text-gray-600 hover:text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{avatar?.emoji}</div>
                      <div>
                        <div className="font-medium text-orange-800">{player.name}</div>
                        <div className="text-sm text-orange-600">{avatar?.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPlayer(player)}
                        disabled={isLoading}
                        className="p-1 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemovePlayer(selectedTeamId, player._id)}
                        disabled={isLoading}
                        className="p-1 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlayerManagement;