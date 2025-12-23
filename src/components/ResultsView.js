import React from 'react';
import { APP_TEXT } from '../config';

function ResultsView({ players, myPlayer, isHost, isRevealed, showMasterList }) {
  
  // 1. MASTER LIST (Host Mode)
  if (showMasterList) {
    return (
      <div className="results-container">
        <div className="admin-banner" style={{marginBottom:'15px'}}>📋 HOST MASTER LIST</div>
        {players.map((p) => {
          const giftNumber = p.picked_number;
          const gifter = giftNumber ? players[giftNumber - 1] : null; 
          return (
            <div key={p.id} className="result-card festive-mode">
              <div className="picker-header">👤 <strong>{p.name}</strong></div>
              {p.wishlist && (
                <div style={{fontSize: '0.85rem', color: '#555', background: '#f4f4f4', padding: '8px', borderRadius: '6px', margin: '8px 0'}}>
                   📝 Wish: {p.wishlist}
                </div>
              )}
              <div className="funny-quote">
                {gifter ? (
                  <>
                    "Imong napilian kay si <span className="target-name">{gifter.name}</span>"
                  </>
                ) : <span style={{color:'#999'}}>...</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 2. PLAYER VIEW (Secret Phase)
  if (!isRevealed) {
    return (
      <div className="secret-card">
        <h1>{APP_TEXT.secretTitle}</h1>
        <p>{APP_TEXT.secretBody}</p>
        <img src="/neeeever.jpg" alt="Secret" className="neeeever-image" />
        <p className="sub-text">{APP_TEXT.secretFooter}</p>
      </div>
    );
  }

  // 3. PLAYER VIEW (Revealed Phase)
  const myGiftPerson = myPlayer?.picked_number ? players[myPlayer.picked_number - 1] : null;

  return (
    <div className="result-card festive-mode scale-up">
       <h1 style={{fontSize: '1.5rem', color: '#888'}}>{APP_TEXT.revealHeader}</h1>
       <div className="funny-quote">
          {myGiftPerson ? (
            <>
              <span className="target-name big-reveal">{myGiftPerson.name}</span>
              
              {myGiftPerson.wishlist && (
                <div style={{fontSize: '1.1rem', color: '#444', margin: '20px 0', border: '2px dashed #6B8E23', padding: '15px', background:'#FDFCF6', borderRadius:'10px'}}>
                   📝 <strong>THEIR WISH:</strong><br/>
                   {myGiftPerson.wishlist}
                </div>
              )}

              <br/>
              {APP_TEXT.revealQuote}
            </>
          ) : <p>You didn't pick a number yet! 😅</p>}
       </div>
    </div>
  );
}

export default ResultsView;