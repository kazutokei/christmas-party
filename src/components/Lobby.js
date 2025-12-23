import React, { useState } from 'react';
import { APP_TEXT } from '../config';

function Lobby({ roomCode, players, myPlayer, isHost, actions, priceRule }) {
  const [newPrice, setNewPrice] = useState("");
  const [myWishlist, setMyWishlist] = useState(myPlayer?.wishlist || "");
  const [isSaved, setIsSaved] = useState(false);

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
      <div style={{textAlign: 'center', marginBottom: '30px', background: '#fff', padding: '20px', borderRadius: '15px', border: '2px dashed #D32F2F'}}>
        <span style={{fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight:'bold'}}>Room Code</span>
        <h1 style={{fontSize: '3.5rem', color: '#D32F2F', margin: '5px 0', letterSpacing: '5px', fontFamily: 'monospace', fontWeight:'900'}}>{roomCode}</h1>
        <p style={{color: '#666', margin:0}}>Share this code to invite friends!</p>
      </div>
      
      <div style={{background: '#E8F5E9', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #C8E6C9', textAlign: 'center'}}>
        <strong style={{color: '#2E7D32', display:'block', marginBottom:'5px'}}>{APP_TEXT.priceLabel}</strong>
        <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{priceRule || "Open Budget"}</span>
      </div>

      {isHost ? (
        <div className="admin-panel">
          <div className="input-group">
            <label>Set Budget / Price Rule</label>
            <div style={{display:'flex', gap:'10px'}}>
              <input 
                placeholder="e.g. 500 Pesos" 
                value={newPrice} 
                onChange={(e) => setNewPrice(e.target.value)} 
              />
              <button className="btn-primary" style={{margin:0, padding: '10px'}} onClick={handleSetPrice}>Set</button>
            </div>
          </div>
          
          {myPlayer && (
            <div className="input-group" style={{textAlign:'left', marginTop:'15px'}}>
              <label>Your Wishlist</label>
              <textarea 
                rows="1"
                style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd'}}
                placeholder="Your wish..."
                value={myWishlist}
                onChange={(e) => setMyWishlist(e.target.value)}
              />
              <button className="btn-secondary" style={{marginTop:'5px', padding:'5px', fontSize:'0.8rem'}} onClick={handleSaveWishlist}>
                 {isSaved ? "Saved!" : "Save My Wishlist"}
              </button>
            </div>
          )}

          <hr style={{width:'100%', borderColor:'#eee', margin:'20px 0'}}/>
          <button className="btn-primary" onClick={actions.startGame}>Start Game</button>
          <button className="btn-secondary" onClick={actions.resetGame} style={{marginTop: '10px'}}>Reset Everything</button>
        </div>
      ) : (
        <div className="admin-panel" style={{textAlign:'left'}}>
           <div className="input-group">
            <label>Your Wishlist (Secret until reveal!)</label>
            <textarea 
              rows="2"
              style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit'}}
              placeholder={APP_TEXT.wishlistPlaceholder}
              value={myWishlist}
              onChange={(e) => setMyWishlist(e.target.value)}
            />
            <button 
              className="btn-secondary" 
              style={{background: isSaved ? '#4CAF50' : 'white', color: isSaved ? 'white' : '#666'}} 
              onClick={handleSaveWishlist}
            >
              {isSaved ? APP_TEXT.wishlistSaved : "Save Wishlist"}
            </button>
          </div>
          <div className="success-badge" style={{width: '100%', textAlign: 'center', color: '#4CAF50', fontWeight: 'bold'}}>You are ready!</div>
        </div>
      )}

      <div className="player-list-container">
        <h3>Who is here ({players.length})</h3>
        <div className="player-chips">
          {players.map(p => (
            <span key={p.id} className="chip" style={{border: p.id === myPlayer?.id ? '2px solid #4CAF50' : '1px solid #ddd'}}>
              {p.name} {p.id === myPlayer?.id ? "(You)" : ""}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default Lobby;