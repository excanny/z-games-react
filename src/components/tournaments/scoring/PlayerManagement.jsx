import { useState } from 'react';
import { User, Plus, Edit2, Trash2, Save, X, Users } from 'lucide-react';
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

// Mock data for demonstration
const mockTeams = [
  {
    id: 'team1',
    name: 'Thunder Hawks',
    players: [
      { id: 'p1', name: 'John Doe', avatar: 'Lion' },
      { id: 'p2', name: 'Jane Smith', avatar: 'Tiger' }
    ]
  },
  {
    id: 'team2',
    name: 'Storm Eagles',
    players: [
      { id: 'p3', name: 'Mike Johnson', avatar: 'Eagle' }
    ]
  }
];

// Player Management Component
const PlayerManagement = ({ 
  teams = mockTeams, 
  onAddPlayer = () => console.log('Add player callback'),
  onRemovePlayer = () => console.log('Remove player callback'), 
  onUpdatePlayer = () => console.log('Update player callback'), 
  tournamentId = 'demo-tournament' 
}) => {
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
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const selectedTeam = teams.find(team => team.id === selectedTeamId);

  // Notification functions with better feedback
  const playerAddedNotification = () => {
    setSuccess('Player added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };
  
  const playerUpdatedNotification = () => {
    setSuccess('Player updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };
  
  const playerRemovedNotification = () => {
    setSuccess('Player removed successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };
  
  const errorNotification = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  // Enhanced API call to add player with better error handling
  const addPlayerToAPI = async (teamId, playerData) => {
    try {
      console.log('Adding player to API:', { teamId, playerData, tournamentId });
      
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

      console.log('Add player response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Add player error response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      const result = await response.json();
      console.log('Add player success:', result);
      
      // Return the full player object with ID from the API
      return {
        id: result.id || result.player?.id || `temp-${Date.now()}`, // Fallback ID
        name: result.name || result.player?.name || playerData.name,
        avatar: result.animalAvatar || result.player?.animalAvatar || playerData.avatar
      };
    } catch (error) {
      console.error('Error adding player:', error);
      throw error;
    }
  };

  // Enhanced API call to update player with better error handling
  const updatePlayerInAPI = async (teamId, player, playerData) => {
    try {
      console.log('Updating player in API:', { teamId, playerId: player.id, playerData, tournamentId });
      
      const response = await fetch(`${config.baseUrl}/api/tournaments/${tournamentId}/teams/${teamId}/players/${player.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: player.id,
          name: playerData.name,
          animalAvatar: playerData.avatar
        })
      });

      console.log('Update player response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Update player error response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      const result = await response.json();
      console.log('Update player success:', result);
      return result;
    } catch (error) {
      console.error('Error updating player:', error);
      throw error;
    }
  };

  // API call to remove player
  const removePlayerFromAPI = async (teamId, playerId) => {
    try {
      console.log('Removing player from API:', { teamId, playerId, tournamentId });
      
      const response = await fetch(`${config.baseUrl}/api/tournaments/${tournamentId}/teams/${teamId}/players/${playerId}`, {
        method: 'DELETE',
      });

      console.log('Remove player response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Remove player error response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      console.log('Remove player success');
      return true;
    } catch (error) {
      console.error('Error removing player:', error);
      throw error;
    }
  };

  const usedAvatars = selectedTeam ? selectedTeam.players.map(p => p.avatar) : [];
  const availableAvatars = ANIMAL_AVATARS.filter(avatar => !usedAvatars.includes(avatar.id));

  const handleAddPlayer = async () => {
    if (selectedTeamId && newPlayerName.trim() && newPlayerAvatar) {
      setIsAddingPlayer(true);
      setError('');
      setSuccess('');
      
      try {
        const newPlayerData = {
          name: newPlayerName.trim(),
          avatar: newPlayerAvatar
        };

        // Call API to add player and get the complete player object back
        const addedPlayer = await addPlayerToAPI(selectedTeamId, newPlayerData);

        // Update local state using the callback with the complete player data from API
        onAddPlayer(selectedTeamId, addedPlayer);

        // Show success notification
        playerAddedNotification();

        // Reset form
        setNewPlayerName('');
        setNewPlayerAvatar('');
      } catch (error) {
        const errorMessage = `Failed to add player: ${error.message}`;
        errorNotification(errorMessage);
      } finally {
        setIsAddingPlayer(false);
      }
    }
  };

  const handleEditPlayer = (player) => {
    console.log('Starting to edit player:', player);
    setEditingPlayer(player.id);
    setEditPlayerName(player.name || '');
    
    // Handle different avatar property structures
    const avatarValue = player.avatar || player.animal?.id || player.animal || '';
    setEditPlayerAvatar(avatarValue);
    
    console.log('Edit state set to:', {
      id: player.id,
      name: player.name || '',
      avatar: avatarValue,
      playerObject: player,
      animalProperty: player.animal
    });
    setError('');
    setSuccess('');
  };

  // Fixed function to check if player data has changed
  const hasPlayerDataChanged = (playerId) => {
    if (!editingPlayer || editingPlayer !== playerId) return false;
    
    let originalPlayer = null;
    for (const team of teams) {
      const player = team.players.find(p => p.id === playerId);
      if (player) {
        originalPlayer = player;
        break;
      }
    }
    
    if (!originalPlayer) return false;
    
    // Safe comparison with fallback to empty string
    const currentName = editPlayerName ? editPlayerName.trim() : '';
    const currentAvatar = editPlayerAvatar || '';
    const originalName = originalPlayer.name || '';
    
    // Handle different avatar property structures
    const originalAvatar = originalPlayer.avatar || originalPlayer.animal?.id || originalPlayer.animal || '';
    
    const nameChanged = currentName !== originalName;
    const avatarChanged = currentAvatar !== originalAvatar;
    
    console.log('Data changed check:', {
      playerId,
      nameChanged,
      avatarChanged,
      currentName,
      originalName,
      currentAvatar,
      originalAvatar,
      originalPlayerAnimal: originalPlayer.animal,
      hasAnyChange: nameChanged || avatarChanged
    });
    
    return nameChanged || avatarChanged;
  };

  // Function to check if the current edit state is valid
  const isEditStateValid = (playerId) => {
    const hasValidName = editPlayerName && editPlayerName.trim().length > 0;
    const hasValidAvatar = editPlayerAvatar && editPlayerAvatar.length > 0;
    const hasChanges = hasPlayerDataChanged(playerId);
    
    console.log('Edit state validation:', {
      playerId,
      editPlayerName: `"${editPlayerName}"`,
      editPlayerAvatar: `"${editPlayerAvatar}"`,
      editPlayerAvatarType: typeof editPlayerAvatar,
      hasValidName,
      hasValidAvatar,
      hasChanges,
      canSave: hasValidName && hasValidAvatar && hasChanges
    });
    
    return hasValidName && hasValidAvatar && hasChanges;
  };

  const handleSavePlayer = async (playerId) => {
    console.log('Saving player:', playerId, { editPlayerName, editPlayerAvatar });
    
    if (!editPlayerName.trim() || !editPlayerAvatar) {
      errorNotification('Player name and avatar are required');
      return;
    }

    setEditingLoadingStates(prev => ({ ...prev, [playerId]: true }));
    setError('');
    setSuccess('');

    try {
      // Find the player object to get the full player data including ID
      let playerToUpdate = null;
      let teamId = null;
      
      // Find the player in any team since we might be editing from overview
      for (const team of teams) {
        const player = team.players.find(p => p.id === playerId);
        if (player) {
          playerToUpdate = player;
          teamId = team.id;
          break;
        }
      }
      
      if (!playerToUpdate || !teamId) {
        throw new Error('Player not found');
      }

      const updatedData = {
        name: editPlayerName.trim(),
        avatar: editPlayerAvatar
      };

      // Call API to update player - now passing the full player object
      await updatePlayerInAPI(teamId, playerToUpdate, updatedData);
      
      // Update local state using the callback
      onUpdatePlayer(teamId, playerId, updatedData);
    
      // Show success notification
      playerUpdatedNotification();

      // Reset editing state
      setEditingPlayer(null);
      setEditPlayerName('');
      setEditPlayerAvatar('');
    } catch (error) {
      const errorMessage = `Failed to update player: ${error.message}`;
      errorNotification(errorMessage);
    } finally {
      setEditingLoadingStates(prev => ({ ...prev, [playerId]: false }));
    }
  };

  const handleRemovePlayer = async (teamId, playerId) => {
    setDeletingLoadingStates(prev => ({ ...prev, [playerId]: true }));
    setError('');
    setSuccess('');

    try {
      // Call API to remove player
      await removePlayerFromAPI(teamId, playerId);
      
      // Update local state using the callback
      onRemovePlayer(teamId, playerId);

      // Show success notification
      playerRemovedNotification();
      setShowDeleteConfirm(null);
    } catch (error) {
      const errorMessage = `Failed to remove player: ${error.message}`;
      errorNotification(errorMessage);
    } finally {
      setDeletingLoadingStates(prev => ({ ...prev, [playerId]: false }));
    }
  };

  const handleCancelEdit = () => {
    console.log('Cancelling edit for player:', editingPlayer);
    setEditingPlayer(null);
    setEditPlayerName('');
    setEditPlayerAvatar('');
    setError('');
    setSuccess('');
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
    
    const available = ANIMAL_AVATARS.filter(avatar => 
      !otherUsedAvatars.includes(avatar.id) || avatar.id === currentAvatar
    );
    
    console.log('Available avatars for edit:', {
      currentAvatar,
      otherUsedAvatars,
      available: available.map(a => a.id)
    });
    
    return available;
  };

  const confirmDelete = (teamId, playerId, playerName) => {
    setShowDeleteConfirm({ teamId, playerId, playerName });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  // Calculate total players
  const totalPlayers = teams.reduce((total, team) => total + team.players.length, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Debug Info */}
      {/* <div className="bg-gray-100 rounded-lg p-4 text-sm">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <p>Tournament ID: {tournamentId}</p>
        <p>Selected Team ID: {selectedTeamId}</p>
        <p>Editing Player ID: {editingPlayer}</p>
        <p>Total Teams: {teams.length}</p>
        <p>Total Players: {totalPlayers}</p>
      </div> */}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Add New Player Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200/60">
        <h3 className="text-lg font-semibold text-orange-800 flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5" />
          Add New Player
        </h3>

        {/* Team Selection */}
        <div className="mb-4">
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
                {team.name} ({team.players.length} players)
              </option>
            ))}
          </select>
        </div>

        {/* Add New Player Form */}
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
      </div>

      {/* Teams Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-purple-700 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Player Management ({totalPlayers} total players)
          </h3>
        </div>

        <div className="p-6 space-y-4">
          {teams.map((team, index) => {
            // isEditing = editingPlayer && team.players.some(p => p.id === editingPlayer);
            
            return (
              <div key={team.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Team Number Circle */}
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    
                    {/* Team Info */}
                    <div>
                      <h3 className="font-semibold text-purple-700 text-lg">{team.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-purple-500 mt-1">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{team.players.length} players</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span>0 points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Players Grid */}
                {team.players.length > 0 ? (
                  <div className="gap-3">
                    {team.players.map((player) => {
                      // Handle different avatar property structures
                      const avatarId = player.avatar || player.animal?.id || player.animal || '';
                      const avatar = getAvatarById(avatarId);
                      const isPlayerEditing = editingPlayer === player.id;
                      const isEditingLoading = editingLoadingStates[player.id];
                      const isDeletingLoading = deletingLoadingStates[player.id];
                      //const hasChanges = hasPlayerDataChanged(player.id);
                      const isValidEdit = isEditStateValid(player.id);
                      
                      return (
                        <div key={player.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          {isPlayerEditing ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editPlayerName}
                                onChange={(e) => setEditPlayerName(e.target.value)}
                                disabled={isEditingLoading}
                                className="w-full px-3 py-2 text-sm border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                                placeholder="Player name"
                              />
                              <select
                                value={editPlayerAvatar}
                                onChange={(e) => {
                                  console.log('Avatar dropdown changed:', e.target.value);
                                  setEditPlayerAvatar(e.target.value);
                                }}
                                disabled={isEditingLoading}
                                className="w-full px-3 py-2 text-sm border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                              >
                                <option value="">Choose avatar...</option>
                                {getAvailableAvatarsForEdit(avatarId).map((avatar) => (
                                  <option key={avatar.id} value={avatar.id}>
                                    {avatar.emoji} {avatar.name}
                                  </option>
                                ))}
                              </select>
                              
                              {/* Debug info for editing */}
                              {/* <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                <p>Has changes: {hasChanges ? 'Yes' : 'No'}</p>
                                <p>Name valid: {(editPlayerName && editPlayerName.trim()) ? 'Yes' : 'No'} ('{editPlayerName}')</p>
                                <p>Avatar valid: {editPlayerAvatar ? 'Yes' : 'No'} ('{editPlayerAvatar}')</p>
                                <p>Can save: {isValidEdit ? 'Yes' : 'No'}</p>
                                <p className="text-blue-600">Name OR avatar can be changed independently</p>
                              </div> */}
                              
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleSavePlayer(player.id)}
                                  disabled={isEditingLoading || !isValidEdit}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  title="Save changes"
                                >
                                  {isEditingLoading ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                                      <span>Saving...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Save className="w-3 h-3" />
                                      <span>Save</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  disabled={isEditingLoading}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  title="Cancel edit"
                                >
                                  <X className="w-3 h-3" />
                                  <span>Cancel</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="text-2xl">{avatar?.emoji}</div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-800">{player.name}</div>
                                  <div className="text-xs text-gray-500">{avatar?.name}</div>
                                  {/* <div className="text-xs text-gray-400">ID: {player.id}</div> */}
                                </div>
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditPlayer(player)}
                                  disabled={isEditingLoading || isDeletingLoading || editingPlayer !== null}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  title="Edit player"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => confirmDelete(team.id, player.id, player.name)}
                                  disabled={isEditingLoading || isDeletingLoading || editingPlayer !== null}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  title="Remove player"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm">No players in this team yet</p>
                    <p className="text-xs text-gray-400 mt-1">Add players using the form above</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Confirm Delete</h4>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <span className="font-semibold">"{showDeleteConfirm.playerName}"</span> from the team? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={deletingLoadingStates[showDeleteConfirm.playerId]}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemovePlayer(showDeleteConfirm.teamId, showDeleteConfirm.playerId)}
                disabled={deletingLoadingStates[showDeleteConfirm.playerId]}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
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
    </div>
  );
};

export default PlayerManagement;