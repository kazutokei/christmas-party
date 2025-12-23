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
              <span style={{fontSize:'0.7rem', textTransform:'uppercase'}}>Taken by<br/>{takenBy.name}</span>
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