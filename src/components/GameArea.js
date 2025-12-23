import React, { useState } from 'react';
import { APP_TEXT } from '../config';
import AdminControls from './AdminControls';
import GiftGrid from './GiftGrid';
import ResultsView from './ResultsView';

function GameArea({ players, myPlayer, isHost, isGameOver, isRevealed, activePlayer, isMyTurn, myBroughtGift, actions }) {
  const showResults = isGameOver || isRevealed;
  const [showMasterList, setShowMasterList] = useState(!myPlayer);

  return (
    <div className="game-card">
      <div className="status-bar">
        {showResults ? (
          <h2 style={{margin:0, color:'#c0392b'}}>{isRevealed ? APP_TEXT.christmasTitle : APP_TEXT.revealTitle}</h2>
        ) : activePlayer ? (
          isMyTurn ? 
          <h2 style={{margin:0, color:'#27ae60'}}>✨ IT'S YOUR TURN! ✨</h2> : 
          <h2 style={{margin:0, color:'#7f8c8d'}}>⏳ Waiting for {activePlayer.name}...</h2>
        ) : null}
      </div>

      {isHost && <AdminControls isRevealed={isRevealed} actions={actions} />}

      {isHost && showResults && myPlayer && (
        <button 
          className="btn-secondary" 
          style={{marginBottom: '20px', fontSize: '0.8rem'}}
          onClick={() => setShowMasterList(!showMasterList)}
        >
          {showMasterList ? "👀 View My Secret Result" : "📜 View Master List (Spoilers)"}
        </button>
      )}

      {showResults ? (
        <ResultsView 
          players={players} 
          myPlayer={myPlayer} 
          showMasterList={showMasterList} 
          isRevealed={isRevealed} 
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
    </div>
  );
}

export default GameArea;