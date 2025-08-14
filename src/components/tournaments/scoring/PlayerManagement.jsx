import { useState } from 'react';
import { User, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../../config';

// Animal avatars with emojis
const ANIMAL_AVATARS = [
  { id: 'Lion', emoji: '🦁', name: 'Lion' },
  { id: 'Tiger', emoji: '🐯', name: 'Tiger' },
  { id: 'Bear', emoji: '🐻', name: 'Bear' },
  { id: 'Wolf', emoji: '🐺', name: 'Wolf' },
  { id: 'Fox', emoji: '🦊', name: 'Fox' },
  { id: 'Cat', emoji: '🐱', name: 'Cat' },
  { id: 'Dog', emoji: '🐶', name: 'Dog' },
  { id: 'Rabbit', emoji: '🐰', name: 'Rabbit' },
  { id: 'Monkey', emoji: '🐵', name: 'Monkey' },
  { id: 'Horse', emoji: '🐴', name: 'Horse' },
  { id: 'Turtle', emoji: '🐢', name: 'Turtle' },
  { id: 'Eagle', emoji: '🦅', name: 'Eagle' },
  { id: 'Shark', emoji: '🦈', name: 'Shark' },
  { id: 'Frog', emoji: '🐸', name: 'Frog' },
  { id: 'Chameleon', emoji: '🦎', name: 'Chameleon' },
  { id: 'Whale', emoji: '🐋', name: 'Whale' },
  { id: 'Bison', emoji: '🦬', name: 'Bison' },
  { id: 'Moose', emoji: '🫎', name: 'Moose' },
  { id: 'Goose', emoji: '🪿', name: 'Goose' },
  { id: 'Beaver', emoji: '🦫', name: 'Beaver' },
  { id: 'Human', emoji: '👤', name: 'Human' },
  { id: 'Panda', emoji: '🐼', name: 'Panda' },
  { id: 'Koala', emoji: '🐨', name: 'Koala' },
  { id: 'Elephant', emoji: '🐘', name: 'Elephant' },
  { id: 'Giraffe', emoji: '🦒', name: 'Giraffe' },
  { id: 'Zebra', emoji: '🦓', name: 'Zebra' },
  { id: 'Unicorn', emoji: '🦄', name: 'Unicorn' },
  { id: 'Dragon', emoji: '🐉', name: 'Dragon' },
  { id: 'Penguin', emoji: '🐧', name: 'Penguin' },
  { id: 'Octopus', emoji: '🐙', name: 'Octopus' }
];

// Player Management Component
const PlayerManagement = ({ teams, onAddPlayer, onRemovePlayer, onUpdatePlayer, tournamentId }) => {
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAvatar, setNewPlayerAvatar] = useState('');
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editPlayerName, setEditPlayerName] = useState('');
  const [editPlayerAvatar, setEditPlayerAvatar] = useState('');
  
  // Separate loading states for different operations
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [editingLoadingStates, setEditingLoadingStates] = useState({});
  const [deletingLoadingStates, setDeletingLoadingStates] = useState({});
  
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const selectedTeam = teams.find(team => team.id === selectedTeamId);

  // Get used avatars in the selected team to avoid duplicates
  const usedAvatars = selectedTeam ? selectedTeam.players.map(p => p.avatar) : [];
  const availableAvatars = ANIMAL_AVATARS.filter(avatar => !usedAvatars.includes(avatar.id));

  // Notification functions
  const playerAddedNotification = () => toast.success('Player added successfully!');
  const playerUpdatedNotification = () => toast.success('Player updated successfully!');
  const playerRemovedNotification = () => toast.success('Player removed successfully!');
  const errorNotification = (message) => toast.error(message);

  // API call to add player (keeping exactly as original)
  const addPlayerToAPI = async (teamId, playerData) => {
    try {
      const response = await fetch(`${config.baseUrl}/api/tournaments/${tournamentId}/teams/${teamId}/players`, {
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

  // API call to update player (keeping exactly as original but removing debugger)
  const updatePlayerInAPI = async (teamId, playerId, playerData) => {
    try {
      const response = await fetch(`${config.baseUrl}/api/tournaments/${tournamentId}/teams/${teamId}/players/${playerId}`, {
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

  // API call to remove player (keeping exactly as original)
  const removePlayerFromAPI = async (teamId, playerId) => {
    try {
      const response = await fetch(`${config.baseUrl}/api/tournaments/${tournamentId}/teams/${teamId}/players/${playerId}`, {
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
      setIsAddingPlayer(true);
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
          id: apiResult.id || Date.now().toString(),
          name: newPlayer.name,
          avatar: newPlayer.avatar
        });

        // Show success notification
        playerAddedNotification();

        // Reset form
        setNewPlayerName('');
        setNewPlayerAvatar('');
      } catch (error) {
        const errorMessage = 'Failed to add player. Please try again.';
        setError(errorMessage);
        errorNotification(errorMessage);
      } finally {
        setIsAddingPlayer(false);
      }
    }
  };

  const handleEditPlayer = (player) => {
    debugger
    setEditingPlayer(player.id);
    setEditPlayerName(player.name);
    setEditPlayerAvatar(player.avatar);
    setError(''); // Clear any existing errors
  };

  // Check if player data has changed from original
  const hasPlayerDataChanged = (playerId) => {
    if (!editingPlayer || editingPlayer !== playerId) return false;
    const originalPlayer = selectedTeam?.players.find(p => p.id === playerId);
    if (!originalPlayer) return false;
    
    return editPlayerName.trim() !== originalPlayer.name || 
           editPlayerAvatar !== originalPlayer.avatar;
  };

  const handleSavePlayer = async (playerId) => {
    debugger
    if (editPlayerName.trim() && editPlayerAvatar) {
      setEditingLoadingStates(prev => ({ ...prev, [playerId]: true }));
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

        // Show success notification
        playerUpdatedNotification();

        // Reset editing state
        setEditingPlayer(null);
        setEditPlayerName('');
        setEditPlayerAvatar('');
      } catch (error) {
        const errorMessage = 'Failed to update player. Please try again.';
        setError(errorMessage);
        errorNotification(errorMessage);
      } finally {
        setEditingLoadingStates(prev => ({ ...prev, [playerId]: false }));
      }
    }
  };

  const handleRemovePlayer = async (teamId, playerId) => {
    setDeletingLoadingStates(prev => ({ ...prev, [playerId]: true }));
    setError('');

    try {
      // Call API to remove player
      await removePlayerFromAPI(teamId, playerId);
      
      // Update local state using the callback
      onRemovePlayer(teamId, playerId);

      // Show success notification
      playerRemovedNotification();
      setShowDeleteConfirm(null);
    } catch (error) {
      const errorMessage = 'Failed to remove player. Please try again.';
      setError(errorMessage);
      errorNotification(errorMessage);
    } finally {
      setDeletingLoadingStates(prev => ({ ...prev, [playerId]: false }));
    }
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
    setEditPlayerName('');
    setEditPlayerAvatar('');
    setError(''); // Clear any errors when canceling
  };

  const getAvatarById = (avatarId) => {
    return ANIMAL_AVATARS.find(avatar => avatar.id === avatarId);
  };

  // Get available avatars for editing (include current avatar)
  const getAvailableAvatarsForEdit = (currentAvatar) => {
    if (!selectedTeam) return ANIMAL_AVATARS;
    
    const otherUsedAvatars = selectedTeam.players
      .filter(p => p.id !== editingPlayer)
      .map(p => p.avatar);
    
    return ANIMAL_AVATARS.filter(avatar => 
      !otherUsedAvatars.includes(avatar.id) || avatar.id === currentAvatar
    );
  };

  const confirmDelete = (teamId, playerId, playerName) => {
    setShowDeleteConfirm({ teamId, playerId, playerName });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Confirm Delete</h4>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove "{showDeleteConfirm.playerName}" from the team?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={deletingLoadingStates[showDeleteConfirm.playerId]}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemovePlayer(showDeleteConfirm.teamId, showDeleteConfirm.playerId)}
                disabled={deletingLoadingStates[showDeleteConfirm.playerId]}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {deletingLoadingStates[showDeleteConfirm.playerId] ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Player'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Selection */}
      <div>
        <label className="block text-sm font-medium text-orange-700 mb-2">Select Team</label>
        <select
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          disabled={isAddingPlayer}
          className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Choose a team...</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
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
              disabled={isAddingPlayer}
              className="px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <select
              value={newPlayerAvatar}
              onChange={(e) => setNewPlayerAvatar(e.target.value)}
              disabled={isAddingPlayer}
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
            disabled={!newPlayerName.trim() || !newPlayerAvatar || isAddingPlayer}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isAddingPlayer ? (
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
            const isEditing = editingPlayer === player.id;
            const isEditingLoading = editingLoadingStates[player.id];
            const isDeletingLoading = deletingLoadingStates[player.id];
            
            return (
              <div key={player.id} className="bg-white/80 rounded-lg p-3 border border-orange-200/50">
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editPlayerName}
                        onChange={(e) => setEditPlayerName(e.target.value)}
                        disabled={isEditingLoading}
                        className="px-2 py-1 border border-orange-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
                      />
                      <select
                        value={editPlayerAvatar}
                        onChange={(e) => setEditPlayerAvatar(e.target.value)}
                        disabled={isEditingLoading}
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
                        onClick={() => handleSavePlayer(player.id)}
                        disabled={isEditingLoading || !editPlayerName.trim() || !hasPlayerDataChanged(player.id)}
                        className="p-1 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title="Save changes"
                      >
                        {isEditingLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isEditingLoading}
                        className="p-1 text-gray-600 hover:text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title="Cancel edit"
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
                        disabled={isEditingLoading || isDeletingLoading || editingPlayer !== null}
                        className="p-1 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title="Edit player"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(selectedTeamId, player.id, player.name)}
                        disabled={isEditingLoading || isDeletingLoading || editingPlayer !== null}
                        className="p-1 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title="Remove player"
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

      {/* Toast Container with responsive positioning */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="!mt-16 sm:!mt-4"
        toastClassName="!text-sm sm:!text-base"
      />
    </div>
  );
};

export default PlayerManagement;