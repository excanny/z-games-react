import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const GameManager = forwardRef(({ onCreateGame, selectedGame, games: propGames }, ref) => {

  // Use games from props if available, otherwise maintain local state
  const [localGames, setLocalGames] = useState([]);
  const games = propGames || localGames;

  const [newGame, setNewGame] = useState({ 
    name: '', 
    description: '',
    participants: []
  });
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    avatar: 'fox', // Set default avatar
    color: '#FF5733' // Set default color
  });

  useEffect(() => {
    // Only fetch games if not provided via props
    if (!propGames) {
      fetchGames();
    }
  }, [propGames]);

  const avatarOptions = ['fox', 'cat', 'dog', 'bear', 'rabbit', 'wolf', 'owl', 'dragon'];
  const colorOptions = ['#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33', '#33FFF5', '#FF8C33', '#8C33FF'];

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    createGameFromModal: async (gameData) => {
      return await handleCreateGameFromModal(gameData);
    }
  }));

  // Handle game creation from modal (AdminDashboard)
  const handleCreateGameFromModal = async (gameData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/games', gameData);
      
      // Only update local games if we're managing our own state
      if (!propGames) {
        setLocalGames(prev => [...prev, response.data]);
      }
      
      // Call the callback with the server response
      if (onCreateGame) {
        onCreateGame(response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating game from modal:', error);
      throw error;
    }
  };
  
  // Handle game creation from GameManager's own form
  const handleCreateGame = async () => {
    if (newGame.name.trim() && newGame.participants.length > 0) {
      try {
        const gameData = {
          name: newGame.name,
          description: newGame.description,
          participants: newGame.participants
        };
  
        const response = await axios.post('http://localhost:5000/api/games', gameData);
        
        // Only update local games if we're managing our own state
        if (!propGames) {
          setLocalGames(prev => [...prev, response.data]);
        }
        
        // Call the callback with the server response (which should include id, createdAt, status)
        if (onCreateGame) {
          onCreateGame(response.data);
        }
        
        // Reset form state
        setNewGame({ 
          name: '', 
          description: '', 
          participants: []
        });
        setNewParticipant({
          name: '',
          avatar: 'fox',
          color: '#FF5733'
        });
        
      } catch (error) {
        console.error('Error creating game:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  const fetchGames = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/games'); 
      setLocalGames(response.data.data || response.data || []); // Handle different response structures
    } catch (err) {
      console.error('Error fetching games:', err);
      setLocalGames([]); // Set empty array on error to prevent undefined issues
    }
  };

  const addParticipantToNewGame = () => {
    // Check if name is provided
    if (newParticipant.name.trim()) {
      // Check if participant name already exists
      const nameExists = newGame.participants.some(p => 
        p.name.toLowerCase() === newParticipant.name.trim().toLowerCase()
      );
      
      if (nameExists) {
        alert('A participant with this name already exists!');
        return;
      }

      const participant = {
        ...newParticipant,
        id: Date.now() + Math.random(), // Make ID more unique
        name: newParticipant.name.trim()
      };
      
      setNewGame(prev => ({
        ...prev,
        participants: [...prev.participants, participant]
      }));
      
      // Reset participant form
      setNewParticipant({
        name: '',
        avatar: 'fox',
        color: '#FF5733'
      });
    }
  };

  const removeParticipantFromNewGame = (participantId) => {
    setNewGame(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== participantId)
    }));
  };

  const getAvatarEmoji = (avatar) => {
    const avatarMap = {
      fox: '🦊', cat: '🐱', dog: '🐶', bear: '🐻',
      rabbit: '🐰', wolf: '🐺', owl: '🦉', dragon: '🐉'
    };
    return avatarMap[avatar] || '🎮';
  };

  const icons = ['👤', '👥', '🧑', '👩‍💻', '🧔', '👨‍💻', '🧕', '👨', '👩', '🧑‍🦱'];

  // Check if game creation should be disabled
  const isCreateDisabled = !newGame.name.trim() || newGame.participants.length === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {games.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          <p>No games created yet. Click "Add New Game" to get started!</p>
        </div>
      ) : (
        games.map(game => (
          <Link key={game._id} to={`/game/${game._id}`}>
            <div className="bg-blue-50 rounded-xl p-3 shadow-md hover:shadow-lg transition">
              <h4 className="text-xl font-semibold text-blue-800 mb-1">{game.name || 'Untitled Game'}</h4>
              <p className="text-sm text-gray-600 mb-2">
                Code: <span className="font-mono">{game.gameCode || 'N/A'}</span>
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                  {game.participants?.length || 0} participants
                </span>
                <div className="flex space-x-1 text-lg">
                  {game.participants?.slice(0, 3).map((participant, index) => {
                    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
                    return <span key={index}>{randomIcon}</span>;
                  })}
                  {game.participants?.length > 3 && <span>...</span>}
                </div>
              </div>
              <button 
                className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm py-2 rounded-full hover:scale-105 transition"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle game selection if needed
                }}
              >
                View Game
              </button>
            </div>
          </Link>
        ))
      )}
    </div> 
  );
});

GameManager.displayName = 'GameManager';

export default GameManager;