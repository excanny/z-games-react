import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient'; 

const SingleGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState({
    name: 'Loading...',
    gameCode: '',
    icon: '🎮',
    description: '',
    type: '',
    rules: [],
    timeLimit: 0,
    minPlayers: 0,
    maxPlayers: null,
    equipment: [],
    pointSystem: null,
    applicableSuperpowers: [],
    prizes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getGameDetails = async (gameId) => {
    try {
      const response = await axiosClient.get(`/games/${gameId}`);
      console.log('Game details:', response.data.data);
      setCurrentGame(response.data.data);
    } catch (err) {
      console.error('Error fetching game details:', err);
      setError(err.message);
      // Fallback game data
      setCurrentGame({
        name: `Game ${gameId}`,
        gameCode: gameId,
        icon: '🎮'
      });
    }
  };

  // Fetch game details when component mounts or gameId changes
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await getGameDetails(gameId);
      } catch (err) {
        console.error('Error initializing data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initializeData();
  }, [gameId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading game data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Error loading game</h2>
          <p className="mb-4">{error}</p>
          <div className="mt-4">
            <button 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:underline"
            >
              ⬅️ Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-700 min-h-screen text-white px-4 sm:px-6">
      <div className="max-w-5xl mx-auto py-6">
        {/* Header */}
        <div className="bg-blue-600 rounded-2xl p-6 shadow-xl mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
                {currentGame.icon} <span>{currentGame.name}</span>
              </h1>
              <p className="mt-2 text-sm text-blue-100">
                Game Code:  
                <span className="inline-block bg-blue-800 text-yellow-300 font-mono px-3 py-1 rounded-md shadow-sm ml-2">
                  {currentGame.gameCode}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Game Details */}
        <div className="bg-white text-gray-800 rounded-xl p-6 shadow mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Game Details</h2>
          
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{currentGame.description}</p>
          </div>

          {/* Game Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-md font-semibold mb-2">Game Type</h3>
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {currentGame.type}
              </span>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2">Time Limit</h3>
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {currentGame.timeLimit} seconds
              </span>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2">Min Players</h3>
              <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {currentGame.minPlayers} players
              </span>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2">Max Players</h3>
              <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {currentGame.maxPlayers || 'No limit'}
              </span>
            </div>
          </div>

          {/* Rules */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Rules</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {currentGame.rules && currentGame.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          {/* Equipment */}
          {currentGame.equipment && currentGame.equipment.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Equipment Needed</h3>
              <div className="flex flex-wrap gap-2">
                {currentGame.equipment.map((item, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Point System */}
          {currentGame.pointSystem && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Point System</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{currentGame.pointSystem.winPoints}</div>
                    <div className="text-sm text-gray-600">Win Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{currentGame.pointSystem.bonusPoints}</div>
                    <div className="text-sm text-gray-600">Bonus Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{currentGame.pointSystem.penaltyPoints}</div>
                    <div className="text-sm text-gray-600">Penalty Points</div>
                  </div>
                </div>
                {currentGame.pointSystem.customRules && (
                  <div className="text-sm text-gray-700 bg-white p-3 rounded-md">
                    <strong>Custom Rules:</strong> {currentGame.pointSystem.customRules}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Superpowers */}
          {currentGame.applicableSuperpowers && currentGame.applicableSuperpowers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Applicable Superpowers</h3>
              <div className="space-y-3">
                {currentGame.applicableSuperpowers.map((superpower, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🦁</div>
                      <div>
                        <div className="font-medium text-purple-800">{superpower.animal}</div>
                        <div className="text-sm text-purple-600">{superpower.effect}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prizes */}
          {currentGame.prizes && currentGame.prizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Prizes</h3>
              <div className="flex flex-wrap gap-2">
                {currentGame.prizes.map((prize, index) => (
                  <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    🏆 {prize}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="mt-10 text-center text-sm text-white">
          <p>&copy; 2025 Z Games. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default SingleGame;