import React from 'react';

function AdminControls({ isRevealed, actions }) {
  return (
    <div style={{
      background: 'white', 
      padding: '20px', 
      borderRadius: '20px', 
      marginBottom: '30px',
      border: '2px solid #f0f0f0',
      boxShadow: '0 5px 15px rgba(0,0,0,0.03)'
    }}>
      <p style={{
        margin: '0 0 15px 0', 
        fontSize: '0.75rem', 
        fontWeight: '800', 
        color: '#bbb', 
        textTransform: 'uppercase', 
        letterSpacing: '1px'
      }}>
        Host Controls
      </p>
      
      {!isRevealed ? (
        <button 
          className="btn-primary" 
          onClick={actions.revealAll} 
          style={{background: '#FF9800', boxShadow: '0 4px 0 #F57C00'}}
        >
          REVEAL ALL RESULTS
        </button>
      ) : (
        <div style={{
          padding: '15px', 
          background: '#E8F5E9', 
          color: '#2E7D32', 
          borderRadius: '12px', 
          fontWeight: 'bold',
          textAlign: 'center',
          border: '1px solid #C8E6C9'
        }}>
          RESULTS ARE LIVE
        </div>
      )}
      
      <button 
        className="btn-secondary" 
        onClick={actions.resetGame} 
        style={{marginTop: '15px', border:'none', color:'#999', textDecoration:'underline'}}
      >
        Reset Game
      </button>
    </div>
  );
}

export default AdminControls;