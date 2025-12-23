import React, { useState } from 'react';
import { APP_TEXT } from '../config';
import { ADMIN_EMAIL } from '../services/supabaseClient';

function Lobby({ players, myPlayer, isAdmin, actions, priceRule }) {
  const [newPrice, setNewPrice] = useState("");
  const [myWishlist, setMyWishlist] = useState(myPlayer?.wishlist || "");
  const [isSaved, setIsSaved] = useState(false);

  const title = isAdmin ? APP_TEXT.welcomeHost : myPlayer ? `Welcome, ${myPlayer.name}!` : APP_TEXT.welcomeGuest;
  const realPlayers = players.filter(p => p.name.toLowerCase() !== 'admin');

  const handleSetPrice = () => {
    if(!newPrice) return;
    actions.updatePriceRule(newPrice);
    setNewPrice("");
  };

  const handleSaveWishlist = () => {
    actions.saveWishlist(myWishlist);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <>
      <h1 className="hero-title">{title}</h1>
      
      {/* PRICE RULE DISPLAY */}
      <div style={{background: '#E8F5E9', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #C8E6C9'}}>
        <strong style={{color: '#2E7D32', display:'block', marginBottom:'5px'}}>{APP_TEXT.priceLabel}</strong>
        <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{priceRule || "..."}</span>
      </div>

      {isAdmin ? (
        // --- HOST CONTROLS ---
        <div className="admin-panel">
          <div className="input-group">
            <label>Set Budget / Price Rule</label>
            <div style={{display:'flex', gap:'10px'}}>
              <input 
                placeholder="e.g. 500 Pesos Only" 
                value={newPrice} 
                onChange={(e) => setNewPrice(e.target.value)} 
              />
              <button className="btn-primary" style={{margin:0, padding: '10px'}} onClick={handleSetPrice}>Set</button>
            </div>
          </div>
          <hr style={{width:'100%', borderColor:'#eee'}}/>
          <button className="btn-primary" onClick={actions.startGame}>Start Game &rarr;</button>
          <button className="btn-secondary" onClick={actions.resetGame}>🔄 Reset Everything</button>
        </div>
      ) : (
        // --- PLAYER CONTROLS (Wishlist) ---
        <div className="admin-panel" style={{textAlign:'left'}}>
           <div className="input-group">
            <label>📝 Your Wishlist (Will be revealed later!)</label>
            <textarea 
              rows="2"
              style={{width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #E0E0E0', fontFamily: 'inherit'}}
              placeholder={APP_TEXT.wishlistPlaceholder}
              value={myWishlist}
              onChange={(e) => setMyWishlist(e.target.value)}
            />
            <button 
              className="btn-secondary" 
              style={{background: isSaved ? '#6B8E23' : 'white', color: isSaved ? 'white' : '#666'}} 
              onClick={handleSaveWishlist}
            >
              {isSaved ? APP_TEXT.wishlistSaved : "Save Wishlist"}
            </button>
          </div>
          <div className="success-badge" style={{width: '100%', textAlign: 'center'}}>✅ You are ready!</div>
        </div>
      )}

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