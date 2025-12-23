import React from 'react';

function GiftGrid({ players, myPlayer, isMyTurn, myBroughtGift, onPick }) {
  const isSpectator = !myPlayer;

  return (
    <div className="grid-container">
      {players.map((_, i) => {
        const num = i + 1;
        const takenBy = players.find(p => p.picked_number === num);
        const isMine = myPlayer && takenBy?.id === myPlayer.id;
        const isMyBrought = myPlayer && (num === myBroughtGift);
        
        const disabled = !!takenBy || isMyBrought || !isMyTurn || isSpectator;

        return (
          <button 
            key={num} 
            className={`gift-box-btn ${takenBy?'taken':''} ${isMine?'mine':''} ${isMyBrought?'disabled-own':''}`} 
            onClick={() => !disabled && onPick(num)} 
            disabled={disabled}
          >
            {takenBy ? (
              // This structure works with the new CSS to force White Text
              <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                 <span style={{fontSize:'0.6rem', textTransform:'uppercase', opacity: 0.9}}>TAKEN BY</span>
                 <span style={{fontSize:'0.9rem', fontWeight:'800', textTransform:'uppercase'}}>{takenBy.name}</span>
              </div>
            ) : isMyBrought ? (
              <span style={{fontSize:'0.7rem', color:'#aaa'}}>YOUR<br/>GIFT</span>
            ) : (
              `Gift #${num}`
            )}
          </button>
        );
      })}
    </div>
  );
}

export default GiftGrid;