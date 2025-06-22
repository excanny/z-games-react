import React from 'react';

const Scoreboard = () => (
    <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>🏆 Scoreboard</h1>
        <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto', 
            backgroundColor: '#f5f5f5', 
            padding: '20px', 
            borderRadius: '10px',
            marginBottom: '20px'
        }}>
            <h2>Current Rankings</h2>
            <div style={{ textAlign: 'left', fontSize: '18px' }}>
                <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    🥇 Player Alpha - 2,450 points
                </div>
                <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    🥈 Player Beta - 2,100 points
                </div>
                <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    🥉 Player Gamma - 1,850 points
                </div>
                <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    4. Player Delta - 1,600 points
                </div>
                <div style={{ padding: '10px' }}>
                    5. Player Echo - 1,350 points
                </div>
            </div>
        </div>
        
    </div>
);

export default Scoreboard;