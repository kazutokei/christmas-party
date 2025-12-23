import React from 'react';
import { APP_TEXT } from '../config';

function ResultsView({ players, myPlayer, isAdmin, isRevealed }) {
  if (isAdmin) {
    // Admin View: List Everyone
    return (
      <div className="results-container">
        {players.map((p) => {
          const giftNumber = p.picked_number;
          const gifter = giftNumber ? players[giftNumber - 1] : null; 
          
          return (
            <div key={p.id} className="result-card festive-mode">
              <div className="picker-header">👤 <strong>{p.name}</strong></div>
              
              {/* Show Wishlist if available */}
              {p.wishlist && (
                <div style={{fontSize: '0.8rem', color: '#666', background: '#f9f9f9', padding: '5px', borderRadius: '5px', marginBottom: '10px'}}>
                   📝 Wishlist: <em>{p.wishlist}</em>
                </div>
              )}

              <div className="funny-quote">
                {gifter ? (
                  <>
                    "Imong napilian kay si <span className="target-name">{gifter.name}</span> <br/>
                    {APP_TEXT.secretFooter}" 🤣
                  </>
                ) : <span style={{color:'#999'}}>Has not picked...</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Player View (Secret Phase)
  if (!isRevealed) {
    return (
      <div className="secret-card">
        <h1>{APP_TEXT.secretTitle}</h1>
        <p>{APP_TEXT.secretBody}</p>
        <img src="/neeeever.jpg" alt="Neeeeeverrrrr" className="neeeever-image" />
        <p className="sub-text">{APP_TEXT.secretFooter}</p>
      </div>
    );
  }

  // Player View (Revealed Phase)
  const myGiftPerson = myPlayer?.picked_number ? players[myPlayer.picked_number - 1] : null;

  return (
    <div className="result-card festive-mode scale-up">
       <h1 style={{fontSize: '1.5rem', color: '#888'}}>{APP_TEXT.revealHeader}</h1>
       <div className="funny-quote">
          {myGiftPerson ? (
            <>
              <span className="target-name big-reveal">
                {myGiftPerson.name}
              </span>
              
              {/* Show the person's wishlist to YOU */}
              {myGiftPerson.wishlist && (
                <div style={{fontSize: '1rem', color: '#555', margin: '15px 0', border: '1px dashed #ccc', padding: '10px'}}>
                   📝 Their Wishlist:<br/>
                   <strong>{myGiftPerson.wishlist}</strong>
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