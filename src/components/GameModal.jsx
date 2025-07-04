import React, { useState } from 'react';
//import ParticipantSection from './ParticipantSection';

const GameModal = ({ isOpen, onClose, onCreateGame, gameManagerRef }) => {
  const [participants, setParticipants] = useState([]);
  const [gameForm, setGameForm] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setGameForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    setParticipants([]);
    setGameForm({
      name: '',
      description: ''
    });
    setIsSubmitting(false);
    onClose();
  };

  const submitGame = async () => {
    if (gameForm.name.trim() && participants.length > 0) {
      setIsSubmitting(true);
      try {
        const gameData = {
          name: gameForm.name.trim(),
          description: gameForm.description.trim(),
          participants: participants
        };

        console.log('Submitting game data:', gameData);
        await onCreateGame(gameData);
        
        handleClose();
        
        if (gameManagerRef.current && gameManagerRef.current.refreshGames) {
          gameManagerRef.current.refreshGames();
        }
        
      } catch (error) {
        console.error('Error creating game:', error);
        alert('Failed to create game. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Please enter a game name and add at least one participant.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative animate-fade-in-down">
        
        {/* Close Button */}
        <button 
          onClick={handleClose} 
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-red-500 text-xl sm:text-2xl font-bold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          disabled={isSubmitting}
        >
          ×
        </button>
        
        {/* Header */}
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-800 mb-4 text-center pr-8 sm:pr-0">
          Create New Game
        </h2>
        
        {/* Game Info */}
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
        
        {/* <ParticipantSection 
          participants={participants}
          setParticipants={setParticipants}
          isSubmitting={isSubmitting}
        /> */}
        
        {/* Submit Game */}
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
            onClick={handleClose}
            className="px-4 py-3 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition text-sm sm:text-base"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModal;