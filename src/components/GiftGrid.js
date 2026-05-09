import React from 'react';
import { Gift, Lock, Ban } from 'lucide-react';

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
              <span style={{fontSize:'0.8rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
                <Lock size={16} strokeWidth={2.5} />
                <span>{takenBy.name}</span>
              </span>
            ) : isMyBrought ? (
              <span style={{fontSize:'0.7rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
                <Ban size={16} strokeWidth={2.5} />
                <span>MY GIFT</span>
              </span>
            ) : (
              <span style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
                <Gift size={28} strokeWidth={2.5} />
                <span style={{fontWeight:'800'}}>#{num}</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default GiftGrid;