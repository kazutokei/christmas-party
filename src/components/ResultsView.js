import React from 'react';
import { APP_TEXT } from '../config';

function ResultsView({ players, myPlayer, showMasterList, isRevealed }) {
  
  // 1. MASTER LIST (Host Mode)
  if (showMasterList) {
    return (
      <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
        {players.map((p) => {
          const giftNumber = p.picked_number;
          const gifter = giftNumber ? players[giftNumber - 1] : null; 
          return (
            <div key={p.id} style={{
              background:'white', 
              padding:'20px', 
              borderRadius:'16px', 
              textAlign:'left', 
              border:'1px solid #eee',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <div style={{fontWeight:'bold', fontSize:'1.1rem', color:'#2c3e50', marginBottom:'5px'}}>{p.name}</div>
              
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{color:'#888', fontSize:'0.9rem'}}>Gets gift from:</span>
                <span style={{fontWeight:'bold', color:'#D32F2F'}}>{gifter ? gifter.name : "..."}</span>
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
      <div style={{padding: '60px 0'}}>
        <h1 style={{margin:0}}>It is a Secret!</h1>
        <p style={{color:'#888'}}>Everyone has picked! Wait for the host to reveal.</p>
      </div>
    );
  }

  // 3. REVEALED PHASE
  const myGiftPerson = myPlayer?.picked_number ? players[myPlayer.picked_number - 1] : null;

  return (
    <div style={{animation: 'popIn 0.5s ease'}}>
       <h1 style={{color: '#999', fontSize: '1rem', textTransform:'uppercase', letterSpacing:'2px'}}>The Person You Picked</h1>
       
       <div style={{
         background: 'white', 
         border: '4px solid #D32F2F', 
         borderRadius: '30px', 
         padding: '40px 20px', 
         margin: '30px 0',
         boxShadow: '0 20px 40px rgba(211, 47, 47, 0.15)'
       }}>
          {myGiftPerson ? (
            <>
              <h1 style={{color: '#D32F2F', fontSize: '3.5rem', margin: '0', fontFamily:'Great Vibes, cursive'}}>
                {myGiftPerson.name}
              </h1>
              
              {myGiftPerson.wishlist && (
                <div style={{marginTop: '30px'}}>
                   <div style={{fontSize:'0.75rem', fontWeight:'bold', color:'#ccc', textTransform:'uppercase'}}>THEIR WISH</div>
                   <div style={{
                     background: '#FFF8E1', 
                     padding: '20px', 
                     borderRadius: '16px', 
                     marginTop: '10px',
                     fontStyle: 'italic',
                     color: '#5d4037'
                   }}>
                     "{myGiftPerson.wishlist}"
                   </div>
                </div>
              )}
            </>
          ) : <p>You did not pick a number!</p>}
       </div>
       
       <p style={{color: '#ccc', fontStyle:'italic'}}>{APP_TEXT.revealQuote || "Merry Christmas!"}</p>
    </div>
  );
}

export default ResultsView;