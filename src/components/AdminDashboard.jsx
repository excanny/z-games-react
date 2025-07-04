import React, { useState, useEffect } from "react";
import GameManager from "./GameManager";
import axiosClient from "../utils/axiosClient"; 
import { useAuth } from '../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import AdminHeader from './AdminHeader';
import StatsCards from './StatsCards';
import GameModal from './GameModal';
import TournamentModal from './TournamentModal';

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
      { id: 'tournaments', label: 'Add Tournament', icon: '🏆' }
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
    const tournamentCreatedNotification = () => toast('Tournament created successfully!');
      
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
        const gamesData = response.data.data || response.data || [];
        console.log('Fetched games:', gamesData); // Debug log
        setGames(gamesData);
      } catch (error) {
        console.error('Error fetching games:', error);
        setGames([]);
        throw error; // Re-throw to be caught by useEffect
      }
    };

    const fetchTournaments = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/tournaments');
          const tournaments = await response.json();
           console.log('Fetched tournaments:', tournaments); // Debug log
       
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
        console.log('API Response:', response); // Debug log
        
        // Handle different response structures consistently
        const newGame = response.data.data || response.data;
        console.log('New game data:', newGame); // Debug log

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
        // Add your tournament creation API call here
        // const response = await axiosClient.post('/tournaments', tournamentData);
        console.log('Creating tournament:', tournamentData);
        
        tournamentCreatedNotification();
        
        // You would refresh tournaments list here
        await fetchTournaments();
        
        return tournamentData;
      } catch (error) {
        console.error('Error creating tournament:', error);
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

          console.log('Submitting game data:', gameData); // Debug log

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

          console.log('Submitting tournament data:', tournamentData);

          await createTournamentFromModal(tournamentData);
          
          closeModal();
          
        } catch (error) {
          console.error('Error creating tournament:', error);
          alert('Failed to create tournament. Please try again.');
        }
      } else {
        alert('Please enter a tournament name and add at least one participant.');
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
      highestScore: 0,
      activeGames: games.filter(g => g.status === 'active').length
    };
  
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-400 p-3 sm:p-4 md:p-6 lg:p-8 font-sans">
          <AdminHeader />
          
          <StatsCards stats={statsData} />
          
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
                className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow hover:scale-105 transition text-sm sm:text-base font-medium" 
                onClick={openModal}
              >
                <span className="hidden sm:inline">
                  {activeTab === 'games' ? 'Add New Game' : 'Add New Tournament'}
                </span>
                <span className="sm:hidden">
                  {activeTab === 'games' ? '+ New Game' : '+ New Tournament'}
                </span>
              </button>
            </div>
            
            {/* Tab Content */}
<div className="tab-content">
  {activeTab === 'games' && (
    <div>
      {/* Games List */}
      <div className="games-list mb-4">
        <h3 className="text-lg font-semibold mb-3">Created Games</h3>
        {games && games.length > 0 ? (
          <div className="space-y-2">
            {games.map((game, index) => {
              const gameId = getGameId(game, index);
              const isSelected = isGameSelected(gameId);
              
              return (
                <div 
                  key={gameId}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-blue-100 border-blue-300 shadow-md' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handleGameSelect(gameId)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleGameSelect(gameId);
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <h4 className="font-medium">{game.name || `Game ${index + 1}`}</h4>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        Players: {game.players?.length || game.participants?.length || 0} | 
                        Status: {game.status || 'Active'}
                      </p>
                      {game.description && (
                        <p className="text-sm text-gray-500 mt-1 ml-6">{game.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        onClick={() => selectGame(game)}
                      >
                        View
                      </button>
                      <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
                        Edit
                      </button>
                      <button 
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        onClick={() => deleteGame(gameId)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No games created yet</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Your First Game
            </button>
          </div>
        )}
        
        {/* Bulk Actions */}
        {selectedGames.size > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">
                {selectedGames.size} game{selectedGames.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${selectedGames.size} game(s)?`)) {
                      selectedGames.forEach(gameId => deleteGame(gameId));
                    }
                  }}
                >
                  Delete Selected
                </button>
                <button 
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={() => setSelectedGames(new Set())}
                >
                  Clear Selection
                </button>
              </div>
            </div>
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
      <div className="tournaments-list mb-4">
        <h3 className="text-lg font-semibold mb-3">Created Tournaments</h3>
        {tournamentsList && tournamentsList.length > 0 ? (
          <div className="space-y-2">
            {tournamentsList.map((tournament, index) => {
              const tournamentId = tournament.id || tournament._id || `tournament-${index}`;
              
              return (
                <div key={tournamentId} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{tournament.name || `Tournament ${index + 1}`}</h4>
                      <p className="text-sm text-gray-600">
                        Games: {tournament.games?.length || 0} | 
                        Participants: {tournament.participants?.length || 0} |
                        Status: {tournament.status || 'Active'}
                      </p>
                      {tournament.description && (
                        <p className="text-sm text-gray-500 mt-1">{tournament.description}</p>
                      )}
                      {tournament.startDate && (
                        <p className="text-sm text-gray-500">
                          Start Date: {new Date(tournament.startDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                        View
                      </button>
                      <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No tournaments created yet</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Create Your First Tournament
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