import React, { useState, useEffect } from 'react';
import { APP_TEXT } from '../config';
import AdminControls from './AdminControls';
import GiftGrid from './GiftGrid';
import ResultsView from './ResultsView';

function GameArea({ players, myPlayer, isHost, isGameOver, isRevealed, activePlayer, isMyTurn, myBroughtGift, actions }) {
  const showResults = isGameOver || isRevealed;
  
  // FIX: Default to false. Only change it if we are sure.
  const [showMasterList, setShowMasterList] = useState(false);

  // OPTIONAL: If you want Spectators (people not playing) to see the results automatically:
  useEffect(() => {
    // If I exist (I am playing), hide master list. If I am null (Spectator), show it.
    if (myPlayer) {
      setShowMasterList(false);
    } 
  }, [myPlayer]);

  return (
    <div className="game-card">
      <div className="status-bar" style={{marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee'}}>
        {showResults ? (
          <h2 style={{margin:0, color:'#c0392b'}}>{isRevealed ? APP_TEXT.christmasTitle : APP_TEXT.revealTitle}</h2>
        ) : activePlayer ? (
          isMyTurn ? 
          <h2 style={{margin:0, color:'#2E7D32'}}>IT'S YOUR TURN!</h2> : 
          <h2 style={{margin:0, color:'#7f8c8d'}}>Waiting for {activePlayer.name}...</h2>
        ) : null}
      </div>

      {isHost && <AdminControls isRevealed={isRevealed} actions={actions} />}

      {/* ONLY HOST CAN SEE THIS TOGGLE BUTTON */}
      {isHost && showResults && myPlayer && (
        <button 
          className="btn-secondary" 
          style={{marginBottom: '20px', fontSize: '0.8rem'}}
          onClick={() => setShowMasterList(!showMasterList)}
        >
          {showMasterList ? "View My Secret Result" : "View Master List (Spoilers)"}
        </button>
      )}

      {showResults ? (
        <ResultsView 
          players={players} 
          myPlayer={myPlayer} 
          // SECURITY CHECK: Only allow Master List if Host, OR if you are a Spectator
          showMasterList={isHost ? showMasterList : (!myPlayer)} 
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