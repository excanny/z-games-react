import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../utils/axiosClient';
import { Link, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import config from "../config";
import { Trophy, Users, Target, Wifi, WifiOff, RefreshCw, ArrowLeft, Crown, Medal, Award } from 'lucide-react';

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

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-slate-600">#{rank}</span>;
    }
  };

  const getPlayerCardStyle = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 border-2 border-yellow-200 shadow-lg transform hover:scale-105";
      case 2:
        return "bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-2 border-gray-200 shadow-md transform hover:scale-105";
      case 3:
        return "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-200 shadow-md transform hover:scale-105";
      default:
        return "bg-white border border-slate-200 hover:border-slate-300 shadow-sm transform hover:scale-102";
    }
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
        longestStreak: apiResponse.data.longestStreak,
        players: apiResponse.data.leaderboard.map(player => ({
          name: player.name,
          points: player.score,
          rank: player.rank,
          avatar: player.avatar,
          color: getColorClass(player.color, player.rank),
          isStreakKing: apiResponse.data.longestStreak && player.name === apiResponse.data.longestStreak.playerName
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

  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Loading Game Data</h3>
        <p className="text-slate-500">Connecting to live server...</p>
        {longLoading && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg max-w-sm mx-auto">
            <p className="text-amber-700 text-sm">Taking longer than expected. Please check your connection.</p>
          </div>
        )}
      </div>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-slate-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Error Loading Game</h2>
        <p className="text-slate-600 mb-6">{error}</p>
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          <Link 
            to="/" 
            className="w-full text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );

  const NoDataDisplay = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">No Game Data Available</h2>
        <p className="text-slate-600 mb-6">Unable to load game information</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay />;
  if (!gameData) return <NoDataDisplay />;

  const { name, type, round, players, lastGamesUpdateAt, longestStreak } = gameData;
  const highestScore = players.length > 0 ? Math.max(...players.map(p => p.points)) : 0;
  const totalPlayers = players.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div>
                  <h1 className="text-3xl font-bold text-blue-800">Z-Games  <span className="text-sm text-slate-500">Live Scoreboard</span></h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isConnected 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                {isConnected ? 'Live' : 'Offline'}
                {!isConnected && (
                  <span className="text-xs ml-2">Reconnecting...</span>
                )}
              </div>
              <Link 
                to="/" 
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Game Info */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">{name}</h2>
          <div className="flex items-center justify-center gap-4 text-slate-600">
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              {type}
            </span>
            <span>•</span>
            <span>{round}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Players</p>
                <p className="text-3xl font-bold text-slate-800">{totalPlayers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Highest Score</p>
                <p className="text-3xl font-bold text-slate-800">{highestScore.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Current Round</p>
                <p className="text-3xl font-bold text-slate-800">{round}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Longest Streak</p>
                <p className="text-3xl font-bold text-slate-800">{longestStreak?.longestStreak || 0}</p>
                {longestStreak && (
                  <p className="text-xs text-slate-500 mt-1">{longestStreak.playerName}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
            <h3 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6" />
              Live Rankings
            </h3>
          </div>

          <div className="p-6">
            {players.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg">No active players yet</p>
                <p className="text-slate-400 text-sm mt-1">Players will appear here when they join</p>
              </div>
            ) : (
              <div className="space-y-3">
                {players.map((player, index) => (
                  <div
                    key={player.name}
                    className={`${getPlayerCardStyle(player.rank)} rounded-2xl p-6 transition-all duration-300`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 flex items-center justify-center">
                            {getRankIcon(player.rank)}
                          </div>
                          <div className="text-3xl">
                            {avatarEmojis[player.avatar] || '👤'}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xl font-bold text-slate-800">{player.name}</h4>
                            {player.isStreakKing && (
                              <div className="bg-gradient-to-r from-orange-400 to-red-500 px-3 py-1 rounded-full flex items-center gap-1">
                                <span className="text-sm">🔥</span>
                                <span className="text-xs font-bold text-white">STREAK KING</span>
                              </div>
                            )}
                          </div>
                          <p className="text-slate-500 text-sm">Rank #{player.rank}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-800">
                          {player.points.toLocaleString()}
                        </div>
                        <p className="text-slate-500 text-sm">points</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar for Top 3 */}
                    {player.rank <= 3 && highestScore > 0 && (
                      <div className="mt-4">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              player.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                              player.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                              'bg-gradient-to-r from-amber-400 to-amber-600'
                            }`}
                            style={{ 
                              width: `${(player.points / highestScore) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Live {type} • Auto-updating</span>
              <span>Last updated: {lastGamesUpdateAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;