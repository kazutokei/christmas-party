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
  return (
    <div className="result-card festive-mode scale-up">
       <h1 style={{fontSize: '1.5rem', color: '#888'}}>{APP_TEXT.revealHeader}</h1>
       <div className="funny-quote">
          {myPlayer?.picked_number ? (
            <>
              <span className="target-name big-reveal">
                {players[myPlayer.picked_number - 1]?.name || "Error"}
              </span>
              <br/>
              {APP_TEXT.revealQuote}
            </>
          ) : <p>You didn't pick a number yet! 😅</p>}
       </div>
    </div>
  );
}

export default ResultsView;