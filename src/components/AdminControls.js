import React from 'react';

function AdminControls({ isRevealed, actions }) {
  return (
    <div className="admin-controls">
      <p style={{marginTop:0, fontWeight:'bold', color:'#888'}}>HOST PANEL</p>
      {!isRevealed ? (
        <button className="btn-primary reveal-btn" onClick={actions.revealAll}>
          🔓 FORCE REVEAL TO EVERYONE
        </button>
      ) : (
        <div className="admin-banner">✅ RESULTS ARE LIVE!</div>
      )}
      <button className="btn-secondary" onClick={actions.resetGame}>🔄 Reset Game</button>
    </div>
  );
}

export default AdminControls;