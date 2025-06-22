import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import AdminLogin from './components/AdminLogin'
import AdminDashboard  from './components/AdminDashboard'
import Leaderboard from './components/Leaderboard'
import Scoreboard from './components/Scoreboard'
import NotFound  from './components/NotFound';

function App() {

  return (
    <Router>
      <div className="App">
        {/* <nav className="navbar">
          <div className="nav-brand">
            <Link to="/">My React App</Link>
          </div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav> */}

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-dashboard-leaderboard" element={<Leaderboard />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 Z Games.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
