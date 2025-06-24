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
  
  const totalGames = games.length;
 
    return (
      // <div className="container-fluid py-4">
      //   <div className="row mb-4">
      //     <div className="col">
      //       <h1 className="display-4 text-center mb-0">
      //         <i className="fas fa-gamepad text-primary mr-3"></i>
      //         Party Games Admin Dashboard
      //       </h1>
      //       <p className="text-center text-muted">Manage games, players, and scores in real-time</p>
      //     </div>
      //   </div>
  
      //   {/* Statistics Cards */}
      //   <div className="row mb-4">
      //     <div className="col-md-3">
      //       <div className="card bg-primary text-white">
      //         <div className="card-body">
      //           <div className="d-flex justify-content-between">
      //             <div>
      //               <h4>{totalGames}</h4>
      //               <p className="mb-0">Total Games</p>
      //             </div>
      //             <i className="fas fa-gamepad fa-2x opacity-50"></i>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //     <div className="col-md-3">
      //       <div className="card bg-success text-white">
      //         <div className="card-body">
      //           <div className="d-flex justify-content-between">
      //             <div>
      //               <h4>totalPlayers</h4>
      //               <p className="mb-0">Total Players</p>
      //             </div>
      //             <i className="fas fa-users fa-2x opacity-50"></i>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //     <div className="col-md-3">
      //       <div className="card bg-warning text-white">
      //         <div className="card-body">
      //           <div className="d-flex justify-content-between">
      //             <div>
      //               <h4>highestScore</h4>
      //               <p className="mb-0">Highest Score</p>
      //             </div>
      //             <i className="fas fa-trophy fa-2x opacity-50"></i>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //     <div className="col-md-3">
      //       <div className="card bg-info text-white">
      //         <div className="card-body">
      //           <div className="d-flex justify-content-between">
      //             <div>
      //               <h4>{selectedGame ? selectedGame.participants.length : 0}</h4>
      //               <p className="mb-0">Active Players</p>
      //             </div>
      //             <i className="fas fa-user-friends fa-2x opacity-50"></i>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
  
      //   {/* Navigation Tabs */}
      //   <ul className="nav nav-tabs mb-4">
      //     <li className="nav-item">
      //       <button 
      //         className={`nav-link ${activeTab === 'games' ? 'active' : ''}`}
      //         onClick={() => setActiveTab('games')}
      //       >
      //         <i className="fas fa-gamepad mr-2"></i>Games
      //       </button>
      //     </li>
      //     <li className="nav-item">
      //       <button 
      //               className={`nav-link ${activeTab === 'leaderboard' ? 'active' : ''}`}
      //               onClick={() => {
      //               setActiveTab('leaderboard');
      //               navigate('/admin-dashboard-leaderboard');
      //               }}
      //       >
      //           <i className="fas fa-trophy mr-2"></i>Leaderboard
      //       </button>
      //     </li>
      //   </ul>
  
      //   {/* Tab Content */}
      //   <div className="tab-content">
      //     {activeTab === 'games' && (
      //       <GameManager 
      //         games={games}
      //         onCreateGame={createGame}
      //         onSelectGame={selectGame}
      //         selectedGame={selectedGame}
      //         onDeleteGame={deleteGame}
      //       />
      //     )}
          
      //     {activeTab === 'participants' && (
      //       <ParticipantManager 
      //         selectedGame={selectedGame}
      //         onUpdateGame={updateGame}
      //       />
      //     )}
          
      //     {activeTab === 'leaderboard' && (
      //       <Leaderboard selectedGame={selectedGame} />
      //     )}
      //   </div>
      // </div>
      
<div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-400 p-8 font-sans">
        <header className="text-center mb-12 text-white">
          <h1 className="text-4xl font-bold">Z Games Admin Dashboard</h1>
          <p className="text-base text-blue-200">Manage games, players, and scores in real-time</p>
        </header>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur rounded-2xl shadow-lg p-6 text-center text-white">
            <h2 className="text-3xl font-bold">{totalGames}</h2>
            <p className="mt-1 text-sm text-blue-200">Total Games</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl shadow-lg p-6 text-center text-white">
            <h2 className="text-3xl font-bold">totalPlayers</h2>
            <p className="mt-1 text-sm text-blue-200">Total Players</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl shadow-lg p-6 text-center text-white">
            <h2 className="text-3xl font-bold">highestScore</h2>
            <p className="mt-1 text-sm text-blue-200">Highest Score</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl shadow-lg p-6 text-center text-white">
            <h2 className="text-3xl font-bold">activePlayers</h2>
            <p className="mt-1 text-sm text-blue-200">Active Players</p>
          </div>
        </div>
        
        {/* Game Management Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h3 className="text-2xl font-semibold text-blue-700">Game Management</h3>
            <button 
              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition" 
              // onClick={openModal}
            >
              Add New Game
            </button>
          </div>
          
          {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {games.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>No games created yet. Click "Add New Game" to get started!</p>
              </div>
            ) : (
              games.map(game => (
                <div key={game.id} className="bg-blue-50 rounded-xl p-3 shadow-md hover:shadow-lg transition">
                  <h4 className="text-xl font-semibold text-blue-800 mb-1">{game.name || 'Untitled Game'}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Code: <span className="font-mono">{game.code || 'N/A'}</span>
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                      {game.participants?.length || 0} participants
                    </span>
                    <div className="flex space-x-1 text-lg">
                      {game.participants?.slice(0, 3).map((participant, index) => (
                        <span key={index}>👤</span>
                      ))}
                      {game.participants?.length > 3 && <span>...</span>}
                    </div>
                  </div>
                  <button 
                    className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm py-2 rounded-full hover:scale-105 transition"
                    onClick={() => selectGame(game)}
                  >
                    Manage Game
                  </button>
                </div>
              ))
            )}
          </div> */}


            <GameManager 
              games={games}
              onCreateGame={createGame}
              onSelectGame={selectGame}
              selectedGame={selectedGame}
              onDeleteGame={deleteGame}
            />

        </div>

        <footer className="mt-6 text-center text-sm text-white">
          <p>&copy; 2025 Z Games. All rights reserved.</p>
        </footer>
      </div>

    );
  };
  
  export default AdminDashboard;