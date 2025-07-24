import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Trophy, Users, Zap } from 'lucide-react';

const TournamentWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tournament, setTournament] = useState({ name: '', description: '' });
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState({});
  const [errors, setErrors] = useState({});

  const steps = [
    { title: 'Tournament Details', icon: Trophy },
    { title: 'Teams & Players', icon: Users },
    { title: 'Review & Finish', icon: Zap },
  ];

  const avatars = [
    { emoji: '🦁', name: 'Lion' },
    { emoji: '🐯', name: 'Tiger' },
    { emoji: '🐻', name: 'Bear' },
    { emoji: '🐵', name: 'Monkey' },
    { emoji: '🐸', name: 'Frog' },
    { emoji: '🐶', name: 'Dog' },
    { emoji: '🐱', name: 'Cat' },
    { emoji: '🦊', name: 'Fox' },
  ];

  const validateStep = () => {
    if (currentStep === 0) {
      if (!tournament.name.trim()) {
        setErrors({ tournamentName: 'Tournament name is required' });
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
        // Check if any player is missing an avatar
        if (tPlayers.some((p) => !p.avatar)) {
          setErrors({ players: 'Each player must have an avatar selected.' });
          return false;
        }
      }
      return true;
    }

    return true;
  };

  const nextStep = () => {
    
    if (validateStep()) {
      setErrors({});
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
    } else {
      //console.log('Validation failed, staying on current step');
    }
  };

  const prevStep = () => {
    setErrors({});
    setCurrentStep((prev) => prev - 1);
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
    // Check if all existing players in this team have avatars
    const existingPlayers = players[teamId] || [];
    const hasPlayersWithoutAvatars = existingPlayers.some(p => !p.avatar || !p.name.trim());
    
    if (hasPlayersWithoutAvatars) {
      setErrors({ players: 'Please complete all existing players (name and avatar) before adding a new one.' });
      return;
    }
    
    setErrors({}); // Clear errors if validation passes
    const newPlayer = { id: Date.now(), name: '', avatar: '' };
    const updated = { ...players };
    updated[teamId] = [...(updated[teamId] || []), newPlayer];

    setPlayers(updated);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 max-w-xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Tournament Details</h2>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Name *</label>
              <input
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter tournament name"
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
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Describe your tournament"
                rows={4}
                value={tournament.description}
                onChange={(e) => setTournament({ ...tournament, description: e.target.value })}
              />
            </div>
            <button
              onClick={nextStep}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold text-lg
                         flex justify-center items-center gap-2 transition"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        );

      case 1:
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Teams & Players</h2>
              <div className="flex justify-center gap-6 text-sm text-gray-600">
                <span className="bg-blue-100 px-3 py-1 rounded-full">
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
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                                  ? 'border-blue-500 bg-blue-50'
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
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold transition"
                >
                  + Add Player
                </button>
              </div>
            ))}

            <div className="text-center">
              <button
                onClick={addTeam}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition"
              >
                + Add Team
              </button>
            </div>

            {(errors.teams || errors.players) && (
              <p className="text-center text-red-600 font-semibold mt-3">
                {errors.teams || errors.players}
              </p>
            )}

            <div className="flex justify-between max-w-xl mx-auto mt-8">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={nextStep}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      case 2: {
        // Create final tournament payload
        const finalPayload = {
          tournament: {
            name: tournament.name,
            description: tournament.description,
            createdAt: new Date().toISOString()
          },
          teams: teams.map(team => ({
            id: team.id,
            name: team.name,
            players: (players[team.id] || []).map(player => ({
              id: player.id,
              name: player.name,
              avatar: player.avatar,
              avatarName: avatars.find(a => a.emoji === player.avatar)?.name || ''
            }))
          })),
          summary: {
            totalTeams: teams.length,
            totalPlayers: Object.values(players).flat().length,
            teamsWithPlayers: teams.map(team => ({
              teamName: team.name,
              playerCount: (players[team.id] || []).length
            }))
          }
        };

        return (
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Review & Finish</h2>

            <section className="bg-blue-50 rounded-lg p-6 shadow-inner border border-blue-200">
              <h3 className="text-2xl font-semibold mb-4 text-blue-900">Tournament Info</h3>
              <p className="text-lg">
                <strong>Name:</strong> {tournament.name}
              </p>
              {tournament.description && (
                <p className="text-lg mt-2">
                  <strong>Description:</strong> {tournament.description}
                </p>
              )}
            </section>

            <section className="bg-green-50 rounded-lg p-6 shadow-inner border border-green-200">
              <h3 className="text-2xl font-semibold mb-4 text-green-900">Teams & Players</h3>
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

            <section className="bg-yellow-50 rounded-lg p-6 text-center border border-yellow-200">
              <h3 className="text-3xl font-extrabold text-yellow-800 mb-2">🎉 You're All Set!</h3>
              <p className="text-yellow-700 text-lg">Your tournament is ready to begin!</p>
            </section>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-10">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex items-center">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition
                    ${
                      idx <= currentStep
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 text-gray-400'
                    }`}
                    aria-current={idx === currentStep ? 'step' : undefined}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded ${
                        idx < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-600">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`w-24 text-center truncate ${
                  idx === currentStep ? 'text-blue-600' : ''
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        {renderStepContent()}
      </div>
    </div>
  );
};

export default TournamentWizard;