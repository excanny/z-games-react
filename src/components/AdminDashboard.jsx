import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import api from "../axios";
import GameManager from "./GameManager";
import Leaderboard from "./Leaderboard";

const AdminDashboard = () => {
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [activeTab, setActiveTab] = useState('games');
    const navigate = useNavigate();
  
    const createGame = (gameData) => {
      setGames([...games, gameData]);
    };
  
    const selectGame = (game) => {
      setSelectedGame(game);
      setActiveTab('participants');
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
  
    //const totalPlayers = games.reduce((sum, game) => sum + game.participants.length, 0);
    const totalGames = games.length;
    // const highestScore = games.reduce((max, game) => {
    //   const gameMax = Math.max(...game.participants.map(p => p.score), 0);
    //   return Math.max(max, gameMax);
    // }, 0);
  
    return (
      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col">
            <h1 className="display-4 text-center mb-0">
              <i className="fas fa-gamepad text-primary mr-3"></i>
              Party Games Admin Dashboard
            </h1>
            <p className="text-center text-muted">Manage games, players, and scores in real-time</p>
          </div>
        </div>
  
        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4>{totalGames}</h4>
                    <p className="mb-0">Total Games</p>
                  </div>
                  <i className="fas fa-gamepad fa-2x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4>totalPlayers</h4>
                    <p className="mb-0">Total Players</p>
                  </div>
                  <i className="fas fa-users fa-2x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4>highestScore</h4>
                    <p className="mb-0">Highest Score</p>
                  </div>
                  <i className="fas fa-trophy fa-2x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4>{selectedGame ? selectedGame.participants.length : 0}</h4>
                    <p className="mb-0">Active Players</p>
                  </div>
                  <i className="fas fa-user-friends fa-2x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'games' ? 'active' : ''}`}
              onClick={() => setActiveTab('games')}
            >
              <i className="fas fa-gamepad mr-2"></i>Games
            </button>
          </li>
          <li className="nav-item">
            <button 
                    className={`nav-link ${activeTab === 'leaderboard' ? 'active' : ''}`}
                    onClick={() => {
                    setActiveTab('leaderboard');
                    navigate('/admin-dashboard-leaderboard');
                    }}
            >
                <i className="fas fa-trophy mr-2"></i>Leaderboard
            </button>
          </li>
        </ul>
  
        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'games' && (
            <GameManager 
              games={games}
              onCreateGame={createGame}
              onSelectGame={selectGame}
              selectedGame={selectedGame}
              onDeleteGame={deleteGame}
            />
          )}
          
          {activeTab === 'participants' && (
            <ParticipantManager 
              selectedGame={selectedGame}
              onUpdateGame={updateGame}
            />
          )}
          
          {activeTab === 'leaderboard' && (
            <Leaderboard selectedGame={selectedGame} />
          )}
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;