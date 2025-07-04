import React, { useState } from 'react';
import { Trophy, Users, Gamepad2, Plus, Edit, Eye, Medal, User } from 'lucide-react';
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



const TournamentScoring = () => {
  const [tournamentData, setTournamentData] = useState({
    games: [
      { id: 'game1', name: 'Championship Final' },
      { id: 'game2', name: 'Skills Challenge'},
      { id: 'game3', name: 'Relay Race'},
      { id: 'game4', name: 'Solo Performance'}
    ],
    teams: [
      { id: 'team1', name: 'Lightning Bolts', players: [
        { id: 'player1', name: 'Alice Johnson' },
        { id: 'player2', name: 'Bob Smith' },
        { id: 'player3', name: 'Carol Davis' }
      ]},
      { id: 'team2', name: 'Thunder Hawks', players: [
        { id: 'player4', name: 'David Wilson' },
        { id: 'player5', name: 'Emma Brown' },
        { id: 'player6', name: 'Frank Miller' }
      ]},
      { id: 'team3', name: 'Storm Riders', players: [
        { id: 'player7', name: 'Grace Lee' },
        { id: 'player8', name: 'Henry Taylor' },
        { id: 'player9', name: 'Ivy Chen' }
      ]},
      { id: 'team4', name: 'Wind Warriors', players: [
        { id: 'player10', name: 'Jack Cooper' },
        { id: 'player11', name: 'Kate Anderson' },
        { id: 'player12', name: 'Liam Parker' }
      ]}
    ],
    scores: [
      { gameId: 'game1', teamId: 'team1', playerId: null, playerName: null, score: 85, timestamp: '2024-07-01T10:30:00Z' },
      { gameId: 'game1', teamId: 'team2', playerId: null, playerName: null, score: 92, timestamp: '2024-07-01T10:30:00Z' },
      { gameId: 'game2', teamId: 'team1', playerId: 'player1', playerName: 'Alice Johnson', score: 42, timestamp: '2024-07-01T11:00:00Z' },
      { gameId: 'game2', teamId: 'team2', playerId: 'player4', playerName: 'David Wilson', score: 38, timestamp: '2024-07-01T11:00:00Z' },
      { gameId: 'game3', teamId: 'team3', playerId: null, playerName: null, score: -10, timestamp: '2024-07-01T12:00:00Z' },
      { gameId: 'game4', teamId: 'team4', playerId: 'player10', playerName: 'Jack Cooper', score: -5, timestamp: '2024-07-01T12:30:00Z' },
      { gameId: 'game2', teamId: 'team1', playerId: 'player2', playerName: 'Bob Smith', score: 28, timestamp: '2024-07-01T13:00:00Z' },
      { gameId: 'game3', teamId: 'team2', playerId: null, playerName: null, score: 150, timestamp: '2024-07-01T13:30:00Z' },
      { gameId: 'game4', teamId: 'team3', playerId: 'player7', playerName: 'Grace Lee', score: 65, timestamp: '2024-07-01T14:00:00Z' }
    ]
  });

  const [activeTab, setActiveTab] = useState('scoring');
  const [selectedGame, setSelectedGame] = useState('');
  const [scoringMode, setScoringMode] = useState('team');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [scoreValue, setScoreValue] = useState('');

  const getAllPlayers = () => {
    return tournamentData.teams.flatMap(team => 
      team.players.map(player => ({ 
        id: player.id, 
        name: player.name, 
        teamId: team.id, 
        teamName: team.name 
      }))
    );
  };

  const handleScoreSubmit = () => {
    if (!selectedGame || scoreValue === '' || scoreValue === null) {
      alert('Please select a game and enter a score');
      return;
    }

    if (scoringMode === 'team' && !selectedTeam) {
      alert('Please select a team');
      return;
    }

    if (scoringMode === 'player' && !selectedPlayer) {
      alert('Please select a player');
      return;
    }

    const game = tournamentData.games.find(g => g.id === selectedGame);
    if (!game) return;

    let newScore;
    
    if (scoringMode === 'team') {
      newScore = {
        gameId: selectedGame,
        teamId: selectedTeam,
        playerId: null,
        playerName: null,
        score: parseInt(scoreValue),
        timestamp: new Date().toISOString()
      };
    } else {
      const playerData = getAllPlayers().find(p => p.id === selectedPlayer);
      newScore = {
        gameId: selectedGame,
        teamId: playerData.teamId,
        playerId: selectedPlayer,
        playerName: playerData.name,
        score: parseInt(scoreValue),
        timestamp: new Date().toISOString()
      };
    }

    setTournamentData(prev => ({
      ...prev,
      scores: [...prev.scores, newScore]
    }));

    setScoreValue('');
    setSelectedTeam('');
    setSelectedPlayer('');
    
    const actionType = parseInt(scoreValue) >= 0 ? 'awarded' : 'deducted';
    alert(`Score ${actionType} successfully!`);
  };

  const getScoresByGame = (gameId) => {
    return tournamentData.scores.filter(score => score.gameId === gameId);
  };

  const getTeamTotalScore = (teamId) => {
    return tournamentData.scores
      .filter(score => score.teamId === teamId)
      .reduce((total, score) => total + score.score, 0);
  };

  const getTeamScores = (teamId) => {
    return tournamentData.scores.filter(score => score.teamId === teamId && score.playerId === null);
  };

  const getPlayerScores = (teamId) => {
    return tournamentData.scores.filter(score => score.teamId === teamId && score.playerId !== null);
  };

  const getTeamScoreTotal = (teamId) => {
    return getTeamScores(teamId).reduce((total, score) => total + score.score, 0);
  };

  const getPlayerScoreTotal = (teamId) => {
    return getPlayerScores(teamId).reduce((total, score) => total + score.score, 0);
  };

  const getLeaderboard = () => {
    const teamScores = tournamentData.teams.map(team => ({
      ...team,
      totalScore: getTeamTotalScore(team.id),
      teamScoreTotal: getTeamScoreTotal(team.id),
      playerScoreTotal: getPlayerScoreTotal(team.id)
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

  const selectedGameData = tournamentData.games.find(g => g.id === selectedGame);
  const leaderboard = getLeaderboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Scoring Tab */}
        {activeTab === 'scoring' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Gamepad2 className="w-6 h-6 mr-2 text-blue-500" />
              Score a Game
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <GameSelector 
                  games={tournamentData.games}
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
                  disabled={!selectedGame || scoreValue === '' || (scoringMode === 'team' && !selectedTeam) || (scoringMode === 'player' && !selectedPlayer)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {scoreValue && parseInt(scoreValue) < 0 ? 'Deduct Points' : 'Award Points'}
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Teams Ranked by Total Score</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {leaderboard.map((team, index) => (
                    <TeamCard 
                      key={team.id}
                      team={team}
                      index={index}
                      games={tournamentData.games}
                      getTeamScores={getTeamScores}
                      getPlayerScores={getPlayerScores}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <Leaderboard leaderboard={leaderboard} />
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <GamesOverview games={tournamentData.games} getScoresByGame={getScoresByGame} />
            <TeamsOverview 
              teams={tournamentData.teams}
              scores={tournamentData.scores}
              getTeamTotalScore={getTeamTotalScore}
            />
            <AllScoresTable 
              scores={tournamentData.scores}
              games={tournamentData.games}
              teams={tournamentData.teams}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentScoring;