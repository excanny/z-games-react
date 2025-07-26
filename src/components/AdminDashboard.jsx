import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//import GameManager from "./GameManager";
import axiosClient from "../utils/axiosClient"; 
import { useAuth } from '../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import AdminHeader from './AdminHeader';
import StatsCards from './StatsCards';
import GameModal from './GameModal';
import TournamentModal from './TournamentModal';
import config from "../config";

const AdminDashboard = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const [tournamentsList, setTournamentsList] = useState([]);
    const [selectedGames, setSelectedGames] = useState(new Set()); // Track selected games

    // Get initial tab from URL hash or default to 'games'
    const getInitialTab = () => {
      const hash = window.location.hash.replace('#', '');
      return ['games', 'tournaments'].includes(hash) ? hash : 'games';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [gameForm, setGameForm] = useState({
      name: '',
      description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bulkParticipants, setBulkParticipants] = useState('');
    const [participantsToAdd, setParticipantsToAdd] = useState([]);
    
    // Loading states (added from SingleGame)
    const [loading, setLoading] = useState(true);
    const [longLoading, setLongLoading] = useState(false);
    const [error, setError] = useState(null);

    const gameManagerRef = React.useRef();

    // Available avatars and colors (matching SingleGame)
    const availableAvatars = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄'];
    const availableColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43', '#10AC84', '#EE5A24', '#0984E3', '#A29BFE', '#FD79A8', '#E17055', '#81ECEC', '#74B9FF', '#A29BFE', '#FD79A8'];

    // Tab management
    const tabs = [
      { id: 'games', label: 'Add Game', icon: '🎮' },
      { id: 'tournaments', label: 'Add Game Session', icon: '🏆' }
    ];

    // Update URL hash when tab changes
    useEffect(() => {
      window.location.hash = activeTab;
    }, [activeTab]);

    // Listen for hash changes (back/forward navigation)
    useEffect(() => {
      const handleHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        if (['games', 'tournaments'].includes(hash)) {
          setActiveTab(hash);
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    //Notification functions
    const gameCreatedNotification = () => toast('Game created successfully!');
    const tournamentCreatedNotification = () => toast('Game session created successfully!');
      
    // Fetch games on component mount
    useEffect(() => {
      const initializeData = async () => {
        setLoading(true);
        setError(null);
        setLongLoading(false);
        
        try {
          await fetchGames();
          await fetchTournaments();
          //console.log('Games and tournaments fetched successfully');
        } catch (err) {
          console.error('Error initializing dashboard:', err);
          setError(err.message || 'Failed to load dashboard data');
        } finally {
          setLoading(false);
        }
      };
      
      initializeData();

      // Set up timer for long loading indicator (matching SingleGame)
      const timer = setTimeout(() => {
        setLongLoading(true);
      }, 10000);

      return () => {
        clearTimeout(timer);
      };
    }, []);

    // Fetch games from API
    const fetchGames = async () => {
      try {
        const response = await axiosClient.get('/games');
        //debugger
        const gamesData = response.data.data || response.data || [];
        setGames(gamesData);
      } catch (error) {
        console.error('Error fetching games:', error);
        setGames([]);
        throw error; // Re-throw to be caught by useEffect
      }
    };

    const fetchTournaments = async () => {
        try {
          const response = await fetch(`${config.baseUrl}/api/tournaments`);
          const tournaments = await response.json();
       
          setTournamentsList(tournaments.data);
        } catch (error) {
          console.error('Error fetching games:', error);
        }
      };
      
    // Updated createGame to handle game data from API responses
    const createGame = async (gameData) => {
      try {
        // Update local state with the new game
        setGames(prev => [...prev, gameData]);
        gameCreatedNotification();
      } catch (error) {
        console.error('Error in createGame:', error);
      }
    };

    // Direct API call for modal game creation (bypassing GameManager)
    const createGameFromModal = async (gameData) => {
      setIsSubmitting(true);
      try {
        const response = await axiosClient.post('/games', gameData);
        // Handle different response structures consistently
        const newGame = response.data.data || response.data;

        gameCreatedNotification();
        
        // Refresh the games list from server to ensure we have the latest data
        await fetchGames();
        
        return newGame;
      } catch (error) {
        console.error('Error creating game from modal:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    };

    // Tournament creation function (placeholder)
    const createTournamentFromModal = async (tournamentData) => {
      setIsSubmitting(true);
      try {
        
        tournamentCreatedNotification();
        
        // You would refresh tournaments list here
        await fetchTournaments();
        
        return tournamentData;
      } catch (error) {
        console.error('Error creating game session:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const selectGame = (game) => {
      setSelectedGame(game);
    };

    // Handle game selection with proper unique identification
    const handleGameSelect = (gameId) => {
      const newSelectedGames = new Set(selectedGames);
      if (newSelectedGames.has(gameId)) {
        newSelectedGames.delete(gameId);
      } else {
        newSelectedGames.add(gameId);
      }
      setSelectedGames(newSelectedGames);
    };

    // Check if a game is selected
    const isGameSelected = (gameId) => {
      return selectedGames.has(gameId);
    };
  
    const deleteGame = async (gameId) => {
      try {
        await axiosClient.delete(`/games/${gameId}`);
        setGames(games.filter(g => g.id !== gameId));
        if (selectedGame?.id === gameId) {
          setSelectedGame(null);
        }
        // Remove from selected games if it was selected
        const newSelectedGames = new Set(selectedGames);
        newSelectedGames.delete(gameId);
        setSelectedGames(newSelectedGames);
        toast('Game deleted successfully!');
      } catch (error) {
        console.error('Error deleting game:', error);
        toast.error('Failed to delete game');
      }
    };

    const openModal = () => {
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setParticipants([]);
      setParticipantsToAdd([]);
      setBulkParticipants('');
      setGameForm({
        name: '',
        description: ''
      });
      setIsSubmitting(false);
    };

    const handleInputChange = (field, value) => {
      setGameForm(prev => ({
        ...prev,
        [field]: value
      }));
    };

    // Process bulk participant names input
    const processBulkParticipantNames = () => {
      if (!bulkParticipants.trim()) {
        alert('Please enter participant names'); 
        return;
      }

      const participantNames = bulkParticipants.split('\n').filter(name => name.trim());
      const newParticipantsToAdd = participantNames.map((name, index) => ({
        id: Date.now() + index,
        name: name.trim(),
        avatar: availableAvatars[index % availableAvatars.length], // Cycle through avatars
        color: availableColors[index % availableColors.length] // Cycle through colors
      }));

      setParticipantsToAdd(newParticipantsToAdd);
      setBulkParticipants('');
    };

    // Update individual participant details
    const updateParticipantDetails = (participantId, field, value) => {
      setParticipantsToAdd(prev => 
        prev.map(participant => 
          participant.id === participantId ? { ...participant, [field]: value } : participant
        )
      );
    };

    // Remove participant from the list
    const removeParticipantFromList = (participantId) => {
      setParticipantsToAdd(prev => prev.filter(participant => participant.id !== participantId));
    };

    // Confirm and add participants to the final list
    const confirmParticipants = () => {
      if (participantsToAdd.length === 0) {
        alert('No participants to add');
        return;
      }

      // Add participants to the main participants list
      setParticipants(prev => [...prev, ...participantsToAdd]);
      
      // Clear the temporary list
      setParticipantsToAdd([]);
    };

    const removeParticipant = (participantId) => {
      setParticipants(prev => prev.filter(p => p.id !== participantId));
    };

    // Fixed submitGame function with better error handling and refresh
    const submitGame = async () => {
      if (gameForm.name.trim() && participants.length > 0) {
        try {
          const gameData = {
            name: gameForm.name.trim(),
            description: gameForm.description.trim(),
            participants: participants
          };

          // Use direct API call instead of going through GameManager
          await createGameFromModal(gameData);
          
          // Close modal and reset form
          closeModal();
          
          // Force GameManager to re-render by updating a key or triggering refresh
          if (gameManagerRef.current && gameManagerRef.current.refreshGames) {
            gameManagerRef.current.refreshGames();
          }
          
        } catch (error) {
          console.error('Error creating game:', error);
          alert('Failed to create game. Please try again.');
        }
      } else {
        alert('Please enter a game name and add at least one participant.');
      }
    };

    // Submit tournament function (placeholder)
    const submitTournament = async () => {
      if (gameForm.name.trim() && participants.length > 0) {
        try {
          const tournamentData = {
            name: gameForm.name.trim(),
            description: gameForm.description.trim(),
            participants: participants
          };

          await createTournamentFromModal(tournamentData);
          
          closeModal();
          
        } catch (error) {
          console.error('Error creating game session:', error);
          alert('Failed to create game session. Please try again.');
        }
      } else {
        alert('Please enter a game session name and add at least one participant.');
      }
    };

    // Helper function to get avatar emoji (matching GameManager)
    const getAvatarEmoji = (avatar) => {
      // For the new system, avatars are already emojis
      if (typeof avatar === 'string' && avatar.length <= 2) {
        return avatar;
      }
      
      // Fallback for old avatar system
      const avatarMap = {
        fox: '🦊', cat: '🐱', dog: '🐶', bear: '🐻',
        rabbit: '🐰', wolf: '🐺', owl: '🦉', dragon: '🐉'
      };
      return avatarMap[avatar] || '🎮';
    };

    // Helper function to get unique game ID
    const getGameId = (game, index) => {
      return game.id || game._id || `game-${index}`;
    };


     // Function to get the highest score from all tournaments
 const getHighestScoreFromAllTournaments = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return 0;
    }

    let highestScore = 0;

    // Iterate through all tournaments
    data.forEach(tournament => {
      if (tournament.leaderboard) {
        const { gameLeaderboards, overallLeaderboard } = tournament.leaderboard;

        // Check individual game scores
        if (gameLeaderboards) {
          gameLeaderboards.forEach(game => {
            // Check team scores in each game
            if (game.teamScores) {
              game.teamScores.forEach(team => {
                if (team.totalScore > highestScore) {
                  highestScore = team.totalScore;
                }
              });
            }

            // Check individual player scores in each game
            if (game.playerScores) {
              game.playerScores.forEach(player => {
                if (player.score > highestScore) {
                  highestScore = player.score;
                }
              });
            }
          });
        }

        // Check overall leaderboard scores
        if (overallLeaderboard) {
          // Check team rankings
          if (overallLeaderboard.teamRankings) {
            overallLeaderboard.teamRankings.forEach(team => {
              if (team.totalScore > highestScore) {
                highestScore = team.totalScore;
              }
            });
          }

          // Check player rankings
          if (overallLeaderboard.playerRankings) {
            overallLeaderboard.playerRankings.forEach(player => {
              if (player.totalScore > highestScore) {
                highestScore = player.totalScore;
              }
            });
          }
        }
      }
    });

    return highestScore;
  };

    const getHighestIndividualPlayerScore = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return 0;
    }

    let highestPlayerScore = 0;

    // Iterate through all tournaments
    data.forEach(tournament => {
      if (tournament.leaderboard) {
        const { gameLeaderboards, overallLeaderboard } = tournament.leaderboard;

        // Check individual game player scores
        if (gameLeaderboards) {
          gameLeaderboards.forEach(game => {
            // Check individual player scores in each game
            if (game.playerScores) {
              game.playerScores.forEach(player => {
                if (player.score > highestPlayerScore) {
                  highestPlayerScore = player.score;
                }
              });
            }

            // Also check player scores within team scores
            if (game.teamScores) {
              game.teamScores.forEach(team => {
                if (team.playerScores) {
                  team.playerScores.forEach(player => {
                    if (player.score > highestPlayerScore) {
                      highestPlayerScore = player.score;
                    }
                  });
                }
              });
            }
          });
        }

        // Check overall player rankings
        if (overallLeaderboard && overallLeaderboard.playerRankings) {
          overallLeaderboard.playerRankings.forEach(player => {
            if (player.totalScore > highestPlayerScore) {
              highestPlayerScore = player.totalScore;
            }
          });
        }
      }
    });

    return highestPlayerScore;
  };

   const highestTeamScore = getHighestScoreFromAllTournaments(tournamentsList);

   const highestIndividualScore = getHighestIndividualPlayerScore(tournamentsList);


const toggleStatusOptimistic = async (tournamentId) => {
  // Get current tournament
  const currentTournament = tournamentsList.find(
    tournament => (tournament.id || tournament._id) === tournamentId
  );

  if (!currentTournament) return;

  // Determine new status
  const newStatus = currentTournament.status === 'active' ? 'inactive' : 'active';

  // Store original state for rollback
  const originalTournamentsList = [...tournamentsList];

  // Optimistically update UI
  // If setting to active, set all others to inactive first
  setTournamentsList(prev =>
    prev.map(tournament => {
      const id = tournament.id || tournament._id;
      if (id === tournamentId) {
        return { ...tournament, status: newStatus };
      } else if (newStatus === 'active') {
        // Set all other tournaments to inactive when one becomes active
        return { ...tournament, status: 'inactive' };
      }
      return tournament;
    })
  );

  try {
    const response = await axiosClient.put(`/tournaments/${tournamentId}/status`, {
      status: newStatus
    });
    
    // Refresh the entire tournaments list to ensure consistency with backend
    await fetchTournaments();

  } catch (error) {
    console.error('Error updating tournament status:', error);

    // Revert to original state
    setTournamentsList(originalTournamentsList);

    alert('Failed to update tournament status. Please try again.');
  }
};
 
  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

    // Loading state (matching SingleGame)
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center p-4">
          <div>
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm sm:text-base">Loading dashboard...</p>
            {longLoading && (
              <p className="text-red-500 mt-2 text-sm">This is taking longer than expected. Please check your connection.</p>
            )}
          </div>
        </div>
      );
    }

    // Error state (matching SingleGame)
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center p-4">
          <div className="max-w-md w-full">
            <div className="text-4xl sm:text-6xl mb-4">❌</div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Error loading dashboard</h2>
            <p className="mb-4 text-sm sm:text-base text-gray-600">{error}</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:underline px-4 py-2 rounded bg-blue-50 hover:bg-blue-100"
              >
                🔄 Retry
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="text-blue-600 hover:underline px-4 py-2 rounded bg-blue-50 hover:bg-blue-100"
              >
                ⬅️ Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

     const statsData = {
      totalGames: games.length,
      totalPlayers: games.reduce((acc, game) => acc + (game.participants?.length || 0), 0),
      highestTeamScore: highestTeamScore,
      highestIndividualScore: highestIndividualScore,
      activeGames: games.filter(g => g.status === 'active').length,
      totalTournaments: tournamentsList.length,
      
    };
  
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-400 p-3 sm:p-4 md:p-6 lg:p-8 font-sans">
          <AdminHeader />
          
          <StatsCards stats={statsData}  />
          
          {/* Tabbed Management Section */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
            {/* Tab Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-all duration-200
                      ${activeTab === tab.id 
                        ? 'bg-white text-blue-700 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
              
              {/* Action Button - changes based on active tab */}
              <button 
                  className={`bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow transition text-sm sm:text-base font-medium 
                    ${activeTab === 'games' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                  onClick={openModal}
                  disabled={activeTab === 'games'}
                >
                  <span className="hidden sm:inline">
                    {activeTab === 'games' ? 'Add New Game' : 'Add New Game Session'}
                  </span>
                  <span className="sm:hidden">
                    {activeTab === 'games' ? '+ New Game' : '+ New Game Session'}
                  </span>
                </button>

            </div>
            
            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'games' && (
                <div>
                  {/* Games List */}
                  <div className="games-list mb-6">
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Games</h3>
                    {games && games.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {games.map((game, index) => {
                          const gameId = getGameId(game, index);
                          
                          return (
                            <div 
                              key={gameId}
                              className="group relative bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl shadow-sm border border-blue-200/60 hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
                            >
                              <div className="p-4">
                                <div className="mb-3">
                                  <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2">{game.name || `Game ${index + 1}`}</h4>
                                  <div className="inline-flex items-center gap-2 mb-3">
                                   
                                    <span className="font-mono text-sm font-semibold text-gray-800 bg-white/60 px-2 py-1 rounded-lg border border-gray-200/50">
                                      {game.description}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1">
                                      {/* Player avatars */}
                                      {(game.players || game.participants || []).slice(0, 3).map((player, idx) => (
                                        <div 
                                          key={idx}
                                          className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-sm border-2 border-white"
                                          style={{ marginLeft: idx > 0 ? '-8px' : '0' }}
                                        >
                                          {player.name?.charAt(0) || player.charAt(0) || '?'}
                                        </div>
                                      ))}
                                      {(game.players?.length || game.participants?.length || 0) > 3 && (
                                        <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold shadow-sm border-2 border-white ml-1">
                                          +{(game.players?.length || game.participants?.length || 0) - 3}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Link to={`/game/${game._id}`}>
                                  <button 
                                    className="flex-1 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    onClick={() => selectGame(game)}
                                  >
                                    View Game
                                  </button>
                                  </Link>
                                  <button 
                                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/60 rounded-xl transition-all duration-200 group-hover:opacity-100 opacity-70"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Edit functionality
                                    }}
                                     disabled
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button 
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group-hover:opacity-100 opacity-70"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteGame(gameId);
                                    }}
                                     disabled
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m4 6V4a3 3 0 00-3-3H9a3 3 0 00-3 3v6m4 0a1 1 0 011 1v3a1 1 0 01-1 1H9a1 1 0 01-1-1v-3a1 1 0 011-1m4 0h2a1 1 0 011 1v3a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 011-1z" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">No games yet</h4>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">Start your gaming journey by creating your first game. It's quick and easy!</p>
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Create Your First Game
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Game Modal */}
                  <GameModal 
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onCreateGame={createGameFromModal}
                    gameManagerRef={gameManagerRef}
                  />
                </div>
              )}
              {activeTab === 'tournaments' && (
                <div>
                  {/* Tournaments List */}
                  <div className="tournaments-list mb-6">
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Game Sessions</h3>
                    {tournamentsList && tournamentsList.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tournamentsList.map((tournament, index) => {
                          const tournamentId = tournament.id || tournament._id || `tournament-${index}`;
                          const gamesCount = tournament.selectedGames?.length || 0;
                          const playersCount = tournament.players?.length || 0;
                          
                          return (
                            <div key={tournamentId} className="group relative bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl shadow-sm border border-green-200/60 hover:shadow-xl hover:border-green-300 transition-all duration-300 hover:-translate-y-1">
                              <div className="p-4">
                                <div className="mb-3">
                                  <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2">{tournament.name || `Game Session ${index + 1}`}</h4>
                                  <div className="inline-flex items-center gap-2 mb-3">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Code:</span>
                                    <span className="font-mono text-sm font-semibold text-gray-800 bg-white/60 px-2 py-1 rounded-xl border border-gray-200/50">
                                      {tournament.code || `SESS${tournamentId.slice(-6).toUpperCase()}`}
                                    </span>
                                  </div>
                                  
                                  {/* Games, Teams, and Players Display - Responsive layout */}
                                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                                    <div className="flex items-center gap-1 bg-white/80 px-2 py-1.5 rounded-lg border border-green-200/50 flex-shrink-0">
                                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                      </svg>
                                      <span className="font-bold text-green-700 text-sm">{gamesCount}</span>
                                      <span className="text-xs text-gray-600">Games</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 bg-white/80 px-2 py-1.5 rounded-lg border border-green-200/50 flex-shrink-0">
                                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                      </svg>
                                      <span className="font-bold text-green-700 text-sm">{tournament.teams?.length || 0}</span>
                                      <span className="text-xs text-gray-600">Teams</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 bg-white/80 px-2 py-1.5 rounded-lg border border-green-200/50 flex-shrink-0">
                                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                      </svg>
                                      <span className="font-bold text-green-700 text-sm">{playersCount}</span>
                                      <span className="text-xs text-gray-600">Players</span>
                                    </div>
                                  </div>

                                  {/* Additional tournament info */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      {/* Empty space to maintain layout */}
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                      {/* Participant avatars */}
                                      {(tournament.participants || []).slice(0, 3).map((participant, idx) => (
                                        <div 
                                          key={idx}
                                          className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold shadow-sm border-2 border-white"
                                          style={{ marginLeft: idx > 0 ? '-8px' : '0' }}
                                        >
                                          {participant.name?.charAt(0) || participant.charAt(0) || '?'}
                                        </div>
                                      ))}
                                      {(tournament.participants?.length || 0) > 3 && (
                                        <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold shadow-sm border-2 border-white ml-1">
                                          +{(tournament.participants?.length || 0) - 3}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                
                                  <div className="flex justify-end">
  <div className="flex items-center gap-2">
    {/* Status Label */}
    <span className={`text-sm font-medium ${tournament.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
      {tournament.status === 'active' ? 'Active' : 'Inactive'}
    </span>

    {/* Toggle Switch */}
    <button
      onClick={() => toggleStatusOptimistic(tournament.id)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        ${tournament.status == 'active' ? 'bg-green-500 focus:ring-green-500' : 'bg-gray-300 focus:ring-gray-400'}`}
    >
      {/* Optional Icon when Active */}
      {tournament.status == 'active' && (
        <span className="absolute left-1 text-white text-xs z-10">✓</span>
      )}
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform 
          ${tournament.status === "active" ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  </div>
</div>


                                </div>
                                <div className="flex gap-2">
                                  <Link to={`/tournament-scoring/${tournament.id}`} className="flex-1">
                                    <button className="w-full px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                                      View Game Session
                                    </button>
                                  </Link>
                                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/60 rounded-xl transition-all duration-200 group-hover:opacity-100 opacity-70">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  {/* <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group-hover:opacity-100 opacity-70">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button> */}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">No game sessions yet</h4>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">Create your first game session to start organizing competitive gaming events!</p>
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Create Your First Game Session
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tournament Modal */}
                  <TournamentModal 
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onCreateTournament={createTournamentFromModal}
                    isSubmitting={isSubmitting}
                    gamesList={games}
                  />
                </div>
              )}
            </div>
         
          </div>

          {/* Footer - Responsive text */}
          <footer className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-white">
            <p>&copy; 2025 Z Games. All rights reserved.</p>
          </footer>
        </div>

        <ToastContainer />
      </>
    );
  };
  
  export default AdminDashboard;