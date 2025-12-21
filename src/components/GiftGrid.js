import React from 'react';

function GiftGrid({ players, myPlayer, isMyTurn, myBroughtGift, onPick }) {
  return (
    <div className="grid-container">
      {players.map((_, i) => {
        const num = i + 1;
        const takenBy = players.find(p => p.picked_number === num);
        const isMine = takenBy?.id === myPlayer?.id;
        const isMyBrought = (num === myBroughtGift);
        const disabled = !!takenBy || isMyBrought || !isMyTurn;

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