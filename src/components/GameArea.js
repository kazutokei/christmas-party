import React from 'react';
import { APP_TEXT } from '../config';
import AdminControls from './AdminControls';
import GiftGrid from './GiftGrid';
import ResultsView from './ResultsView';

function GameArea({ players, myPlayer, isAdmin, isGameOver, isRevealed, activePlayer, isMyTurn, myBroughtGift, actions }) {
  const showResults = isGameOver || isRevealed;

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

      {isAdmin && (
        <AdminControls isRevealed={isRevealed} actions={actions} />
      )}

      {showResults ? (
        <ResultsView 
          players={players} 
          myPlayer={myPlayer} 
          isAdmin={isAdmin} 
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
    </>
  );
}

export default GameArea;