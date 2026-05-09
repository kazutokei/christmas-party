import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './services/supabaseClient';
import { useRoom } from './hooks/useRoom';
import AuthScreen from './components/AuthScreen';
import Home from './components/Home';
import Lobby from './components/Lobby';
import GameArea from './components/GameArea';

function App() {
  const [session, setSession] = useState(null);
  const [roomId, setRoomId] = useState(null);
  
  const {
    roomData,
    participants,
    myParticipant,
    isHost,
    activePlayer,
    isMyTurn,
    isGameOver,
    myBroughtGift,
    actions,
    clearRoom
  } = useRoom(roomId, session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); 
    setRoomId(null);
    clearRoom();
  };

  const handleLeaveRoom = () => {
    setRoomId(null);
    clearRoom();
  };

  // --- RENDER ---
  return (
    <div className="App">
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="logo-image" draggable="false" onError={(e) => e.target.style.display='none'} />
        
        {session && (
          <div style={{display:'flex', gap:'10px'}}>
             {roomId && <button className="logout" onClick={handleLeaveRoom}>Leave Room</button>}
             <button className="logout" onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </nav>

      <div className="main-content">
        {!session ? (
          /* 1. NOT LOGGED IN */
          <>
            <div className="text-section">
              <AuthScreen />
            </div>
            <div className="image-section">
               <img src="/cat-gift.png" alt="Christmas Cat" className="hero-image" draggable="false" />
            </div>
          </>
        ) : !roomId ? (
          /* 2. LOGGED IN, NO ROOM SELECTED */
          <>
            <div className="text-section">
              <Home session={session} onJoinRoom={setRoomId} />
            </div>
            <div className="image-section">
               <img src="/cat-gift.png" alt="Christmas Cat" className="hero-image" draggable="false" />
            </div>
          </>
        ) : !roomData ? (
          /* 3. LOADING ROOM DATA */
          <div style={{color:'#2E7D32', fontSize:'1.5rem', fontWeight:'bold'}}>Loading Party...</div>
        ) : (
          /* 4. INSIDE A ROOM (LOBBY or GAME) */
          <>
            <div className="text-section">
              {!roomData.is_started ? (
                <Lobby 
                  roomCode={roomData.code}
                  players={participants} 
                  myPlayer={myParticipant} 
                  isHost={isHost} 
                  actions={actions}
                  priceRule={roomData.price_rule}
                />
              ) : (
                <GameArea 
                  players={participants} 
                  myPlayer={myParticipant} 
                  isHost={isHost}
                  isGameOver={isGameOver}
                  isRevealed={roomData.reveal_phase}
                  activePlayer={activePlayer}
                  isMyTurn={isMyTurn}
                  myBroughtGift={myBroughtGift}
                  actions={actions}
                />
              )}
            </div>
            
            <div className="image-section">
               <img src="/cat-gift.png" alt="Christmas Cat" className="hero-image" draggable="false" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;