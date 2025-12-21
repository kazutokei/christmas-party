import React from 'react';
import { APP_TEXT } from '../config';

function Lobby({ players, myPlayer, isAdmin, actions }) {
  const title = isAdmin ? APP_TEXT.welcomeHost : myPlayer ? `Welcome, ${myPlayer.name}!` : APP_TEXT.welcomeGuest;
  
  return (
    <>
      <h1 className="hero-title">{title}</h1>
      <p className="hero-subtitle">{APP_TEXT.waitingSubtitle}</p>
      
      {isAdmin ? (
        <div className="admin-panel">
          <div className="success-badge">👑 You are the Host</div>
          <button className="btn-primary" onClick={actions.startGame}>Start Game &rarr;</button>
          <button className="btn-secondary" onClick={actions.resetGame}>🔄 Reset Everything</button>
        </div>
      ) : <div className="success-badge">✅ You are ready!</div>}

      <div className="player-list-container">
        <h3>Who is here ({players.length})</h3>
        <div className="player-chips">
          {players.map(p => <span key={p.id} className="chip">👤 {p.name}</span>)}
          {players.length === 0 && <span style={{color:'#999'}}>Waiting for players...</span>}
        </div>
      </div>
    </>
  );
}

export default Lobby;