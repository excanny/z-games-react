import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';


const GameManager = ({ onCreateGame, selectedGame }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({ 
    name: '', 
    description: '',
    participants: []
  });
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    avatar: 'fox', // Set default avatar
    color: '#FF5733' // Set default color
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const avatarOptions = ['fox', 'cat', 'dog', 'bear', 'rabbit', 'wolf', 'owl', 'dragon'];
  const colorOptions = ['#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33', '#33FFF5', '#FF8C33', '#8C33FF'];

  
  const handleCreateGame = async () => {
    if (newGame.name.trim() && newGame.participants.length > 0) {
      try {
        const gameData = {
          name: newGame.name,
          description: newGame.description,
          participants: newGame.participants
        };
  
        const response = await axios.post('http://localhost:5000/api/games', gameData);
        
        // Call the callback with the server response (which should include id, createdAt, status)
        onCreateGame(response.data);
        
        // Reset form state
        setNewGame({ 
          name: '', 
          description: '', 
          participants: []
        });
        setNewParticipant({
          name: '',
          avatar: 'fox',
          color: '#FF5733'
        });
        setShowCreateForm(false);
        
      } catch (error) {
        console.error('Error creating game:', error);
        // You might want to show an error message to the user here
        // For example: setError('Failed to create game. Please try again.');
      }
    }
  };

  const fetchGames = async () => {
    try {
      //setLoading(true);
      //setError(null);
      const response = await axios.get('http://localhost:5000/api/games'); 
      //console.log('Fetched games:', response.data.data);
      setGames(response.data.data);
    } catch (err) {
      //setError('Failed to fetch games. Please try again.');
      console.error('Error fetching games:', err);
    } finally {
      //setLoading(false);
    }
  };

  const addParticipantToNewGame = () => {
    // Check if name is provided
    if (newParticipant.name.trim()) {
      // Check if participant name already exists
      const nameExists = newGame.participants.some(p => 
        p.name.toLowerCase() === newParticipant.name.trim().toLowerCase()
      );
      
      if (nameExists) {
        alert('A participant with this name already exists!');
        return;
      }

      const participant = {
        ...newParticipant,
        id: Date.now() + Math.random(), // Make ID more unique
        name: newParticipant.name.trim()
      };
      
      setNewGame(prev => ({
        ...prev,
        participants: [...prev.participants, participant]
      }));
      
      // Reset participant form
      setNewParticipant({
        name: '',
        avatar: 'fox',
        color: '#FF5733'
      });
    }
  };

  const removeParticipantFromNewGame = (participantId) => {
    setNewGame(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== participantId)
    }));
  };

  const getAvatarEmoji = (avatar) => {
    const avatarMap = {
      fox: '🦊', cat: '🐱', dog: '🐶', bear: '🐻',
      rabbit: '🐰', wolf: '🐺', owl: '🦉', dragon: '🐉'
    };
    return avatarMap[avatar] || '🎮';
  };

  // Check if game creation should be disabled
  const isCreateDisabled = !newGame.name.trim() || newGame.participants.length === 0;

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <i className="fas fa-gamepad mr-2"></i>Game Management
        </h5>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6>All Games ({games.length})</h6>
          <button 
            className="btn btn-success btn-sm"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <i className="fas fa-plus mr-1"></i>Create New Game
          </button>
        </div>

        {showCreateForm && (
          <div className="card border-success mb-3">
            <div className="card-body">
              <h5 className="card-title text-success">Create New Game</h5>
              
              {/* Basic Game Info */}
              <div className="row mb-3">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Game Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newGame.name}
                      onChange={(e) => setNewGame({...newGame, name: e.target.value})}
                      placeholder="Enter game name"
                    />
                  </div>
                </div>
                
              </div>

              <div className="form-group mb-4">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={newGame.description}
                  onChange={(e) => setNewGame({...newGame, description: e.target.value})}
                  placeholder="Brief description of the game"
                />
              </div>

              {/* Add Participants Section */}
              <hr />
              <h6 className="text-success mb-3">
                Add Participants ({newGame.participants.length})
                <span className="text-danger"> *Required</span>
              </h6>
              
              {/* Add Participant Form */}
              <div className="card bg-light mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="small">Participant Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={newParticipant.name}
                          onChange={(e) => setNewParticipant({...newParticipant, name: e.target.value})}
                          placeholder="Enter name (individual or team)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addParticipantToNewGame();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="small">Avatar</label>
                        <select
                          className="form-control form-control-sm"
                          value={newParticipant.avatar}
                          onChange={(e) => setNewParticipant({...newParticipant, avatar: e.target.value})}
                        >
                          {avatarOptions.map(avatar => (
                            <option key={avatar} value={avatar}>
                              {avatar.charAt(0).toUpperCase() + avatar.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="small">Color</label>
                        <select
                          className="form-control form-control-sm"
                          value={newParticipant.color}
                          onChange={(e) => setNewParticipant({...newParticipant, color: e.target.value})}
                        >
                          {colorOptions.map(color => (
                            <option key={color} value={color}>{color}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                  </div>
                  <button
                    type="button"
                    onClick={addParticipantToNewGame}
                    disabled={!newParticipant.name.trim()}
                    className="btn btn-primary btn-sm"
                  >
                    <i className="fas fa-user-plus mr-1"></i>Add Participant
                  </button>
                </div>
              </div>

              {/* Show message when no participants */}
              {newGame.participants.length === 0 && (
                <div className="alert alert-warning">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Please add at least one participant to create a game.
                </div>
              )}

              {/* Participants List */}
              {newGame.participants.length > 0 && (
                <div className="card mb-3">
                  <div className="card-header bg-info text-white">
                    <h6 className="mb-0">Participants Added</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {newGame.participants.map(participant => (
                        <div key={participant.id} className="col-md-6 mb-2">
                          <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded">
                            <div className="d-flex align-items-center">
                              <div 
                                className="rounded-circle d-flex align-items-center justify-content-center mr-2"
                                style={{ 
                                  backgroundColor: participant.color, 
                                  width: '30px', 
                                  height: '30px',
                                  fontSize: '14px'
                                }}
                              >
                                {getAvatarEmoji(participant.avatar)}
                              </div>
                              <div>
                                <small className="font-weight-bold">{participant.name}</small>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeParticipantFromNewGame(participant.id)}
                              className="btn btn-outline-danger btn-sm"
                              title="Remove participant"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Create/Cancel Buttons */}
              <div className="form-group mb-0">
                <button 
                  type="button"
                  onClick={handleCreateGame} 
                  className="btn btn-success mr-2"
                  disabled={isCreateDisabled}
                  title={isCreateDisabled ? 'Please enter a game name and add at least one participant' : 'Create the game'}
                >
                  <i className="fas fa-check mr-1"></i>Create Game
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewGame({ name: '', description: '', participants: [] });
                    setNewParticipant({ name: '', avatar: 'fox', color: '#FF5733' });
                  }}
                  className="btn btn-secondary"
                >
                  <i className="fas fa-times mr-1"></i>Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Games Display */}
        <div className="row">
          {games.map(game => (
            <div key={game.id} className="col-md-6 mb-3">
              <div className={`card ${selectedGame?.id === game.id ? 'border-primary' : ''}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="card-title">{game.name}</h6>
                      <p className="card-text text-muted small">{game.description}</p>
                      <div className="d-flex align-items-center mb-2">
                        <span className="badge badge-info mr-2">
                          {game.participants ? game.participants.length : 0} participants
                        </span>
                        <span className={`badge ${game.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {game.status}
                        </span>
                        <span className="ml-2 text-muted small">
                         {game.gameCode ? `Code: ${game.gameCode}` : 'No code available'}   
                        </span>
                      </div>
                      
                      {/* Show participant avatars */}
                      {game.participants && game.participants.length > 0 && (
                        <div className="d-flex align-items-center">
                            {game.participants.slice(0, 4).map((participant, index) => (
                            <div 
                                key={participant.id || `participant-${index}`} // fallback to index if id is missing
                                className="rounded-circle d-flex align-items-center justify-content-center mr-1 border border-white"
                                style={{ 
                                backgroundColor: participant.color, 
                                width: '25px', 
                                height: '25px',
                                fontSize: '12px'
                                }}
                                title={participant.name}
                            >
                                {getAvatarEmoji(participant.avatar)}
                            </div>
                            ))}
                            {game.participants.length > 4 && (
                            <small className="text-muted ml-1">
                                +{game.participants.length - 4} more
                            </small>
                            )}
                        </div>
                        )}

                    </div>
                    {/* <div className="dropdown">
                      <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <div className="dropdown-menu">
                        <button 
                          className="dropdown-item"
                          onClick={() => onSelectGame(game)}
                        >
                          <i className="fas fa-check mr-2"></i>Select Game
                        </button>
                        <button 
                          className="dropdown-item text-danger"
                          onClick={() => onDeleteGame(game.id)}
                        >
                          <i className="fas fa-trash mr-2"></i>Delete Game
                        </button>
                      </div>
                    </div> */}

                  <div class="dropdown">
                    <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                      Manage game
                    </button>
                     {/* <i className="fas fa-ellipsis-v"></i> */}
                    <div class="dropdown-menu">
                      <a class="dropdown-item" href="#">Edit Game</a>
                      <a class="dropdown-item" href="#">Delete Game</a>
                    </div>
                  </div>
                    
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {games.length === 0 && (
          <div className="text-center py-4">
            <i className="fas fa-gamepad fa-3x text-muted mb-3"></i>
            <p className="text-muted">No games created yet. Create your first game to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameManager;