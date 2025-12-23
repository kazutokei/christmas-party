import React from 'react';

function GiftGrid({ players, myPlayer, isMyTurn, myBroughtGift, onPick }) {
  // If myPlayer is null, I am a spectator host
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
            {takenBy ? `🔒 ${takenBy.name}` : isMyBrought ? "🚫 MY GIFT" : `🎁 #${num}`}
          </button>
        );
      })}
    </div>
  );
}

export default GiftGrid;