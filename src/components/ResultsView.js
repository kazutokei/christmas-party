import React from 'react';
import { APP_TEXT } from '../config';

function ResultsView({ players, myPlayer, showMasterList, isRevealed }) {
  
  // 1. MASTER LIST (Host Mode)
  if (showMasterList) {
    return (
      <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
        {players.map((p) => {
          const giftNumber = p.picked_number;
          const gifter = giftNumber ? players[giftNumber - 1] : null; 
          return (
            <div key={p.id} style={{background:'#f9f9f9', padding:'15px', borderRadius:'12px', textAlign:'left', borderLeft:'4px solid #c0392b'}}>
              <div style={{fontWeight:'bold', color:'#2c3e50'}}>{p.name}</div>
              {p.wishlist && <div style={{fontSize:'0.8rem', color:'#7f8c8d'}}>Wish: {p.wishlist}</div>}
              <div style={{marginTop:'5px', color:'#c0392b', fontWeight:'bold'}}>
                 Got gift from: {gifter ? gifter.name : "..."}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 2. SECRET PHASE
  if (!isRevealed) {
    return (
      <div style={{padding: '40px 0'}}>
        <h1>It's a Secret!</h1>
        <p>Wait for the host to reveal the results...</p>
      </div>
    );
  }

  // 3. REVEALED PHASE
  const myGiftPerson = myPlayer?.picked_number ? players[myPlayer.picked_number - 1] : null;

  return (
    <div style={{animation: 'popIn 0.5s ease'}}>
       <h1 style={{color: '#7f8c8d', fontSize: '1.5rem'}}>YOU GOT...</h1>
       
       <div style={{background: '#fff', border: '3px dashed #c0392b', borderRadius: '20px', padding: '30px', margin: '20px 0'}}>
          {myGiftPerson ? (
            <>
              <h1 style={{color: '#c0392b', fontSize: '3rem', margin: '10px 0'}}>{myGiftPerson.name}</h1>
              {myGiftPerson.wishlist && (
                <div style={{background: '#fcf3cf', padding: '15px', borderRadius: '10px', marginTop: '15px'}}>
                   <strong>THEIR WISH:</strong><br/>
                   {myGiftPerson.wishlist}
                </div>
              )}
            </>
          ) : <p>You didn't pick a number!</p>}
       </div>
       
       <p style={{fontStyle: 'italic', color: '#7f8c8d'}}>{APP_TEXT.revealQuote}</p>
    </div>
  );
}

export default ResultsView;