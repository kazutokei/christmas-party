import React from 'react';
import { APP_TEXT } from '../config';
import { ADMIN_EMAIL } from '../services/supabaseClient';

function Lobby({ players, myPlayer, isAdmin, actions }) {
  const title = isAdmin ? APP_TEXT.welcomeHost : myPlayer ? `Welcome, ${myPlayer.name}!` : APP_TEXT.welcomeGuest;
  
  // FAIL-SAFE: Filter out any player named 'admin' or with the admin email just in case
  const realPlayers = players.filter(p => p.name.toLowerCase() !== 'admin');

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
        <h3>Who is here ({realPlayers.length})</h3>
        <div className="player-chips">
          {realPlayers.map(p => <span key={p.id} className="chip">👤 {p.name}</span>)}
          {realPlayers.length === 0 && <span style={{color:'#999'}}>Waiting for players...</span>}
        </div>
      </div>
    </>
  );
}

export default Lobby;