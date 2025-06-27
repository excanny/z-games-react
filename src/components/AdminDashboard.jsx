import React, { useState, useEffect } from "react";
import GameManager from "./GameManager";
import axiosClient from "../utils/axiosClient"; 
import { useAuth } from '../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';

const AdminDashboard = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();

    
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

    //Notification functions
    const gameCreatedNotification = () => toast('Game created successfully!');
      

    // Fetch games on component mount
    useEffect(() => {
      const initializeData = async () => {
        setLoading(true);
        setError(null);
        setLongLoading(false);
        
        try {
          await fetchGames();
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
  
    const selectGame = (game) => {
      setSelectedGame(game);
    };
  
    const deleteGame = (gameId) => {
      setGames(games.filter(g => g.id !== gameId));
      if (selectedGame?.id === gameId) {
        setSelectedGame(null);
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
  
    const totalGames = games.length;
    const totalPlayers = games.reduce((acc, game) => acc + (game.participants?.length || 0), 0);
 
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-400 p-3 sm:p-4 md:p-6 lg:p-8 font-sans">
          {/* Header - Responsive text sizes */}
          <header className="text-center mb-8 sm:mb-10 lg:mb-12 text-white px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Z Games Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-blue-200 max-w-2xl mx-auto">
              Manage games, players, and scores in real-time
            </p>
          </header>
          
          {/* Stats Cards - Responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
            <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-center text-white">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{totalGames}</h2>
              <p className="mt-1 text-xs sm:text-sm text-blue-200">Total Games</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-center text-white">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{totalPlayers}</h2>
              <p className="mt-1 text-xs sm:text-sm text-blue-200">Total Players</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-center text-white">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">0</h2>
              <p className="mt-1 text-xs sm:text-sm text-blue-200">Highest Score</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-center text-white">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{games.filter(g => g.status === 'active').length}</h2>
              <p className="mt-1 text-xs sm:text-sm text-blue-200">Active Games</p>
            </div>
          </div>
          
          {/* Game Management Section - Responsive padding and spacing */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-4 sm:mb-6 gap-3 sm:gap-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-700">Game Management</h3>
              <button 
                className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow hover:scale-105 transition text-sm sm:text-base font-medium" 
                onClick={openModal}
              >
                <span className="hidden sm:inline">Add New Game</span>
                <span className="sm:hidden">+ New Game</span>
              </button>
            </div>
            
            <GameManager 
              ref={gameManagerRef}
              games={games} // Pass games from AdminDashboard
              onCreateGame={createGame}
              onSelectGame={selectGame}
              selectedGame={selectedGame}
              onDeleteGame={deleteGame}
            />
          </div>

          {/* Footer - Responsive text */}
          <footer className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-white">
            <p>&copy; 2025 Z Games. All rights reserved.</p>
          </footer>
        </div>

       {/* Modal - Fully responsive */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative animate-fade-in-down">
      
      {/* Close Button - Responsive positioning */}
      <button 
        onClick={closeModal} 
        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-red-500 text-xl sm:text-2xl font-bold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        disabled={isSubmitting}
      >
        ×
      </button>
      
      {/* Header - Responsive text */}
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-800 mb-4 text-center pr-8 sm:pr-0">
        Create New Game
      </h2>
      
      {/* Game Info - Responsive inputs */}
      <div className="space-y-3 mb-4 sm:mb-6">
        <input 
          type="text" 
          value={gameForm.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter game name" 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:ring focus:outline-none text-sm sm:text-base"
          disabled={isSubmitting}
        />
        <textarea 
          value={gameForm.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description of the game" 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:ring focus:outline-none resize-none text-sm sm:text-base"
          rows="2"
          disabled={isSubmitting}
        />
      </div>
      
      {/* Participants Section - Responsive layout */}
      <div className="border-t pt-4">
        <h3 className="text-base sm:text-lg font-semibold text-green-600 text-center mb-4">
          Add Participants (<span>{participants.length}</span>) 
          <span className="text-red-500 text-xs sm:text-sm font-normal block sm:inline"> *Required</span>
        </h3>
        
        {participantsToAdd.length === 0 ? (
          <>
            {/* Bulk Entry - Responsive layout */}
            <div className="bg-green-50 rounded-lg p-3 sm:p-4 mb-4">
              <h4 className="font-medium text-green-800 mb-2 sm:mb-3 text-sm sm:text-base">
                Add Multiple Participants
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                Enter participant names, one per line:
              </p>
              <textarea
                value={bulkParticipants}
                onChange={(e) => setBulkParticipants(e.target.value)}
                placeholder="Player 1&#10;Player 2&#10;Player 3"
                className="w-full h-20 sm:h-24 border border-gray-300 rounded-md p-2 sm:p-3 text-gray-800 text-xs sm:text-sm"
                disabled={isSubmitting}
              />
              <div className="flex justify-center mt-2 sm:mt-3">
                <button
                  onClick={processBulkParticipantNames}
                  disabled={!bulkParticipants.trim() || isSubmitting}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Customize Participants
                </button>
              </div>
            </div>
          </>
        ) : (
          // Step 2: Customize avatars and colors - Responsive grid
          <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 mb-4">
            <h4 className="font-medium text-yellow-800 mb-2 sm:mb-3 text-sm sm:text-base">
              Customize Each Participant's Avatar and Color:
            </h4>
            <div className="space-y-3 sm:space-y-4 max-h-48 sm:max-h-64 overflow-y-auto">
              {participantsToAdd.map((participant) => (
                <div key={participant.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-xl"
                        style={{ backgroundColor: participant.color }}
                      >
                        {participant.avatar}
                      </div>
                      <span className="font-medium text-gray-800 text-sm sm:text-base truncate">
                        {participant.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeParticipantFromList(participant.id)}
                      className="text-red-500 hover:text-red-700 text-xs sm:text-sm px-2 py-1 rounded hover:bg-red-50"
                      disabled={isSubmitting}
                    >
                      ✕ Remove
                    </button>
                  </div>
                  
                  {/* Avatar Selection - Responsive grid */}
                  <div className="mb-2 sm:mb-3">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Avatar:
                    </label>
                    <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
                      {availableAvatars.slice(0, 12).map((avatar) => (
                        <button
                          key={avatar}
                          onClick={() => updateParticipantDetails(participant.id, 'avatar', avatar)}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm hover:scale-110 transition-transform ${
                            participant.avatar === avatar 
                              ? 'ring-2 ring-blue-500 bg-blue-100' 
                              : 'hover:bg-gray-100'
                          }`}
                          disabled={isSubmitting}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Color Selection - Responsive grid */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Color:
                    </label>
                    <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
                      {availableColors.slice(0, 12).map((color) => (
                        <button
                          key={color}
                          onClick={() => updateParticipantDetails(participant.id, 'color', color)}
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:scale-110 transition-transform ${
                            participant.color === color 
                              ? 'ring-2 ring-gray-600' 
                              : ''
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                          disabled={isSubmitting}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Action buttons - Responsive layout */}
            <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
              <button
                onClick={confirmParticipants}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md font-medium text-xs sm:text-sm"
                disabled={isSubmitting}
              >
                Add {participantsToAdd.length} Participants
              </button>
              <button
                onClick={() => setParticipantsToAdd([])}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm"
                disabled={isSubmitting}
              >
                ← Back to Names
              </button>
            </div>
          </div>
        )}
        
        {/* Warning message - Responsive */}
        {participants.length === 0 && (
          <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-amber-600 bg-amber-50 p-2 sm:p-3 rounded-lg">
            ⚠️ Please add at least one participant to create a game.
          </div>
        )}
        
        {/* Participant List - Responsive */}
        {participants.length > 0 && (
          <div className="mt-3 sm:mt-4 max-h-32 sm:max-h-40 overflow-y-auto">
            <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Participants Added:
            </div>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
              {participants.map(participant => (
                <li key={participant.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div 
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs flex-shrink-0"
                      style={{ backgroundColor: participant.color }}
                    >
                      {getAvatarEmoji(participant.avatar)}
                    </div>
                    <span className="font-medium truncate">{participant.name}</span>
                  </div>
                  <button 
                    onClick={() => removeParticipant(participant.id)}
                    className="text-red-500 hover:text-red-700 font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-red-100 flex items-center justify-center text-xs sm:text-sm flex-shrink-0 ml-2"
                    title="Remove participant"
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Submit Game - Responsive buttons */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
        <button 
          onClick={submitGame} 
          disabled={!gameForm.name.trim() || participants.length === 0 || isSubmitting}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-4 py-3 sm:px-6 sm:py-3 rounded-full hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
          title={!gameForm.name.trim() || participants.length === 0 ? 'Please enter a game name and add at least one participant' : 'Create the game'}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin inline-block w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Creating...
            </>
          ) : (
            <>
              <span className="sm:hidden">🎮 Create</span>
              <span className="hidden sm:inline">🎮 Create Game</span>
            </>
          )}
        </button>
        <button 
          onClick={closeModal}
          className="px-4 py-3 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition text-sm sm:text-base"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
        <ToastContainer />
      </>
    );
  };
  
  export default AdminDashboard;