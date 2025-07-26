import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Trophy, Users, Zap, X } from 'lucide-react';
import axiosClient  from '../utils/axiosClient';

const TournamentModal = ({ 
  isOpen, 
  onClose, 
  onCreateTournament, 
  gamesList = [] 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tournament, setTournament] = useState({ 
    name: '', 
    description: '',
    selectedGames: [] // Make sure this is initialized
  });
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { title: 'Tournament Details', icon: Trophy },
    { title: 'Teams & Players', icon: Users },
    { title: 'Games', icon: Zap },
    { title: 'Review & Finish', icon: Trophy },
  ];

  const avatars = [
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🐯', name: 'Tiger' },
  { emoji: '🦅', name: 'Eagle' },
  { emoji: '🐱', name: 'Cat' },
  { emoji: '🦈', name: 'Shark' },
  { emoji: '🐶', name: 'Dog' },
  { emoji: '🐋', name: 'Whale' },
  { emoji: '🐴', name: 'Horse' },
  { emoji: '🦬', name: 'Bison' },
  { emoji: '🦌', name: 'Moose' },
  { emoji: '🪿', name: 'Goose' },
  { emoji: '🐢', name: 'Turtle' },
  { emoji: '🦫', name: 'Beaver' },
  { emoji: '🐻', name: 'Bear' },
  { emoji: '🐸', name: 'Frog' },
  { emoji: '🐰', name: 'Rabbit' },
  { emoji: '🐺', name: 'Wolf' },
  { emoji: '🧑', name: 'Human' },
  { emoji: '🐵', name: 'Monkey' },
  { emoji: '🦎', name: 'Chameleon' }
];


  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setCurrentStep(0);
    setTournament({ 
      name: '', 
      description: '',
      type: 'single-elimination',
      maxParticipants: 8,
      startDate: '',
      endDate: '',
      prizePool: '',
      rules: '',
      selectedGames: []
    });
    setTeams([]);
    setPlayers({});
    setErrors({});
    setIsLoading(false);
  };

  const validateStep = () => {
    setErrors({}); // Clear previous errors
    
    if (currentStep === 0) {
      if (!tournament.name.trim()) {
        setErrors({ tournamentName: 'Game session name is required' });
        return false;
      }
      return true;
    }

    if (currentStep === 1) {
      if (teams.length < 2 || teams.some((t) => !t.name.trim())) {
        setErrors({ teams: 'Add at least 2 valid teams.' });
        return false;
      }

      for (const team of teams) {
        const tPlayers = players[team.id] || [];
        if (tPlayers.length === 0 || tPlayers.some((p) => !p.name.trim())) {
          setErrors({ players: 'Each team must have at least 1 valid player.' });
          return false;
        }
        if (tPlayers.some((p) => !p.avatar)) {
          setErrors({ players: 'Each player must have an avatar selected.' });
          return false;
        }
      }
      return true;
    }

    if (currentStep === 2) {
      if (tournament.selectedGames.length === 0) {
        setErrors({ games: 'Please select at least one game for the game session.' });
        return false;
      }
      return true;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setErrors({});
    setCurrentStep(currentStep - 1);
  };

  const addTeam = () => {
    const id = Date.now().toString();
    const newTeam = { id, name: '' };
    const updatedTeams = [...teams, newTeam];
    const updatedPlayers = { ...players, [id]: [] };
    
    setTeams(updatedTeams);
    setPlayers(updatedPlayers);
  };

  const addPlayer = (teamId) => {
    const existingPlayers = players[teamId] || [];
    const hasPlayersWithoutAvatars = existingPlayers.some(p => !p.avatar || !p.name.trim());
    
    if (hasPlayersWithoutAvatars) {
      setErrors({ players: 'Please complete all existing players (name and avatar) before adding a new one.' });
      return;
    }
    
    setErrors({});
    const newPlayer = { id: Date.now(), name: '', avatar: '' };
    const updated = { ...players };
    updated[teamId] = [...(updated[teamId] || []), newPlayer];
    setPlayers(updated);
  };

//  const toggleGameSelection = (event) => {
//   const { value, checked } = event.target;
  
//   setTournament(prev => {
//     const currentSelectedGames = prev.selectedGames || [];
    
//     if (checked) {
//       // Add the game ID if it's not already selected
//       if (!currentSelectedGames.includes(value)) {
//         return {
//           ...prev,
//           selectedGames: [...currentSelectedGames, value]
//         };
//       }
//     } else {
//       // Remove the game ID
//       return {
//         ...prev,
//         selectedGames: currentSelectedGames.filter(gameId => gameId !== value)
//       };
//     }
    
//     return prev;
//   });
// };

// const toggleGameSelection = (event) => {
//   const { value, checked } = event.target;
  
//   setTournament(prev => {
//     const currentSelectedGames = prev.selectedGames || [];
    
//     if (checked) {
//       // Add the game ID if it's not already selected
//       return {
//         ...prev,
//         selectedGames: [...currentSelectedGames, value]
//       };
//     } else {
//       // Remove the game ID
//       return {
//         ...prev,
//         selectedGames: currentSelectedGames.filter(gameId => gameId !== value)
//       };
//     }
//   });
// };

const toggleGameSelection = (event) => {
  const { value, checked } = event.target;
  
  setTournament(prev => {
    const currentSelectedGames = prev.selectedGames || [];
    
    if (checked) {
      // Add the game ID
      return {
        ...prev,
        selectedGames: [...currentSelectedGames, value]
      };
    } else {
      // Remove the game ID
      return {
        ...prev,
        selectedGames: currentSelectedGames.filter(gameId => gameId !== value)
      };
    }
  });
};

const submitTournament = async () => {
  debugger
  setIsLoading(true);
  setErrors({});

  try {
    // Debug logging to see what we're sending
    console.log('Tournament data before submit:', {
      selectedGames: tournament.selectedGames,
      teams: teams,
      players: players
    });

    // Validate that we have selected games
    if (!tournament.selectedGames || tournament.selectedGames.length === 0) {
      throw new Error('Please select at least one game for the tournament');
    }

    // Prepare the data in the exact format expected by your API
    const tournamentData = {
      tournament: {
        name: tournament.name || '',
        description: tournament.description || '',
        createdAt: new Date().toISOString()
      },
      teams: teams.map(team => ({
        id: team.id || '',
        name: team.name || '',
        players: (players[team.id] || []).map(player => ({
          id: player.id ? player.id.toString() : '',
          name: player.name || '',
          avatar: player.avatar || '',
          avatarName: avatars.find(a => a.emoji === player.avatar)?.name || ''
        }))
      })),
      selectedGames: tournament.selectedGames || []
    };

    console.log('Sending tournament data:', tournamentData);

    // Make the API call using axiosClient
    const result = await axiosClient.post('/tournaments', tournamentData);
    
    console.log('Tournament created successfully:', result.data);
    
    // Call the parent callback with the result
    if (onCreateTournament) {
      await onCreateTournament(result.data);
    }
    
    // Close the modal on success
    onClose();
    
  } catch (error) {
    console.error('Error creating game session:', error);
    
    // Handle axios error response
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to create game session. Please check your connection and try again.';
    
    setErrors({ 
      submit: errorMessage
    });
  } finally {
    setIsLoading(false);
  }
};

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Game Session Details</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Game Session Name *</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="Enter game session name"
                  value={tournament.name}
                  onChange={(e) => setTournament({ ...tournament, name: e.target.value })}
                />
                {errors.tournamentName && (
                  <p className="text-red-600 mt-1 text-sm">{errors.tournamentName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg placeholder-gray-400 resize-none
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="Describe your game session"
                  rows={3}
                  value={tournament.description}
                  onChange={(e) => setTournament({ ...tournament, description: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Teams & Players</h2>
              <div className="flex justify-center gap-6 text-sm text-gray-600">
                <span className="bg-purple-100 px-3 py-1 rounded-full">
                  <strong>{teams.length}</strong> {teams.length === 1 ? 'Team' : 'Teams'}
                </span>
                <span className="bg-green-100 px-3 py-1 rounded-full">
                  <strong>{Object.values(players).flat().length}</strong> {Object.values(players).flat().length === 1 ? 'Player' : 'Players'}
                </span>
              </div>
            </div>

            {teams.map((team, idx) => (
              <div
                key={team.id}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200 transition hover:shadow-lg"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Team Name
                    </label>
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Team No. {idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      className="flex-grow border border-gray-300 rounded-md px-4 py-2 text-lg
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                      placeholder="Enter team name"
                      value={team.name}
                      onChange={(e) => {
                        const updated = [...teams];
                        updated[idx].name = e.target.value;
                        setTeams(updated);
                      }}
                    />
                    <button
                      className="text-red-600 hover:text-red-800 font-semibold text-sm px-2 py-1 rounded-md transition flex items-center gap-1"
                      onClick={() => {
                        const updatedTeams = teams.filter((_, i) => i !== idx);
                        const updatedPlayers = { ...players };
                        delete updatedPlayers[team.id];
                        setTeams(updatedTeams);
                        setPlayers(updatedPlayers);
                      }}
                      aria-label={`Remove team ${team.name || idx + 1}`}
                    >
                      ❌
                    </button>
                  </div>
                </div>

                {(players[team.id] || []).length === 0 && (
                  <p className="text-sm text-gray-500 italic mb-3">No players added yet.</p>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {(players[team.id] || []).map((player, pIdx) => (
                    <div
                      key={player.id}
                      className="p-4 bg-gray-50 rounded-md border border-gray-200"
                    >
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Player Name *
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            className="flex-grow border border-gray-300 rounded-md px-3 py-2
                                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                            placeholder="Enter player name"
                            value={player.name}
                            onChange={(e) => {
                              const updated = { ...players };
                              updated[team.id][pIdx].name = e.target.value;
                              setPlayers(updated);
                            }}
                          />

                          <button
                            className="text-red-600 hover:text-red-800 font-semibold px-2 rounded-md transition"
                            onClick={() => {
                              const updated = { ...players };
                              updated[team.id] = updated[team.id].filter((_, i) => i !== pIdx);
                              setPlayers(updated);
                            }}
                            aria-label={`Remove player ${player.name || pIdx + 1}`}
                          >
                            ❌
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Choose Avatar *
                        </label>
                        {!player.avatar && (
                          <p className="text-red-600 text-sm mb-2">Please select an avatar</p>
                        )}
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                          {avatars.map((a, i) => (
                            <label
                              key={i}
                              className={`flex flex-col items-center p-2 rounded-md border-2 cursor-pointer transition ${
                                player.avatar === a.emoji
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`avatar-${team.id}-${player.id}`}
                                value={a.emoji}
                                checked={player.avatar === a.emoji}
                                onChange={(e) => {
                                  const updated = { ...players };
                                  updated[team.id][pIdx].avatar = e.target.value;
                                  setPlayers(updated);
                                }}
                                className="sr-only"
                              />
                              <span className="text-xl mb-1">{a.emoji}</span>
                              <span className="text-xs text-gray-600 text-center leading-tight">
                                {a.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addPlayer(team.id)}
                  className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-semibold transition"
                >
                  + Add Player
                </button>
              </div>
            ))}

            <div className="text-center">
              <button
                onClick={addTeam}
                className="bg-green-600 hover:bg-green-700 text-white px-2 py-2 my-3 rounded-lg font-semibold text-lg transition"
              >
                + Add New Team
              </button>
            </div>

            {(errors.teams || errors.players) && (
              <p className="text-center text-red-600 font-semibold mt-3">
                {errors.teams || errors.players}
              </p>
            )}
          </div>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Games</h2>
              <p className="text-gray-600">Choose the games that will be played in this game session</p>
              <div className="flex justify-center gap-6 text-sm text-gray-600 mt-2">
                <span className="bg-blue-100 px-3 py-1 rounded-full">
                  <strong>{tournament.selectedGames.length}</strong> {tournament.selectedGames.length === 1 ? 'Game' : 'Games'} Selected
                </span>
              </div>
            </div>

            {gamesList.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No games available</p>
                <p className="text-gray-400 text-sm">Please check your API connection</p>
              </div>
            ) : (

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {gamesList.map((game) => {
    // Ensure we're using the correct ID field and that selectedGames is an array
    const gameId = game._id || game.id;
    const selectedGames = tournament.selectedGames || [];
    const isSelected = selectedGames.includes(gameId);
    
    return (
      <label
        key={gameId}
        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg select-none block ${
          isSelected
            ? 'border-purple-500 bg-purple-50 shadow-md'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold text-lg ${isSelected ? 'text-purple-800' : 'text-gray-800'}`}>
            {game.name}
          </h3>
          <input
            type="checkbox"
            checked={isSelected}
            value={gameId}
            onChange={toggleGameSelection}
            className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
        </div>
        
        {game.description && (
          <p className={`text-sm mb-3 ${isSelected ? 'text-purple-700' : 'text-gray-600'}`}>
            {game.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2">
          {game.category && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              isSelected 
                ? 'bg-purple-200 text-purple-800' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {game.category}
            </span>
          )}
          {game.difficulty && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              isSelected 
                ? 'bg-purple-200 text-purple-800' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {game.difficulty}
            </span>
          )}
        </div>
      </label>
    );
  })}
</div>
            )}

            {errors.games && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800 font-semibold">{errors.games}</p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Review & Finish</h2>

            <section className="bg-purple-50 rounded-lg p-6 shadow-inner border border-purple-200">
              <h3 className="text-xl font-semibold mb-4 text-purple-900">Game Session Info</h3>
              <div className="space-y-2">
                <p className="text-lg"><strong>Name:</strong> {tournament.name}</p>
                
                {tournament.description && (
                  <div>
                    <p className="text-lg"><strong>Description:</strong> {tournament.description}</p>
                  </div>
                )}
                
                {tournament.rules && (
                  <div>
                    <p className="text-lg"><strong>Rules:</strong></p>
                    <p className="text-gray-700 whitespace-pre-wrap">{tournament.rules}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-blue-50 rounded-lg p-6 shadow-inner border border-blue-200">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">Selected Games</h3>
              {tournament.selectedGames.length === 0 ? (
                <p className="text-blue-700 italic">No games selected</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tournament.selectedGames.map((gameId) => {
                    const game = gamesList.find(g => g.id === gameId);
                    return game ? (
                      <div key={gameId} className="bg-white rounded-lg p-3 border border-blue-200">
                        <h4 className="font-semibold text-blue-800">{game.name}</h4>
                        {game.description && (
                          <p className="text-sm text-blue-600 mt-1">{game.description}</p>
                        )}
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </section>

            <section className="bg-green-50 rounded-lg p-6 shadow-inner border border-green-200">
              <h3 className="text-xl font-semibold mb-4 text-green-900">Teams & Players</h3>
              {teams.map((team) => (
                <div key={team.id} className="mb-6">
                  <p className="font-bold text-xl text-green-800 mb-2">{team.name}</p>
                  <ul className="list-disc list-inside space-y-1 text-green-900">
                    {(players[team.id] || []).map((p) => {
                      const avatarInfo = avatars.find((a) => a.emoji === p.avatar);
                      return (
                        <li key={p.id} className="text-lg">
                          {p.avatar} {p.name}{' '}
                          {avatarInfo && (
                            <span className="text-green-700 text-sm font-normal">({avatarInfo.name})</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </section>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold">Error creating game session:</p>
                <p className="text-red-700">{errors.submit}</p>
              </div>
            )}

            <section className="bg-yellow-50 rounded-lg p-6 text-center border border-yellow-200">
              <h3 className="text-2xl font-bold text-yellow-800 mb-2">🎉 You're All Set!</h3>
              <p className="text-yellow-700 text-lg">Your game session is ready to begin!</p>
            </section>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-xl font-bold">Create New Game Session</h2>
              <p className="text-purple-200 mt-1 text-sm">Step {currentStep + 1} of {steps.length}</p>
            </div>
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex items-center">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition
                    ${
                      idx <= currentStep
                        ? 'bg-white border-white text-purple-600'
                        : 'border-purple-300 text-purple-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-3 rounded ${
                        idx < currentStep ? 'bg-white' : 'bg-purple-400'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs font-medium text-purple-200">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`text-center ${
                  idx === currentStep ? 'text-white' : ''
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-250px)] p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div>
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={submitTournament}
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  'Create Game Session'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentModal;