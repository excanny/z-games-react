import React, { useState, useEffect } from "react";
import axios from "axios";
import GameManager from "./GameManager";

const AdminDashboard = () => {
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [gameForm, setGameForm] = useState({
      name: '',
      description: '',
      participantName: '',
      participantAvatar: 'fox',
      participantColor: '#FF5733'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const gameManagerRef = React.useRef();

    // Fetch games on component mount
    useEffect(() => {
      fetchGames();
    }, []);

    // Fetch games from API
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        setGames(response.data.data || response.data || []);
      } catch (error) {
        console.error('Error fetching games:', error);
        setGames([]);
      }
    };

    // Updated createGame to handle game data from API responses
    const createGame = async (gameData) => {
      try {
        // Update local state with the new game
        setGames(prev => [...prev, gameData]);
      } catch (error) {
        console.error('Error in createGame:', error);
      }
    };

    // Direct API call for modal game creation (bypassing GameManager)
    const createGameFromModal = async (gameData) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post('http://localhost:5000/api/games', gameData);
        
        // Update local state immediately
        setGames(prev => [...prev, response.data]);
        
        return response.data;
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
  
    const updateGame = (updatedGame) => {
      setGames(games.map(g => g.id === updatedGame.id ? updatedGame : g));
      setSelectedGame(updatedGame);
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
      setGameForm({
        name: '',
        description: '',
        participantName: '',
        participantAvatar: 'fox',
        participantColor: '#FF5733'
      });
      setIsSubmitting(false);
    };

    const handleInputChange = (field, value) => {
      setGameForm(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const addParticipant = () => {
      if (gameForm.participantName.trim()) {
        // Check for duplicate names
        const nameExists = participants.some(p => 
          p.name.toLowerCase() === gameForm.participantName.trim().toLowerCase()
        );
        
        if (nameExists) {
          alert('A participant with this name already exists!');
          return;
        }

        const newParticipant = {
          id: Date.now() + Math.random(),
          name: gameForm.participantName.trim(),
          avatar: gameForm.participantAvatar,
          color: gameForm.participantColor
        };
        setParticipants(prev => [...prev, newParticipant]);
        setGameForm(prev => ({
          ...prev,
          participantName: '',
          participantAvatar: 'fox',
          participantColor: '#FF5733'
        }));
      }
    };

    const removeParticipant = (participantId) => {
      setParticipants(prev => prev.filter(p => p.id !== participantId));
    };

    // Fixed submitGame function to use direct API call
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
      const avatarMap = {
        fox: '🦊', cat: '🐱', dog: '🐶', bear: '🐻',
        rabbit: '🐰', wolf: '🐺', owl: '🦉', dragon: '🐉'
      };
      return avatarMap[avatar] || '🎮';
    };
  
    const totalGames = games.length;
    const totalPlayers = games.reduce((acc, game) => acc + (game.participants?.length || 0), 0);
 
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-400 p-8 font-sans">
          <header className="text-center mb-12 text-white">
            <h1 className="text-4xl font-bold">Z Games Admin Dashboard</h1>
            <p className="text-base text-blue-200">Manage games, players, and scores in real-time</p>
          </header>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur rounded-2xl shadow-lg p-6 text-center text-white">
              <h2 className="text-3xl font-bold">{totalGames}</h2>
              <p className="mt-1 text-sm text-blue-200">Total Games</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl shadow-lg p-6 text-center text-white">
              <h2 className="text-3xl font-bold">{totalPlayers}</h2>
              <p className="mt-1 text-sm text-blue-200">Total Players</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl shadow-lg p-6 text-center text-white">
              <h2 className="text-3xl font-bold">0</h2>
              <p className="mt-1 text-sm text-blue-200">Highest Score</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl shadow-lg p-6 text-center text-white">
              <h2 className="text-3xl font-bold">{games.filter(g => g.status === 'active').length}</h2>
              <p className="mt-1 text-sm text-blue-200">Active Games</p>
            </div>
          </div>
          
          {/* Game Management Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h3 className="text-2xl font-semibold text-blue-700">Game Management</h3>
              <button 
                className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition" 
                onClick={openModal}
              >
                Add New Game
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

          <footer className="mt-6 text-center text-sm text-white">
            <p>&copy; 2025 Z Games. All rights reserved.</p>
          </footer>
        </div>

       {/* Modal */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative animate-fade-in-down">
      
      {/* Close Button */}
      <button 
        onClick={closeModal} 
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
        disabled={isSubmitting}
      >
        ×
      </button>
      
      {/* Header */}
      <h2 className="text-2xl font-semibold text-blue-800 mb-4 text-center">Create New Game</h2>
      
      {/* Game Info */}
      <div className="space-y-3">
        <input 
          type="text" 
          value={gameForm.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter game name" 
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:outline-none"
          disabled={isSubmitting}
        />
        <textarea 
          value={gameForm.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description of the game" 
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:outline-none resize-none"
          rows="2"
          disabled={isSubmitting}
        />
      </div>
      
      {/* Participants Section */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold text-green-600 text-center">
          Add Participants (<span>{participants.length}</span>) <span className="text-red-500 text-sm font-normal">*Required</span>
        </h3>
        
        {/* Input Group with Labels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          
          {/* Participant Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-700">Name</label>
            <input 
              type="text" 
              value={gameForm.participantName}
              onChange={(e) => handleInputChange('participantName', e.target.value)}
              placeholder="Team/Individual Name" 
              className="border border-gray-300 rounded-lg px-3 py-2"
              disabled={isSubmitting}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addParticipant();
                }
              }}
            />
          </div>
          
          {/* Participant Avatar */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-700">Avatar</label>
            <select 
              value={gameForm.participantAvatar}
              onChange={(e) => handleInputChange('participantAvatar', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
              disabled={isSubmitting}
            >
              <option value="fox">🦊 Fox</option>
              <option value="cat">🐱 Cat</option>
              <option value="dog">🐶 Dog</option>
              <option value="bear">🐻 Bear</option>
              <option value="rabbit">🐰 Rabbit</option>
              <option value="wolf">🐺 Wolf</option>
              <option value="owl">🦉 Owl</option>
              <option value="dragon">🐉 Dragon</option>
            </select>
          </div>
          
          {/* Participant Color */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-700">Color</label>
            <input 
              type="color" 
              value={gameForm.participantColor}
              onChange={(e) => handleInputChange('participantColor', e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-300"
              disabled={isSubmitting}
            />
          </div>

        </div>
        
        {/* Add Participant */}
        <div className="flex justify-center mt-3">
          <button 
            onClick={addParticipant}
            disabled={!gameForm.participantName.trim() || isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:scale-105 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            ➕ Add Participant
          </button>
        </div>
        
        {/* Show message when no participants */}
        {participants.length === 0 && (
          <div className="mt-4 text-center text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            ⚠️ Please add at least one participant to create a game.
          </div>
        )}
        
        {/* Participant List */}
        {participants.length > 0 && (
          <div className="mt-4 max-h-32 overflow-y-auto">
            <div className="text-sm font-medium text-gray-700 mb-2">Participants Added:</div>
            <ul className="space-y-2 text-sm text-gray-700">
              {participants.map(participant => (
                <li key={participant.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs"
                      style={{ backgroundColor: participant.color }}
                    >
                      {getAvatarEmoji(participant.avatar)}
                    </div>
                    <span className="font-medium">{participant.name}</span>
                    <span className="text-gray-500 capitalize">({participant.avatar})</span>
                  </div>
                  <button 
                    onClick={() => removeParticipant(participant.id)}
                    className="text-red-500 hover:text-red-700 font-bold w-6 h-6 rounded-full hover:bg-red-100 flex items-center justify-center"
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
      
      {/* Submit Game */}
      <div className="flex space-x-3 mt-6">
        <button 
          onClick={submitGame} 
          disabled={!gameForm.name.trim() || participants.length === 0 || isSubmitting}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-2 rounded-full hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          title={!gameForm.name.trim() || participants.length === 0 ? 'Please enter a game name and add at least one participant' : 'Create the game'}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Creating...
            </>
          ) : (
            '🎮 Create Game'
          )}
        </button>
        <button 
          onClick={closeModal}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      </>
    );
  };
  
  export default AdminDashboard;