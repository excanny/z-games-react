import { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../../config'; // Adjust the import path as necessary

const TeamManagement = ({ teams, onAddTeam, onUpdateTeam, onRemoveTeam, tournamentId }) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [editingTeam, setEditingTeam] = useState(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

    //Notification functions with explicit configuration
    const teamAddedNotification = () => {
      toast.dismiss(); // Dismiss any existing toasts first
      toast.success('Team added successfully!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        closeButton: true,
        toastId: 'team-added' // Prevent duplicates
      });
    };
    
    const teamUpdatedNotification = () => {
      toast.dismiss();
      toast.success('Team updated successfully!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        closeButton: true,
        toastId: 'team-updated'
      });
    };
    
    const teamRemovedNotification = () => {
      toast.dismiss();
      toast.success('Team removed successfully!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        closeButton: true,
        toastId: 'team-removed'
      });
    };
    
  const handleAddTeam = async () => {
    if (!newTeamName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${config.baseUrl}/api/tournaments/${tournamentId}/add-team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamName: newTeamName.trim()
        })
      });

      if (response.ok) {
        const result = await response.json();

        teamAddedNotification();
        
        // Handle case where API returns an array of all teams
        if (Array.isArray(result)) {
          // Find the newly created team (usually the last one or the one with matching name)
          const newTeam = result.find(team => team.name === newTeamName.trim()) || 
                          result[result.length - 1]; // fallback to last team
          
          if (newTeam) {
            onAddTeam(newTeam);
          } else {
            console.error('Could not find the newly created team in the response');
          }
        } else {
          // Handle case where API returns a single team object
          // First spread the result, then override with correct values
          const newTeam = {
            ...(result.team || result.data || result),
            _id: result._id || result.id || Date.now().toString(),
            id: result.id || result._id || Date.now().toString(), // Support both id formats
            name: result.teamName || result.name || newTeamName.trim(),
            players: result.players || [],
            totalScore: result.totalScore || 0,
            isActive: result.isActive !== undefined ? result.isActive : true,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            __v: result.__v || 0
          };
          
          onAddTeam(newTeam);
        }
        
        setNewTeamName('');
      } else {
        const errorData = await response.json();
        console.error('Failed to add team:', errorData);
        toast.error('Failed to add team. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          closeButton: true,
          closeOnClick: true,
          toastId: 'add-team-error'
        });
      }
    } catch (error) {
      console.error('Error adding team:', error);
      toast.error('Error adding team. Please check your connection.', {
        position: "top-right",
        autoClose: 3000,
        closeButton: true,
        closeOnClick: true,
        toastId: 'add-team-network-error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTeam = (team) => {
    const teamId = team.id || team._id;
    setEditingTeam(teamId);
    setEditTeamName(team.name);
  };

  const handleSaveTeam = async (teamId) => {
    if (!editTeamName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${config.baseUrl}/api/tournaments/${tournamentId}/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editTeamName.trim()
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Only update the name field to avoid overwriting with wrong data
        const updatedTeam = {
          name: editTeamName.trim()
        };
        
        // If the API returns specific team data, extract only relevant fields
        if (result.team) {
          updatedTeam.updatedAt = result.team.updatedAt;
          updatedTeam.__v = result.team.__v;
        } else if (result.updatedAt) {
          updatedTeam.updatedAt = result.updatedAt;
          updatedTeam.__v = result.__v;
        }
        
        // Call onUpdateTeam with teamId and the updated data
        onUpdateTeam(teamId, updatedTeam);
        
        // Show success notification
        teamUpdatedNotification();
        
        // Reset editing state
        setEditingTeam(null);
        setEditTeamName('');
      } else {
        const errorData = await response.json();
        console.error('Failed to update team:', errorData);
        toast.error('Failed to update team. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          closeButton: true,
          closeOnClick: true,
          toastId: 'update-team-error'
        });
      }
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error('Error updating team. Please check your connection.', {
        position: "top-right",
        autoClose: 3000,
        closeButton: true,
        closeOnClick: true,
        toastId: 'update-team-network-error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTeam = async (teamId) => {
    // Use window.confirm to ensure it works properly
    const confirmed = window.confirm('Are you sure you want to remove this team?');
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${config.baseUrl}/api/tournaments/${tournamentId}/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Call the onRemoveTeam callback to update the parent state
        if (onRemoveTeam) {
          onRemoveTeam(teamId);
        }
        
        teamRemovedNotification();
      } else {
        const errorData = await response.json();
        console.error('Failed to remove team:', errorData);
        toast.error(`Failed to remove team ${errorData.error || ''}. Please try again.`, {
          position: "top-right",
          autoClose: 3000,
          closeButton: true,
          closeOnClick: true,
          toastId: 'remove-team-error'
        });
      }
    } catch (error) {
      console.error('Error removing team:', error);
      toast.error('Error removing team. Please check your connection.', {
        position: "top-right",
        autoClose: 3000,
        closeButton: true,
        closeOnClick: true,
        toastId: 'remove-team-network-error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTeam(null);
    setEditTeamName('');
  };

  return (

    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-4 sm:p-6 border border-purple-200/60 space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-purple-800 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Team Management
      </h3>

      {/* Add New Team */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Enter team name..."
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTeam()}
          disabled={isLoading}
          className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
        />
        <button
          onClick={handleAddTeam}
          disabled={!newTeamName.trim() || isLoading}
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          {isLoading ? 'Adding...' : 'Add Team'}
        </button>
      </div>

      {/* Teams List */}
      <div className="space-y-3">
        {teams.length === 0 ? (
          <div className="text-center py-8 text-purple-600">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No teams added yet. Create your first team above!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 sm:max-h-80 overflow-y-auto">
            {teams.map((team, index) => (
              <div key={team.id || team._id || `team-${index}`} className="bg-white/90 rounded-xl p-3 sm:p-4 border border-purple-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                {editingTeam === (team.id || team._id) ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={editTeamName}
                        onChange={(e) => setEditTeamName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveTeam(team.id || team._id)}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 font-medium text-sm sm:text-base"
                        placeholder="Team name..."
                      />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleSaveTeam(team.id || team._id)}
                        disabled={isLoading || !editTeamName.trim()}
                        className="flex-1 sm:flex-none p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-200"
                        title="Save changes"
                      >
                        <Save className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:text-gray-400 transition-colors duration-200"
                        title="Cancel editing"
                      >
                        <X className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-700 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-purple-900 text-base truncate">{team.name}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-purple-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 flex-shrink-0" />
                            {team.players?.length || 0} players
                          </span>
                          {team.totalScore !== undefined && (
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-3 bg-purple-400 rounded-full flex-shrink-0"></span>
                              {team.totalScore} points
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleEditTeam(team)}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-200"
                        title="Edit team"
                      >
                        <Edit2 className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleRemoveTeam(team.id || team._id)}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-200"
                        title="Remove team"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center text-purple-600 text-sm">
          Processing...
        </div>
      )}

       {/* Toast Container with improved configuration */}
            <ToastContainer 
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover={false}
              limit={3}
              enableMultiContainer={false}
              containerId="team-management-toasts"
            />

    </div>
  );
};

export default TeamManagement;