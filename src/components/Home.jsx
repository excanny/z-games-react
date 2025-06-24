import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [gameCode, setGameCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
     const navigate = useNavigate();
    //const [showScoreboard, setShowScoreboard] = useState(false);
 
    // const handleCodeSubmit = () => {
    //     if (gameCode.trim().toUpperCase() === MASTER_CODE) {
    //         setErrorMessage('');
    //         //setShowScoreboard(true);
    //         //Navigate('/admin-dashboard-leaderboard'); // Redirect to the leaderboard page
    //         navigate("/scoreboard");

    //     } else {
    //         setErrorMessage('Invalid game code. Please try again.');
    //         setGameCode('');
    //     }
    // };

   

const handleCodeSubmit = async () => {
    try {
        setErrorMessage(''); // Clear any previous errors
        
        // Make API call to validate the game code
        const response = await axios.get(`http://localhost:5000/api/games/code/${gameCode.trim().toUpperCase()}`);
        
        // If the API call is successful, navigate to scoreboard
        if (response.status === 200) {
            navigate("/scoreboard");
        }
        
    } catch (error) {
        // Handle different types of errors
        if (error.response) {
            // Server responded with error status
            if (error.response.status === 404) {
                setErrorMessage('Invalid game code. Please try again.');
            } else if (error.response.status === 400) {
                setErrorMessage('Bad request. Please check your game code.');
            } else {
                setErrorMessage('Server error. Please try again later.');
            }
        } else if (error.request) {
            // Network error
            setErrorMessage('Network error. Please check your connection.');
        } else {
            // Other error
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
        
        setGameCode(''); // Clear the game code input
    }
};
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCodeSubmit();
        }
    };
    
    // const resetToHome = () => {
    //     setShowScoreboard(false);
    //     setGameCode('');
    //     setErrorMessage('');
    // };
    
    // Scoreboard component
   
    
    // // Show scoreboard if code is valid
    // if (showScoreboard) {
    //     return <Scoreboard />;
    // }
    
    // Main home page
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Welcome to Z-Games</h1>
            <p>Your ultimate destination for gaming news, reviews, and updates!</p>
            
            <div style={{ 
                maxWidth: '400px', 
                margin: '40px auto', 
                padding: '30px', 
                border: '2px solid #007bff', 
                borderRadius: '10px',
                backgroundColor: '#f8f9fa'
            }}>
                <h2>Enter Game Code</h2>
                <p style={{ marginBottom: '20px', color: '#666' }}>
                    Enter the code provided by the games master to access the scoreboard
                </p>
                
                <input
                    type="text"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter game code"
                    style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        marginBottom: '15px',
                        textAlign: 'center',
                        textTransform: 'uppercase'
                    }}
                />
                
                <button
                    onClick={handleCodeSubmit}
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '12px 30px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                >
                    Enter
                </button>
                
                {errorMessage && (
                    <div style={{
                        marginTop: '15px',
                        padding: '10px',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #f5c6cb',
                        borderRadius: '5px'
                    }}>
                        ❌ {errorMessage}
                    </div>
                )}
            </div>
            
            <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
                <p>Need a game code? Contact your games master!</p>
            </div>
        </div>
    );
};

export default Home;