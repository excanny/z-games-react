import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { Trophy, Users, Target, Wifi, WifiOff, RefreshCw, ArrowLeft, Crown, Medal, Award, Gamepad2, Clock, Handshake, ChevronUp, ChevronDown } from 'lucide-react';
import ScoreboardHeader from './ScoreboardHeader'; 
import LoadingSpinner from './LoadingSpinner';
import TournamentInfo from './TournamentInfo';
import TournamentStatsCards from './TournamentStatsCards';
import NoTournamentFound from './NoTournamentFound';
import axiosClient from '../utils/axiosClient';
import config from "../config";

const Scoreboard = () => {
  const [tournamentData, setTournamentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [longLoading, setLongLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState(new Set());
  const [collapsedTeamCards, setCollapsedTeamCards] = useState(new Set());
  const [socketError, setSocketError] = useState(null);

  const { tournamentId } = useParams();
  const [activeTournamentId, setActiveTournamentId] = useState(null);
  const socketRef = useRef(null);
  const fetchTimeoutRef = useRef(null);
  const longLoadingTimeoutRef = useRef(null);

  // Memoized animal avatar mapping to prevent recreation
  const animalAvatars = useMemo(() => ({
    Lion:'🦁',Tiger:'🐯',Eagle:'🦅',Cat:'🐱',Shark:'🦈',Dog:'🐶',Whale:'🐋',Horse:'🐴',
    Bison:'🦬',Moose:'🫎',Goose:'🪿',Turtle:'🐢',Beaver:'🦫',Bear:'🐻',Frog:'🐸',
    Rabbit:'🐰',Wolf:'🐺',Human:'🧑',Monkey:'🐵',Chameleon:'🦎'
  }), []);

  // Optimized toggle functions with useCallback to prevent re-renders
  const toggleTeamExpansion = useCallback((teamId) => {
    setExpandedTeams(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(teamId)) {
        newExpanded.delete(teamId);
      } else {
        newExpanded.add(teamId);
      }
      return newExpanded;
    });
  }, []);

  const toggleTeamCardCollapse = useCallback((teamId) => {
    setCollapsedTeamCards(prev => {
      const newCollapsed = new Set(prev);
      if (newCollapsed.has(teamId)) {
        newCollapsed.delete(teamId);
      } else {
        newCollapsed.add(teamId);
      }
      return newCollapsed;
    });
  }, []);

  // Debounced fetch function to prevent rapid API calls
  const debouncedFetchTournamentData = useCallback(
    (() => {
      let timeoutId;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(fetchTournamentData, 300);
      };
    })(),
    []
  );

  // Optimized fetch function with better error handling and timeouts
  const fetchTournamentData = useCallback(async () => {
    // Clear any existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    try {
      setError(null);
      
      // Add timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      fetchTimeoutRef.current = timeoutId;

      const response = await axiosClient.get('/tournaments/leaderboard', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
    
      if (response?.data?.success) {
        setTournamentData(response.data.data);
        
        if (response.data.data?.tournamentId) {
          setActiveTournamentId(response.data.data.tournamentId);
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch tournament data');
      }
    } catch (err) {
      console.error('❌ Error fetching tournament data:', err);
      
      if (err.name === 'AbortError') {
        setError('Request timeout. Please check your connection and try again.');
        return;
      }
      
      if (err.response?.status === 404) {
        setTournamentData(null);
        return;
      }
      
      // More specific error handling
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === 'Token expired') {
        setError('Session expired. Please refresh the page.');
      } else if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setError('Server unavailable. Please try again later.');
      } else {
        setError('Failed to load tournament data. Please refresh the page.');
      }
    }
  }, []);

  // Memoized helper functions to prevent recalculation on every render
  const getProgressBarColor = useCallback((rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default: return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  }, []);

  const getRankIcon = useCallback((rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-slate-600">#{rank}</span>;
    }
  }, []);

  const getTeamCardStyle = useCallback((rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 border-2 border-yellow-200 shadow-lg";
      case 2:
        return "bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-2 border-gray-200 shadow-md";
      case 3:
        return "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-200 shadow-md";
      default:
        return "bg-white border border-slate-200 shadow-sm";
    }
  }, []);

  // Memoized game scores calculation
  const getTeamGameScores = useCallback((teamId) => {
    if (!tournamentData?.gameWiseBreakdown) return [];
    
    return tournamentData.gameWiseBreakdown.reduce((acc, game) => {
      const teamScore = game.teamScores.find(ts => ts.teamId === teamId);
      if (teamScore) {
        acc.push({
          game: game.gameName,
          score: parseInt(teamScore.score)
        });
      }
      return acc;
    }, []);
  }, [tournamentData?.gameWiseBreakdown]);

  const getFormattedPlayerGameScores = useCallback((player) => {
    if (!player.gameScores) return [];
    
    return player.gameScores.map(gameScore => ({
      game: gameScore.gameName,
      score: parseInt(gameScore.totalScore)
    }));
  }, []);

  // Initialize collapsed cards when tournament data loads
  useEffect(() => {
    if (tournamentData?.teamRankings && collapsedTeamCards.size === 0) {
      const allTeamIds = new Set(tournamentData.teamRankings.map(team => team.id));
      setCollapsedTeamCards(allTeamIds);
    }
  }, [tournamentData, collapsedTeamCards.size]);

  // Optimized Socket Connection with better cleanup
  useEffect(() => {
    let isComponentMounted = true;
    let reconnectTimer;

    const initializeSocket = () => {
      // Clean up existing connection
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      // Create new socket connection with optimized settings
      const socket = io(config.baseUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000, // Reduced from 20000
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 3, // Reduced from 5
        reconnectionDelay: 2000, // Increased from 1000
        reconnectionDelayMax: 10000, // Increased from 5000
        autoConnect: false // Don't auto-connect immediately
      });

      socketRef.current = socket;

      // Connection event handlers
      socket.on('connect', () => {
        if (isComponentMounted) {
          setIsConnected(true);
          setSocketError(null);
          
          const tournamentToJoin = tournamentId || activeTournamentId;
          if (tournamentToJoin) {
            socket.emit('joinTournament', tournamentToJoin);
          }
        }
      });

      socket.on('disconnect', (reason) => {
        console.warn('⚠️ Socket disconnected:', reason);
        if (isComponentMounted) {
          setIsConnected(false);
        }
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        if (isComponentMounted) {
          setSocketError('Connection failed. Retrying...');
          setIsConnected(false);
        }
      });

      socket.on('reconnect', (attemptNumber) => {
        if (isComponentMounted) {
          setSocketError(null);
          const tournamentToJoin = tournamentId || activeTournamentId;
          if (tournamentToJoin) {
            socket.emit('joinTournament', tournamentToJoin);
          }
        }
      });

      // Tournament event handlers with debouncing
      const handleUpdate = () => {
        if (isComponentMounted) {
          debouncedFetchTournamentData();
        }
      };

      socket.on('leaderboardUpdated', handleUpdate);
      socket.on('scoreUpdated', handleUpdate);
      socket.on('tournamentUpdated', handleUpdate);
      socket.on('update', handleUpdate);

      return socket;
    };

    // Load initial data first, then connect socket
    const loadInitialData = async () => {
      setLoading(true);
      setLongLoading(false);
      
      // Set long loading timeout
      longLoadingTimeoutRef.current = setTimeout(() => {
        if (isComponentMounted) {
          setLongLoading(true);
        }
      }, 5000); // Reduced from 10000
      
      await fetchTournamentData();
      
      if (isComponentMounted) {
        setLoading(false);
        clearTimeout(longLoadingTimeoutRef.current);
        
        // Initialize socket after data is loaded
        const socket = initializeSocket();
        // Connect socket after a short delay to prevent blocking initial render
        setTimeout(() => {
          if (isComponentMounted && socket) {
            socket.connect();
          }
        }, 100);
      }
    };

    loadInitialData();

    // Cleanup function
    return () => {
      isComponentMounted = false;
      clearTimeout(longLoadingTimeoutRef.current);
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [tournamentId, activeTournamentId, debouncedFetchTournamentData, fetchTournamentData]);

  // Memoized components to prevent unnecessary re-renders
  const MemoizedTeamCard = React.memo(({ team, index, tournamentData }) => {
    const teamGameScores = getTeamGameScores(team.id);
    const isExpanded = !collapsedTeamCards.has(team.id);
    const scoresExpanded = expandedTeams.has(`${team.id}-scores`);
    const playersExpanded = expandedTeams.has(`${team.id}-players`);

    return (
      <div
        className={`rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01] ${getTeamCardStyle(index + 1)}`}
      >
        {/* Team Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center">
              {getRankIcon(index + 1)}
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-800">{team.name}</h4>
              <p className="text-slate-500 text-sm">{team.players.length} active players</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold text-slate-800">
              {parseInt(team.totalScore).toLocaleString()}
            </div>
            <p className="text-slate-500 text-sm">team score</p>
          </div>
        </div>

        {/* Team Score Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${getProgressBarColor(index + 1)}`}
              style={{ 
                width: `${(parseInt(team.totalScore) / parseInt(tournamentData.teamRankings[0].totalScore)) * 100}%`
              }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-500">
              Avg per player: {Math.round(parseInt(team.totalScore) / team.players.length).toLocaleString()}
            </span>
            <button
              onClick={() => toggleTeamCardCollapse(team.id)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-full"
            >
              {!isExpanded ? (
                <>
                  <ChevronDown className="w-3 h-3" />
                  Show Details
                </>
              ) : (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Hide Details
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <>
            {/* Score Breakdown */}
            <div className="mb-4 bg-white/60 rounded-xl p-4 border border-white/50">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-slate-600" />
                  Score Breakdown
                </h5>
                <button
                  onClick={() => toggleTeamExpansion(`${team.id}-scores`)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {scoresExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide Team Game Scores
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show Team Game Scores
                    </>
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-slate-800">
                    {team.players.reduce((sum, player) => sum + parseInt(player.score), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-500">Player Scores</p>
                </div>
                
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-slate-800">
                    {team.teamBonus.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-500">Team Bonuses</p>
                </div>
          
                <div className="relative bg-gradient-to-br from-blue-100 via-white to-blue-50 border border-blue-300 rounded-xl px-4 py-3 shadow-sm text-center">
                  <div className="text-4xl font-semibold text-blue-800 drop-shadow-sm">
                    {parseInt(team.totalScore).toLocaleString()}
                  </div>
                  <p className="mt-1 text-xs font-medium text-blue-500 uppercase tracking-wide">
                    Total Score
                  </p>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Team Game Scores - Expandable */}
              {scoresExpanded && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Team Performance by Game</span>
                  </div>
                  {teamGameScores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {teamGameScores.map((gameScore, gameIndex) => (
                        <div key={gameIndex} className="bg-white/80 rounded-lg p-3 border border-slate-100">
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-800">{gameScore.score.toLocaleString()}</div>
                            <div className="text-xs text-slate-500 font-medium">{gameScore.game}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-sm text-slate-500">
                      No team-only scores earned
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Team Position Badge */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  index === 0 ? 'bg-yellow-200 text-yellow-800' :
                  index === 1 ? 'bg-gray-200 text-gray-800' :
                  index === 2 ? 'bg-amber-200 text-amber-800' :
                  'bg-blue-200 text-blue-800'
                }`}>
                  #{index + 1}
                </div>
                <span className="text-sm text-slate-600">
                  {index === 0 ? 'Champion' :
                  index === 1 ? 'Runner-up' :
                  index === 2 ? 'Third Place' :
                  `${index + 1}th Place`}
                </span>
              </div>
              
              {index === 0 && tournamentData.teamRankings[1] && (
                <div className="text-yellow-600 text-sm font-medium flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  Leading by {(parseInt(team.totalScore) - parseInt(tournamentData.teamRankings[1].totalScore)).toLocaleString()}
                </div>
              )}
            </div>

            {/* Individual Player Scores */}
            <div className="bg-white/60 rounded-xl p-4 border border-white/50">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-600" />
                  Individual Player Scores
                </h5>
                <button
                  onClick={() => toggleTeamExpansion(`${team.id}-players`)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {playersExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide Player Game Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show Player Game Details
                    </>
                  )}
                </button>
              </div>
      
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {team.players
                  .sort((a, b) => parseInt(b.score) - parseInt(a.score))
                  .map((player, playerIndex) => (
                    <div
                      key={player.id}
                      className="bg-white/90 rounded-xl border border-slate-200/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-full text-xs font-bold text-slate-700">
                            {playerIndex + 1}
                          </div>
                          
                          <div className="text-xl">
                            {animalAvatars[player.animal?.name] || '👤'}
                          </div>
                          
                          <div className="flex items-center justify-between flex-1 min-w-0">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-slate-900 text-sm truncate">
                                {player.name}
                              </h3>
                              <p className="text-xs text-slate-500">{player.animal?.name}</p>
                            </div>
                            
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm ml-2">
                              {parseInt(player.score).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                          <div className="text-xs text-slate-400">
                            Team Contribution
                          </div>
                          <div className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-600">
                            {`${(((parseInt(player?.score) / parseInt(team?.totalScore)) * 100) || 0).toFixed(1)}%`}
                          </div>
                        </div>
                      </div>
                      
                      {/* Game Details - Expandable */}
                      {playersExpanded && (
                        <div className="border-t border-slate-100 p-3 bg-gradient-to-r from-slate-50/80 to-slate-100/30">
                          <div className="flex items-center gap-2 mb-3">
                            <Gamepad2 className="w-4 h-4 text-slate-600" />
                            <span className="text-sm font-medium text-slate-700">Game Scores Breakdown</span>
                          </div>
                          {(() => {
                            const playerGameScores = getFormattedPlayerGameScores(player);
                            return playerGameScores.length > 0 ? (
                              <div className="grid grid-cols-1 gap-2">
                                {playerGameScores.map((gameScore, gameIndex) => (
                                  <div key={gameIndex} className="flex justify-between items-center bg-white/60 rounded-lg px-3 py-2 border border-slate-200/50">
                                    <span className="text-sm text-slate-700 font-medium">
                                      {gameScore.game}
                                    </span>
                                    <div className="text-xs font-semibold">
                                      {gameScore.score.toLocaleString()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center text-sm text-slate-500 py-2">
                                Individual game scores not available
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  });

  // Error Display Component
  const ErrorDisplay = React.memo(({ error }) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Connection Error</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    </div>
  ));

  // Early returns for loading and error states
  if (loading) return <LoadingSpinner longLoading={longLoading} />;
  if (error) return <ErrorDisplay error={error} />;
  if (tournamentData?.leaderboard?.length === 0) return <NoTournamentFound />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header with connection status */}
      <ScoreboardHeader isConnected={isConnected} />
      
      {/* Socket Error Alert */}
      {socketError && (
        <div className="max-w-6xl mx-auto px-6 pt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-yellow-800 font-medium">Connection Issue</p>
              <p className="text-yellow-700 text-sm">{socketError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tournament Info */}
        <TournamentInfo tournamentData={tournamentData} />

        {/* Stats Cards */}
        <TournamentStatsCards tournamentData={tournamentData} />

        {/* Team Rankings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-900 to-purple-800 px-8 py-6">
            <h3 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6" />
              Team Rankings
              {isConnected && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
              )}
            </h3>
          </div>
        
          <div className="p-6">
            <div className="space-y-6">
              {tournamentData?.teamRankings?.map((team, index) => (
                <MemoizedTeamCard
                  key={team.id}
                  team={team}
                  index={index}
                  tournamentData={tournamentData}
                />
              ))}
            </div>
          </div>
        </div>
     
        {/* Admin Login Link */}
        <div className="mt-12 text-center">
          <Link 
            to="/admin-login" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm"
          >
            <span>Admin Login</span>
            <ArrowLeft className="w-3 h-3 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;