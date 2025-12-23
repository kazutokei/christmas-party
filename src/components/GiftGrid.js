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
        
        // Logic: Disable if taken, if it's my own gift, if not my turn, or if I'm just watching
        const disabled = !!takenBy || isMyBrought || !isMyTurn || isSpectator;

        return (
          <button 
            key={num} 
            className={`gift-box-btn ${takenBy?'taken':''} ${isMine?'mine':''} ${isMyBrought?'disabled-own':''}`} 
            onClick={() => !disabled && onPick(num)} 
            disabled={disabled}
          >
            {takenBy ? (
              <span style={{fontSize:'0.8rem'}}>🔒<br/>{takenBy.name}</span>
            ) : isMyBrought ? (
              <span style={{fontSize:'0.7rem'}}>🚫<br/>MY GIFT</span>
            ) : (
              `🎁 #${num}`
            )}
          </button>
        );
      })}
    </div>
  );
}

export default GiftGrid;