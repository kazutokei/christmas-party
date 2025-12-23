import React, { useState } from 'react';
import { APP_TEXT } from '../config';
import { showToast } from '../services/alertService'; // <--- ADDED IMPORT

function Lobby({ roomCode, players, myPlayer, isHost, actions, priceRule }) {
  const [newPrice, setNewPrice] = useState("");
  const [myWishlist, setMyWishlist] = useState(myPlayer?.wishlist || "");
  const [isSaved, setIsSaved] = useState(false);

  const handleSetPrice = () => {
    // UPDATED: Now shows a warning instead of failing silently
    if(!newPrice) return showToast("Please enter a budget amount", "warning");
    
    actions.updatePriceRule(newPrice);
    setNewPrice("");
  };

  const handleSaveWishlist = () => {
    actions.saveWishlist(myWishlist);
    setIsSaved(true);
    // Optional: You could also add a toast here if you want
    // showToast("Wishlist saved!", "success");
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <>
      {/* ROOM CODE BADGE */}
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <span style={{fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', fontWeight:'bold', display:'block', marginBottom:'10px'}}>
          Room Code
        </span>
        <div style={{
          display: 'inline-block',
          background: '#2c3e50',
          color: 'white',
          padding: '15px 40px',
          borderRadius: '50px',
          fontSize: '2.5rem',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          letterSpacing: '5px',
          boxShadow: '0 10px 20px rgba(44, 62, 80, 0.2)'
        }}>
          {roomCode}
        </div>
        <p style={{color: '#999', marginTop:'10px', fontSize:'0.9rem'}}>Share this code to invite friends!</p>
      </div>
      
      {/* PRICE RULE DISPLAY */}
      <div style={{background: '#E8F5E9', padding: '20px', borderRadius: '20px', marginBottom: '30px', textAlign: 'center'}}>
        <strong style={{color: '#2E7D32', display:'block', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'1px', fontSize:'0.8rem'}}>
          {APP_TEXT.priceLabel || "BUDGET / RULE"}
        </strong>
        <span style={{fontSize: '1.5rem', fontWeight: '800', color: '#2E7D32'}}>
          {priceRule || "Open Budget"}
        </span>
      </div>

      {isHost ? (
        // --- HOST CONTROLS ---
        <div className="admin-panel" style={{marginBottom: '30px'}}>
          <label style={{fontWeight:'bold', color:'#555', marginLeft:'10px'}}>Update Budget</label>
          
          <div className="modern-input-group" style={{marginTop:'5px', marginBottom:'20px'}}>
            <input 
              className="modern-input"
              placeholder="e.g. 500 PHP" 
              value={newPrice} 
              onChange={(e) => setNewPrice(e.target.value)} 
              style={{fontSize: '1.1rem'}} 
            />
            <button className="modern-btn" style={{minWidth:'100px', padding:'0 25px'}} onClick={handleSetPrice}>
              SET
            </button>
          </div>
          
          {myPlayer && (
            <div className="input-group" style={{textAlign:'left', marginTop:'20px'}}>
              <label>Your Wishlist</label>
              <textarea 
                rows="1"
                style={{width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #eee', resize:'none'}}
                placeholder="What do you want?"
                value={myWishlist}
                onChange={(e) => setMyWishlist(e.target.value)}
              />
              <button className="btn-secondary" style={{marginTop:'10px', borderRadius:'12px'}} onClick={handleSaveWishlist}>
                 {isSaved ? "Saved" : "Save My Wishlist"}
              </button>
            </div>
          )}

          <hr style={{width:'100%', borderTop:'2px solid #f0f0f0', margin:'30px 0'}}/>
          
          <button className="btn-primary" onClick={actions.startGame} style={{padding:'20px', fontSize:'1.2rem', marginBottom:'15px'}}>
            START GAME &rarr;
          </button>
          <button className="btn-secondary" onClick={actions.resetGame}>
            Reset Room
          </button>
        </div>
      ) : (
        // --- PLAYER CONTROLS ---
        <div className="admin-panel" style={{textAlign:'left', marginBottom:'30px'}}>
           <div className="input-group">
            <label>Your Wishlist (Secret)</label>
            <textarea 
              rows="3"
              style={{width: '100%', padding: '15px', borderRadius: '16px', border: '2px solid #e0e0e0', fontFamily: 'inherit', fontSize:'1rem'}}
              placeholder={APP_TEXT.wishlistPlaceholder}
              value={myWishlist}
              onChange={(e) => setMyWishlist(e.target.value)}
            />
            <button 
              className="btn-secondary" 
              style={{
                marginTop: '10px',
                background: isSaved ? '#4CAF50' : 'white', 
                color: isSaved ? 'white' : '#555',
                borderColor: isSaved ? '#4CAF50' : '#ddd'
              }} 
              onClick={handleSaveWishlist}
            >
              {isSaved ? "Saved Successfully" : "Save Wishlist"}
            </button>
          </div>
          <div style={{width: '100%', textAlign: 'center', color: '#4CAF50', fontWeight: 'bold', background:'#e8f5e9', padding:'10px', borderRadius:'10px'}}>
            You are ready to play!
          </div>
        </div>
      )}

      {/* PLAYER LIST */}
      <div className="player-list-container">
        <h3 style={{textAlign:'center', color:'#ccc', textTransform:'uppercase', fontSize:'0.8rem', letterSpacing:'1px'}}>
          Who is here ({players.length})
        </h3>
        <div className="player-chips">
          {players.map(p => (
            <span key={p.id} className="chip" style={{
              background: p.id === myPlayer?.id ? '#e8f5e9' : '#f5f5f5',
              border: p.id === myPlayer?.id ? '2px solid #4CAF50' : '1px solid #eee',
              padding: '10px 20px',
              borderRadius: '50px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              {p.name} {p.id === myPlayer?.id ? " (You)" : ""}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default Lobby;