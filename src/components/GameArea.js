import React, { useState } from 'react';
import { APP_TEXT } from '../config';
import AdminControls from './AdminControls';
import GiftGrid from './GiftGrid';
import ResultsView from './ResultsView';

function GameArea({ players, myPlayer, isHost, isGameOver, isRevealed, activePlayer, isMyTurn, myBroughtGift, actions }) {
  const showResults = isGameOver || isRevealed;
  
  // Toggle: If I am just a Host (spectator), show Master List. If I am playing, show Player View.
  const [showMasterList, setShowMasterList] = useState(!myPlayer);

  return (
    <>
      <div className="status-bar">
        {showResults ? (
          isRevealed ? 
          <h2 className="status-text turn-done">{APP_TEXT.christmasTitle}</h2> :
          <h2 className="status-text turn-done">{APP_TEXT.revealTitle}</h2>
        ) : activePlayer ? (
          isMyTurn ? <h2 className="status-text turn-mine">{APP_TEXT.turnMine}</h2> : <h2 className="status-text turn-other">⏳ Waiting for {activePlayer.name}...</h2>
        ) : null}
      </div>

      {isHost && (
        <AdminControls isRevealed={isRevealed} actions={actions} />
      )}

      {/* Host Toggle: Only show if I am a Host AND a Player AND results are out */}
      {isHost && showResults && myPlayer && (
        <div style={{marginBottom: '20px', textAlign: 'center'}}>
          <button 
            className="btn-secondary" 
            style={{background: showMasterList ? '#333' : '#eee', color: showMasterList ? 'white' : '#333', fontSize:'0.9rem'}}
            onClick={() => setShowMasterList(!showMasterList)}
          >
            {showMasterList ? "👀 Switch to Player View" : "📜 Switch to Master List (Spoilers!)"}
          </button>
        </div>
      )}

      {showResults ? (
        <ResultsView 
          players={players} 
          myPlayer={myPlayer} 
          isHost={isHost} 
          isRevealed={isRevealed} 
          showMasterList={showMasterList}
        />
      ) : (
        <GiftGrid 
          players={players} 
          myPlayer={myPlayer} 
          isMyTurn={isMyTurn} 
          myBroughtGift={myBroughtGift} 
          onPick={actions.pickNumber} 
        />
      )}
    </>
  );
}

export default GameArea;