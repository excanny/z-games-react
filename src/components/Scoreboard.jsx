import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../utils/axiosClient';
import { Link, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import config from "../config";


const Scoreboard = () => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [longLoading, setLongLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const { gameId } = useParams();
  const socketRef = useRef(null);

  const avatarEmojis = {
    'bear': '🐻',
    'rabbit': '🐰',
    'cat': '🐱',
    'dog': '🐶',
    'fox': '🦊',
    'lion': '🦁',
    'tiger': '🐯',
    'panda': '🐼'
  };

  const getColorClass = (hexColor, rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    const colorMap = {
      '#8C33FF': 'text-purple-500',
      '#FF33F5': 'text-pink-500',
      '#33FF57': 'text-green-500',
      '#3357FF': 'text-blue-500',
      '#FF5733': 'text-red-500',
      '#FFFF33': 'text-yellow-500',
      '#33FFFF': 'text-cyan-500'
    };
    return colorMap[hexColor] || 'text-blue-500';
  };

  const fetchGameData = async () => {
    try {
      setError(null);
      
      const response = await axiosClient.get(`/games/${gameId}/leaderboard`, {
        timeout: 10000,
      });

      const apiResponse = response.data;

      if (apiResponse.status !== 'success') {
        throw new Error(apiResponse.message || 'Failed to fetch game data');
      }

      const transformedData = {
        name: apiResponse.data.name,
        type: 'Game',
        round: 'Live',
        lastGamesUpdateAt: new Date(apiResponse.data.lastGamesUpdateAt).toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        players: apiResponse.data.leaderboard.map(player => ({
          name: player.name,
          points: player.score,
          rank: player.rank,
          avatar: player.avatar,
          color: getColorClass(player.color, player.rank)
        }))
      };

      setGameData(transformedData);
    } catch (err) {
      console.error('Error fetching game data:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    // Initialize socket connection
    const initializeSocket = () => {
      // Disconnect existing socket if any
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      // Create new socket connection
     socketRef.current = io(config.socketBaseUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      const socket = socketRef.current;

      // Connection event handlers
      const handleConnect = () => {
        console.log('✅ Connected to socket.io server');
        setIsConnected(true);
      };

      const handleDisconnect = (reason) => {
        console.warn('⚠️ Disconnected from socket.io server:', reason);
        setIsConnected(false);
      };

      const handleConnectError = (err) => {
        console.error('❌ Connection error:', err.message);
        setIsConnected(false);
      };

      // Real-time update handlers
      const handleLeaderboardUpdate = (data) => {
        console.log('📊 Leaderboard update received:', data);
        if (data.gameId === gameId) {
          fetchGameData();
        }
      };

      const handlePlayerUpdate = (data) => {
        console.log('👤 Player update received:', data);
        if (data.gameId === gameId) {
          fetchGameData();
        }
      };

      // Register event listeners
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleConnectError);
      socket.on('leaderboardUpdated', handleLeaderboardUpdate);
      socket.on('playerAdded', handlePlayerUpdate);
      socket.on('playerReactivated', handlePlayerUpdate);
      socket.on('playerDeactivated', handlePlayerUpdate);
      socket.on('bulkPlayersAdded', handlePlayerUpdate);
      socket.on('bulkPlayersReactivated', handlePlayerUpdate);

      // Set initial connection state
      setIsConnected(socket.connected);

      return socket;
    };

    // Initialize socket and fetch initial data
    const socket = initializeSocket();
    
    // Fetch initial game data
    const loadInitialData = async () => {
      setLoading(true);
      setLongLoading(false);
      
      await fetchGameData();
      setLoading(false);
    };

    loadInitialData();

    // Set up long loading timer
    const timer = setTimeout(() => {
      if (loading) setLongLoading(true);
    }, 10000);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('leaderboardUpdated');
        socket.off('playerAdded');
        socket.off('playerReactivated');
        socket.off('playerDeactivated');
        socket.off('bulkPlayersAdded');
        socket.off('bulkPlayersReactivated');
        socket.disconnect();
      }
    };
  }, [gameId]); // Only depend on gameId

  // Add reconnection logic
  useEffect(() => {
    if (!isConnected && gameData) {
      console.log('🔄 Attempting to reconnect...');
      const reconnectTimer = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.connect();
        }
      }, 3000);

      return () => clearTimeout(reconnectTimer);
    }
  }, [isConnected, gameData]);

  const getRankDisplay = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}.`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading game data...</p>
          {longLoading && (
            <p className="text-red-500 mt-2">This is taking longer than expected. Please check your connection.</p>
          )}
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
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded mr-4 hover:bg-blue-700"
            >
              🔄 Retry
            </button>
            <Link to="/" className="text-blue-600 hover:underline">
              ⬅️ Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold mb-2">No game data available</h2>
          <div className="mt-4">
            <Link to="/" className="text-blue-600 hover:underline">
              ⬅️ Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { name, type, round, players, lastGamesUpdateAt } = gameData;
  const highestScore = players.length > 0 ? Math.max(...players.map(p => p.points)) : 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="text-4xl text-blue-600 font-extrabold">
            <span>Z</span>
            <span className="text-blue-600">-GAMES</span>
          </div>
          <div className="text-xl font-semibold text-gray-700">Scoreboard</div>
        </div>

        <div className="text-center text-sm mb-4">
          <span className={isConnected ? 'text-green-600' : 'text-red-500'}>
            {isConnected ? '🟢 Connected to Live Server' : '🔴 Disconnected from Live Server'}
          </span>
          {!isConnected && (
            <div className="text-xs text-gray-500 mt-1">
              Attempting to reconnect...
            </div>
          )}
        </div>

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-1">{name}</h1>
          <div className="text-sm">
            <Link to="/" className="text-blue-600 hover:underline">⬅️ Back to Home</Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-soft border overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">Live Rankings</h2>
          </div>

          <div className="p-8 space-y-4">
            {players.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">🎯</div>
                <p>No active players yet</p>
              </div>
            ) : (
              players.map(player => {
                const isTopThree = player.rank <= 3;
                return (
                  <div
                    key={player.name}
                    className={`flex items-center justify-between p-6 rounded-xl transition-all duration-300 ${
                      isTopThree
                        ? 'bg-gradient-to-r from-blue-50 to-slate-50 border-2 border-blue-100'
                        : 'bg-slate-50 border'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold w-12 text-center">
                          {getRankDisplay(player.rank)}
                        </span>
                        <span className="text-2xl">
                          {avatarEmojis[player.avatar] || '👤'}
                        </span>
                      </div>
                      <div>
                        <div className={`text-xl font-bold ${isTopThree ? 'text-slate-800' : 'text-slate-700'}`}>
                          {player.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${isTopThree ? 'text-blue-600' : 'text-slate-600'}`}>
                        {player.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500">points</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-slate-50 px-8 py-6 border-t">
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Live {type}</span>
              <span>Last updated: {lastGamesUpdateAt}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-soft text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{players.length}</div>
            <div className="text-slate-600">Active Players</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{highestScore.toLocaleString()}</div>
            <div className="text-slate-600">Highest Score</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{round}</div>
            <div className="text-slate-600">Current Round</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .font-inter { font-family: 'Inter', sans-serif; }
        .shadow-soft { box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      `}</style>
    </div>
  );
};

export default Scoreboard;