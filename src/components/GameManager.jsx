import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback, useRef } from "react";
import { Link } from 'react-router-dom';
import axiosClient from "../utils/axiosClient"; 

const GameManager = forwardRef(({ onCreateGame, games: propGames }, ref) => {
  // Use games from props if available, otherwise maintain local state
  const [localGames, setLocalGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  
  const games = propGames || localGames;
  const observer = useRef();
  const ITEMS_PER_PAGE = 12; // Adjust based on your needs

  // Ref callback for the last game element to trigger infinite scroll
  const lastGameElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !propGames) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, propGames]);

  useEffect(() => {
    // Only fetch games if not provided via props
    if (!propGames) {
      fetchGames(1, true); // Reset to page 1 on mount
    }
  }, [propGames]);

  // Fetch more games when page changes
  useEffect(() => {
    if (!propGames && page > 1) {
      fetchGames(page, false);
    }
  }, [page, propGames]);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    createGameFromModal: async (gameData) => {
      return await handleCreateGameFromModal(gameData);
    },
    refreshGames: () => {
      if (!propGames) {
        setPage(1);
        setHasMore(true);
        setError(null);
        fetchGames(1, true);
      }
    }
  }));

  // Handle game creation from modal (AdminDashboard)
  const handleCreateGameFromModal = async (gameData) => {
    try {
      const response = await axiosClient.post('/games', gameData);
      
      // Handle different response structures consistently
      const newGame = response.data.data || response.data;
      
      // Only update local games if we're managing our own state
      if (!propGames) {
        setLocalGames(prev => [newGame, ...prev]); // Add new game to the beginning
      }
      
      // Call the callback with the server response
      if (onCreateGame) {
        onCreateGame(newGame);
      }
      
      return newGame;
    } catch (error) {
      console.error('Error creating game from modal:', error);
      throw error;
    }
  };

  const fetchGames = async (pageNum = 1, reset = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosClient.get(`/games?page=${pageNum}&limit=${ITEMS_PER_PAGE}`);
      
      // Handle different response structures
      let gamesData = [];
      let totalCount = 0;
      
      if (response.data.data) {
        // If API returns paginated data with meta info
        gamesData = response.data.data;
        totalCount = response.data.total || response.data.count || gamesData.length;
      } else if (Array.isArray(response.data)) {
        // If API returns array directly
        gamesData = response.data;
        totalCount = gamesData.length;
      } else {
        gamesData = [];
      }
      
      if (reset) {
        setLocalGames(gamesData);
      } else {
        setLocalGames(prev => [...prev, ...gamesData]);
      }
      
      // Check if there are more games to load
      const currentTotal = reset ? gamesData.length : localGames.length + gamesData.length;
      setHasMore(gamesData.length === ITEMS_PER_PAGE && currentTotal < totalCount);
      
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Failed to load games. Please try again.');
      if (reset) {
        setLocalGames([]); // Set empty array on error to prevent undefined issues
      }
    } finally {
      setLoading(false);
    }
  };

  const icons = ['👤', '👥', '🧑', '👩‍💻', '🧔', '👨‍💻', '🧕', '👨', '👩', '🧑‍🦱'];

  // Create a stable key for each game that changes when the games array changes
  const getGameKey = (game, index) => {
    return `${game._id || game.id || index}-${games.length}`;
  };

  // Retry function for error state
  const handleRetry = () => {
    setError(null);
    setPage(1);
    setHasMore(true);
    fetchGames(1, true);
  };

  // Check if game is deactivated
  const isGameDeactivated = (game) => {
    return game.status === 'inactive' || 
           game.status === 'completed' || 
           game.status === 'deactivated' ||
           game.status === 'ended';
  };

  // Prevent all click events for deactivated games
  const handleDeactivatedClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Game Card Component
  const GameCard = ({ game, index }) => {
    const isDeactivated = isGameDeactivated(game);
    
    const cardContent = (
      <div 
        className={`
          relative rounded-xl p-3 shadow-md transition-all duration-200
          ${isDeactivated 
            ? 'bg-gray-100 opacity-60 cursor-not-allowed' 
            : 'bg-blue-50 hover:shadow-lg cursor-pointer'
          }
        `}
        ref={index === games.length - 1 ? lastGameElementRef : null}
        // Prevent all interactions on deactivated games
        onClick={isDeactivated ? handleDeactivatedClick : undefined}
        onMouseDown={isDeactivated ? handleDeactivatedClick : undefined}
        onMouseUp={isDeactivated ? handleDeactivatedClick : undefined}
        onTouchStart={isDeactivated ? handleDeactivatedClick : undefined}
        onTouchEnd={isDeactivated ? handleDeactivatedClick : undefined}
        style={isDeactivated ? { pointerEvents: 'none' } : {}}
      >
        {/* Deactivated overlay */}
        {isDeactivated && (
          <div className="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-xl flex items-center justify-center z-10">
            <span className="text-gray-500 font-semibold text-sm bg-white px-3 py-1 rounded-full shadow">
              DEACTIVATED
            </span>
          </div>
        )}
        
        {/* Game content */}
        <div className={isDeactivated ? 'text-gray-400' : ''}>
          <h4 className={`text-xl font-semibold mb-1 ${isDeactivated ? 'text-gray-500' : 'text-blue-800'}`}>
            {game.name || 'Untitled Game'}
          </h4>
          
          <p className={`text-sm mb-2 ${isDeactivated ? 'text-gray-400' : 'text-gray-600'}`}>
            Code: <span className="font-mono">{game.gameCode || 'N/A'}</span>
          </p>
          
          <div className="flex justify-between items-center mb-4">
            <span 
              className={`text-xs px-2 py-1 rounded-full ${
                isDeactivated 
                  ? 'bg-gray-200 text-gray-500' 
                  : 'bg-blue-200 text-blue-800'
              }`}
            >
              {game.participants?.length || 0} participants
            </span>
            
            <div className="flex space-x-1 text-lg">
              {game.participants?.slice(0, 3).map((participant, participantIndex) => {
                const randomIcon = icons[Math.floor(Math.random() * icons.length)];
                return (
                  <span 
                    key={`${participant.id || participantIndex}-${participantIndex}`}
                    className={isDeactivated ? 'grayscale opacity-50' : ''}
                  >
                    {randomIcon}
                  </span>
                );
              })}
              {game.participants?.length > 3 && (
                <span className={isDeactivated ? 'text-gray-400' : ''}>...</span>
              )}
            </div>
          </div>
          
          {/* Status badge */}
          {game.status && (
            <div className="mb-3">
              <span 
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  game.status === 'active' && !isDeactivated
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {game.status.toUpperCase()}
              </span>
            </div>
          )}
          
          <button 
            className={`
              w-full text-sm py-2 rounded-full transition
              ${isDeactivated 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:scale-105'
              }
            `}
            onClick={isDeactivated ? handleDeactivatedClick : (e) => {
              e.preventDefault();
              e.stopPropagation();
             
            }}
            disabled={isDeactivated}
            tabIndex={isDeactivated ? -1 : 0}
          >
            {isDeactivated ? 'Game Deactivated' : 'View Game'}
          </button>
        </div>
      </div>
    );

    return (
      <div key={getGameKey(game, index)}>
        {isDeactivated ? (
          // For deactivated games, return just the card content without Link wrapper
          <div 
            onClick={handleDeactivatedClick}
            onMouseDown={handleDeactivatedClick}
            onMouseUp={handleDeactivatedClick}
            onTouchStart={handleDeactivatedClick}
            onTouchEnd={handleDeactivatedClick}
            style={{ pointerEvents: 'none' }}
          >
            {cardContent}
          </div>
        ) : (
          // For active games, wrap with Link
          <Link 
            to={`/game/${game._id || game.id}`}
            className="block"
          >
            {cardContent}
          </Link>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {games.length === 0 && !loading && !error ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p>No games created yet. Click "Add New Game" to get started!</p>
          </div>
        ) : (
          games.map((game, index) => (
            <GameCard 
              key={getGameKey(game, index)}
              game={game} 
              index={index} 
            />
          ))
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading more games...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={handleRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore && games.length > 0 && !propGames && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end of the games list!</p>
        </div>
      )}
    </div> 
  );
});

export default GameManager;