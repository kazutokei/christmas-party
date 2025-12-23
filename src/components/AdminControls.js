import React from 'react';

function AdminControls({ isRevealed, actions }) {
  return (
    <div style={{background: '#f9f9f9', padding: '15px', border: '1px solid #eee', borderRadius: '12px', marginBottom: '20px'}}>
      <p style={{margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: 'bold', color: '#999', textTransform: 'uppercase'}}>Host Controls</p>
      
      {!isRevealed ? (
        <button className="btn-primary" onClick={actions.revealAll} style={{background: '#e67e22', border: 'none'}}>
          REVEAL ALL RESULTS
        </button>
      ) : (
        <div style={{padding: '10px', background: '#d5f5e3', color: '#27ae60', borderRadius: '8px', fontWeight: 'bold'}}>
          RESULTS ARE LIVE
        </div>
      )}
      
      <button className="btn-secondary" onClick={actions.resetGame} style={{marginTop: '10px'}}>
        Reset Game
      </button>
    </div>
  );
}

export default AdminControls;