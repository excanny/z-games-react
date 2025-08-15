import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminDashboard  from './components/AdminDashboard';
import Leaderboard from './components/Leaderboard';
import Scoreboard from './components/Scoreboard';
import SingleGame from './components/SingleGame';
import NotFound  from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import GameTemplateWizard from './components/GameTemplateForm/GameTemplateWizard';
import TournamentLeaderboard from './components/TournamentLeaderboard';
import TournamentScoring from './components/tournaments/scoring/TournamentScoring';
import Games from './components/Games';

function App() {

  return (

    <Router>
      <div className="App">
       
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Scoreboard />} />
            <Route path="/admin-login" element={<AdminLogin />} />
             <Route path="/games" element={<Games />} />
            <Route 
              path="/admin-dashboard" 
              element={
                // <ProtectedRoute>
                  <AdminDashboard />
                // </ProtectedRoute>
              } 
            />
            <Route path="/admin-dashboard-leaderboard" element={<Leaderboard />} />
            <Route path="/scoreboard/:gameId" element={<Scoreboard />} />
            <Route path="/game-setup" element={<GameTemplateWizard />} />
            <Route path="/game/:gameId" element={<SingleGame />} />
            <Route path="/tournament-leaderboard" element={<TournamentLeaderboard />} />
            <Route path="/tournament-scoring/:tournamentId" element={<TournamentScoring />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>

  )
}

export default App
