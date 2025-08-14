import React, { useState, useEffect, useRef } from 'react';
import {Link} from 'react-router-dom';
import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User, AlertCircle, Loader2, Play, Pause, Square, Timer, RotateCcw } from 'lucide-react';
import Header from './Header';
import GameSelector from './GameSelector';
import ScoreInput from './ScoreInput';
import AllScoresTable from './AllScoresTable';
import TeamCard from './TeamCard';
import GameDetails from './GameDetails';
import ScoringModeSelector from './ScoringModeSelector';  
import TeamSelector from './TeamSelector';
import PlayerSelector from './PlayerSelector';    
import GamesOverview from './GamesOverview';
import TeamsOverview from './TeamsOverview';
import Leaderboard from './Leaderboard';
import TeamManagement from './TeamManagement';
import PlayerManagement from './PlayerManagement';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ZGamesLogo from '../../../assets/Z Games logo with illustration.png';
import axiosClient from "../../../utils/axiosClient"; 
import config from '../../../config'; // Adjust the import path as necessary

const TournamentScoring = () => {
  const { tournamentId } = useParams();
  const [tournamentData, setTournamentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState('scoring');
  const [selectedGame, setSelectedGame] = useState('');
  const [scoringMode, setScoringMode] = useState('team');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [scoreValue, setScoreValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Timer states
  const [timerTime, setTimerTime] = useState(0); // in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Tab configuration matching AdminDashboard style
  const tabs = [
    { id: 'scoring', label: 'Score Games', icon: '🎯' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'overview', label: 'Overview', icon: '📊' }
  ];

  //Notification functions
  const scoreAddedNotification = () => toast('Score awarded successfully!');
  const scoreDeductedNotification = () => toast('Score deducted successfully!');

  // Timer functions
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerTime(0);
  };

  const handleAddTeam = (newTeam) => {
    setTournamentData(prevData => ({
      ...prevData,
      teams: [...prevData.teams, newTeam]
    }));
  };

  const handleUpdateTeam = (teamId, updatedTeam) => {
    setTournamentData(prevData => ({
      ...prevData,
      teams: prevData.teams.map(team => 
        team.id === teamId ? { ...team, ...updatedTeam } : team
      )
    }));
  };

  const handleRemoveTeam = (teamId) => {
    setTournamentData(prevData => ({
      ...prevData,
      teams: prevData.teams.filter(team => team.id !== teamId)
    }));
  };

  // Handler to add a player to a team
  const handleAddPlayer = (teamId, newPlayer) => {
    setTournamentData(prevData => ({
      ...prevData,
      teams: prevData.teams.map(team => 
        team.id === teamId 
          ? {
              ...team,
              players: [...team.players, newPlayer]
            }
          : team
      )
    }));
  };

  // Handler to remove a player from a team
  const handleRemovePlayer = (teamId, playerId) => {
    setTournamentData(prevData => ({
      ...prevData,
      teams: prevData.teams.map(team => 
        team.id === teamId 
          ? {
              ...team,
              players: team.players.filter(player => player.id !== playerId)
            }
          : team
      )
    }));
  };

  // Handler to update a player's information
  const handleUpdatePlayer = (teamId, playerId, updatedPlayerData) => {
    setTournamentData(prevData => ({
      ...prevData,
      teams: prevData.teams.map(team => 
        team.id === teamId 
          ? {
              ...team,
              players: team.players.map(player => 
                player.id === playerId 
                  ? { ...player, ...updatedPlayerData }
                  : player
              )
            }
          : team
      )
    }));
  };

  // Fetch tournament data
  const fetchTournamentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.baseUrl}/api/tournaments/${tournamentId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setTournamentData(result.data);
        setError(null);
      } else {
        throw new Error('Failed to fetch tournament data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tournament data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentData();
    }
  }, [tournamentId]);

  useEffect(() => {
    const fetchGames = async () => {
      if (!tournamentData?.selectedGames || tournamentData.selectedGames.length === 0) return;

      try {
        // selectedGames already contains full game data
        const gameDetails = tournamentData.selectedGames.map((game) => ({
          game_id: game.game_id,
          name: game.name,
          description: game.description || '',
        }));

        setGames(gameDetails);
      } catch (err) {
        console.error('Error processing games:', err);
      }
    };

    fetchGames();
  }, [tournamentData]);

  const getAllPlayers = () => {
    if (!tournamentData?.teams) return [];
    return tournamentData.teams.flatMap(team =>
      team.players.map(player => ({
        playerId: player.id,
        playerName: player.name,
        teamId: team.id,
        teamName: team.name
      }))
    );
  };


const handleScoreSubmit = async () => {
  setIsSubmitting(true);

  if (!selectedGame || scoreValue === '' || scoreValue === null) {
    alert('Please select a game and enter a score');
    setIsSubmitting(false);
    return;
  }

  if (scoringMode === 'team' && !selectedTeam) {
    alert('Please select a team');
    setIsSubmitting(false);
    return;
  }

  if (scoringMode === 'player' && !selectedPlayer) {
    alert('Please select a player');
    setIsSubmitting(false);
    return;
  }

  const game = games.find(g => g.game_id === selectedGame);
  if (!game) {
    setIsSubmitting(false);
    return;
  }

  const gameId = selectedGame;
  const url = `/leaderboardScoring/${tournamentId}/games/${gameId}/scores`;

  const actionType = parseInt(scoreValue) >= 0 ? 'awarded' : 'deducted';
  const scoreChange = parseInt(scoreValue);

  let finalPayload;
  if (scoringMode === 'team') {
    finalPayload = {
      scoreType: 'team',
      teamScores: [
        {
          team_id: selectedTeam,
          score: scoreChange,
          reason: `Score ${actionType} for game ${game.name}`
        }
      ]
    };
  } else {
    const playerData = getAllPlayers().find(p => p.playerId === selectedPlayer);
    
    finalPayload = {
      scoreType: 'player',
      playerScores: [
        {
          player_id: selectedPlayer,
          team_id: playerData?.teamId,
          score: scoreChange
        }
      ]
    };
  }

  try {
    const response = await axiosClient.post(url, finalPayload);
    const result = response.data;

    if (response.status === 200 && result.success) {
      setScoreValue('');
      setSelectedTeam('');
      setSelectedPlayer('');

      if (actionType === 'awarded') {
        scoreAddedNotification();
      } else {
        scoreDeductedNotification();
      }

      // Force a complete refresh of tournament data from server
      await fetchTournamentData();

    } else {
      console.error('Error submitting score:', result);
      alert(`Error: ${result.message || 'Failed to submit score'}`);
    }
  } catch (error) {
    console.error('Request failed:', error);
    alert('Failed to connect to server. Please try again.');
  } finally {
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  }
};

  const getTeamTotalScore = (teamId) => {
    if (!tournamentData?.scores) return 0;
    return tournamentData.scores
      .filter(score => score.teamId === teamId)
      .reduce((total, score) => total + score.score, 0);
  };

  const getLeaderboard = () => {
    if (!tournamentData?.teams) return [];
    const teamScores = tournamentData.teams.map(team => ({
      ...team,
      totalScore: getTeamTotalScore(team.id), // Use _id instead of id
    }));
    return teamScores.sort((a, b) => b.totalScore - a.totalScore);
  };

  const handleGameChange = (gameId) => {

    setSelectedGame(gameId);
    setSelectedTeam('');
    setSelectedPlayer('');
  };

  const handleModeChange = (mode) => {
    setScoringMode(mode);
    setSelectedTeam('');
    setSelectedPlayer('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-400 p-3 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 flex items-center space-x-3 sm:space-x-4 mx-4 w-full max-w-sm">
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-blue-500 flex-shrink-0" />
          <span className="text-gray-700 text-sm sm:text-base">Loading tournament data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-400 p-3 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 flex items-center space-x-3 sm:space-x-4 text-red-600 mx-4 w-full max-w-md">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-sm sm:text-base">Error loading tournament</h2>
            <p className="text-xs sm:text-sm break-words">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tournamentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-400 p-3 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 mx-4 w-full max-w-sm">
          <p className="text-gray-700 text-sm sm:text-base text-center">No tournament data available</p>
        </div>
      </div>
    );
  }

  const selectedGameData = games.find(g => g.id === selectedGame);
  const leaderboard = getLeaderboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-400 p-3 sm:p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Tournament Header with Timer - Matching AdminDashboard style */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              {/* Z-Games Logo - Top on mobile, Left on desktop */}
              <Link to="/admin-dashboard">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-2 sm:p-3 mr-4 sm:mr-6 shadow-md">
                    <img 
                      src={ZGamesLogo} 
                      alt="Z-Games Logo" 
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    />
                  </div>
                  <div className="text-gray-700 font-semibold text-sm sm:text-base">
                    <div>Z-Games</div>
                    <div className="text-xs sm:text-sm text-gray-500">Games Platform</div>
                  </div>
                </div>
              </Link>

              {/* Tournament Name - Center on mobile and desktop */}
              <div className="flex items-center justify-center lg:flex-1 lg:px-4">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-yellow-500 mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <div className="text-center">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
                    {tournamentData.name || 'Tournament'}
                  </h1>
                  {tournamentData.description && (
                    <p className="text-gray-600 text-xs sm:text-sm lg:text-base mt-1 max-w-xs sm:max-w-sm lg:max-w-md">
                      {tournamentData.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Tournament Stats - Bottom on mobile, Right on desktop */}
              <div className="flex justify-center lg:justify-end">
                <div className="flex gap-2 sm:gap-3 lg:gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center min-w-[60px] sm:min-w-[70px] lg:min-w-[80px]">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                      {tournamentData.teams?.length || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Teams</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center min-w-[60px] sm:min-w-[70px] lg:min-w-[80px]">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                      {games.length || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Games</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center min-w-[60px] sm:min-w-[70px] lg:min-w-[80px]">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                      {tournamentData.teams?.reduce((total, team) => total + (team.players?.length || 0), 0) || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Players</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Tab Navigation - Matching AdminDashboard style */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b pb-4 mb-4 sm:mb-6 gap-4 lg:gap-0">
            {/* <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
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
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div> */}

            <div className="flex flex-col sm:flex-row gap-1 bg-gray-100 p-1 rounded-lg">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`
        flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 
        rounded-md text-sm sm:text-base font-medium 
        transition-all duration-200 w-full sm:w-auto
        ${activeTab === tab.id 
          ? 'bg-white text-blue-700 shadow-sm' 
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
        }
      `}
    >
      <span className="text-lg">{tab.icon}</span>
      <span>{tab.label}</span>
    </button>
  ))}
</div>

            
            {/* Timer Section */}
            <div className="flex flex-col items-center lg:items-end space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Timer className="w-4 h-4 text-orange-500" />
                <span className="font-medium">Game Timer</span>
              </div>
              
              <div className="text-2xl sm:text-3xl font-mono font-bold text-gray-900 tracking-wider">
                {formatTime(timerTime)}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={isTimerRunning ? pauseTimer : startTimer}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                    isTimerRunning 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span className="hidden sm:inline">{isTimerRunning ? 'Pause' : 'Start'}</span>
                </button>
                
                <button
                  onClick={resetTimer}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-all duration-200 text-sm"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Scoring Tab */}
                {/* Scoring Tab */}
{activeTab === 'scoring' && (
  <div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
        <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-blue-500 flex-shrink-0" />
        Score a Game
      </h2>
      
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
        <Trophy className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-green-500 flex-shrink-0" />
        Teams Leaderboard
      </h3>
    </div>
    
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
      {/* Scoring Form */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/60 space-y-6">
          <GameSelector 
            games={games}
            selectedGame={selectedGame}
            onGameChange={handleGameChange}
          />

          {selectedGame && (
            <ScoringModeSelector 
              scoringMode={scoringMode}
              onModeChange={handleModeChange}
            />
          )}

          {selectedGameData && (
            <GameDetails game={selectedGameData} scoringMode={scoringMode} />
          )}

          {selectedGame && scoringMode === 'team' && (
            <TeamSelector 
              teams={tournamentData.teams}
              selectedTeam={selectedTeam}
              onTeamChange={setSelectedTeam}
            />
          )}

          {selectedGame && scoringMode === 'player' && (
            <PlayerSelector 
              players={getAllPlayers()}
              selectedPlayer={selectedPlayer}
              onPlayerChange={setSelectedPlayer}
            />
          )}

          <ScoreInput 
            scoreValue={scoreValue}
            onScoreChange={setScoreValue}
          />


          <button
            onClick={handleScoreSubmit}
            disabled={!selectedGame || scoreValue === '' || (scoringMode === 'team' && !selectedTeam) || (scoringMode === 'player' && !selectedPlayer) || isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none text-sm sm:text-base flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            )}
            {isSubmitting 
              ? 'Processing...' 
              : (scoreValue && parseInt(scoreValue) < 0 ? 'Deduct Points' : 'Award Points')
            }
          </button>
        </div>

        {/* Team Management */}
            <TeamManagement 
              teams={tournamentData.teams}
              onAddTeam={handleAddTeam}
              onRemoveTeam={handleRemoveTeam}
              onUpdateTeam={handleUpdateTeam}
              tournamentId={tournamentId}
            />

            {/* Player Management */}
            <PlayerManagement 
              teams={tournamentData.teams}
              onAddPlayer={handleAddPlayer}
              onRemovePlayer={handleRemovePlayer}
              onUpdatePlayer={handleUpdatePlayer}
              tournamentId={tournamentId}
            />
      </div>

      {/* Teams Leaderboard */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200/60 space-y-6">
          <div className="space-y-3 sm:space-y-4 max-h-96 sm:max-h-[50rem] lg:max-h-[54rem] overflow-y-auto">
            {tournamentData?.teams && tournamentData.teams.length > 0 ? (
              tournamentData.teams
                .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
                .map((team, index) => (
                  <div
                    key={team.id}
                    className="bg-white/80 rounded-xl p-4 border border-green-200/50 hover:shadow-md transition-all duration-200"
                  >
                    <TeamCard
                      team={team}
                      index={index}
                      games={tournamentData.selectedGames}
                      getTeamScores={team.totalScore || 0}
                      leaderboard={tournamentData.leaderboard}
                    />
                  </div>
                ))
            ) : (
              <div className="bg-white/60 rounded-xl p-8 border border-green-200/50 text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">No Teams Yet</h3>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    Teams will appear here once they're added to the tournament. Get started by creating your first team!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  </div>
)}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-2xl border border-yellow-200/60 overflow-hidden">
                <Leaderboard 
                  leaderboard={leaderboard} 
                  tournamentData={tournamentData}
                />
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/60 overflow-hidden">
                  <GamesOverview tournamentData={tournamentData} />
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl border border-indigo-200/60 overflow-hidden">
                  <TeamsOverview 
                    tournamentData={tournamentData}
                  />
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/60 overflow-hidden">
                  <AllScoresTable 
                    tournamentData={tournamentData}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Matching AdminDashboard style */}
        <footer className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-white">
          <p>&copy; 2025 Z Games. All rights reserved.</p>
        </footer>
      </div>
      
      {/* Toast Container with responsive positioning */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="!mt-16 sm:!mt-4"
        toastClassName="!text-sm sm:!text-base"
      />
    </div>
  );
};

export default TournamentScoring;