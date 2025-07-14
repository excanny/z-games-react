import { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const TeamManagement = ({ teams, onAddTeam, onRemoveTeam, onUpdateTeam, tournamentId }) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [editingTeam, setEditingTeam] = useState(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTeam = async () => {
    if (!newTeamName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/tournaments/${tournamentId}/add-team`, {
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
        
        // Debug: Log the API response to see its structure
        console.log('API Response:', result);
        
        // Handle case where API returns an array of all teams
        if (Array.isArray(result)) {
          // Find the newly created team (usually the last one or the one with matching name)
          const newTeam = result.find(team => team.name === newTeamName.trim()) || 
                          result[result.length - 1]; // fallback to last team
          
          if (newTeam) {
            console.log('Found new team:', newTeam);
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
            name: result.teamName || newTeamName.trim(), // Use teamName from API or fallback to input
            players: result.players || [],
            totalScore: result.totalScore || 0,
            isActive: result.isActive !== undefined ? result.isActive : true,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            __v: result.__v || 0
          };
          
          console.log('Processed team object:', newTeam);
          onAddTeam(newTeam);
        }
        
        setNewTeamName('');
      } else {
        const errorData = await response.json();
        console.error('Failed to add team:', errorData);
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error('Error adding team:', error);
      // You might want to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team._id);
    setEditTeamName(team.name);
  };

  const handleSaveTeam = async (teamId) => {
    if (!editTeamName.trim()) return;

    setIsLoading(true);
    try {
      // Assuming you have an update team endpoint
      const response = await fetch(`http://localhost:5000/api/tournaments/${tournamentId}/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editTeamName.trim()
        })
      });

      if (response.ok) {
        const updatedTeam = await response.json();
        onUpdateTeam(teamId, updatedTeam);
        setEditingTeam(null);
        setEditTeamName('');
      } else {
        console.error('Failed to update team');
      }
    } catch (error) {
      console.error('Error updating team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTeam = async (teamId) => {
    if (!confirm('Are you sure you want to remove this team?')) return;

    setIsLoading(true);
    try {
      // Assuming you have a remove team endpoint
      const response = await fetch(`http://localhost:5000/api/tournaments/${tournamentId}/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onRemoveTeam(teamId);
      } else {
        console.error('Failed to remove team');
      }
    } catch (error) {
      console.error('Error removing team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTeam(null);
    setEditTeamName('');
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200/60 space-y-4">
      <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Team Management
      </h3>

      {/* Add New Team */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter team name..."
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTeam()}
          disabled={isLoading}
          className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleAddTeam}
          disabled={!newTeamName.trim() || isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
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
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {teams.map((team, index) => (
              <div key={team._id} className="bg-white/90 rounded-xl p-4 border border-purple-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                {editingTeam === team._id ? (
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={editTeamName}
                        onChange={(e) => setEditTeamName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveTeam(team._id)}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 font-medium"
                        placeholder="Team name..."
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveTeam(team._id)}
                        disabled={isLoading || !editTeamName.trim()}
                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-200"
                        title="Save changes"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:text-gray-400 transition-colors duration-200"
                        title="Cancel editing"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-700 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-900 text-base">{team.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-purple-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {team.players?.length || 0} players
                          </span>
                          {team.totalScore !== undefined && (
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
                              {team.totalScore} points
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTeam(team)}
                        disabled={isLoading}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-200"
                        title="Edit team"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveTeam(team._id)}
                        disabled={isLoading}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-200"
                        title="Remove team"
                      >
                        <Trash2 className="w-4 h-4" />
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
    </div>
  );
};

export default TeamManagement;