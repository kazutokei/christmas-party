import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './services/supabaseClient';
import { showToast, showConfirm } from './services/alertService';
import AuthScreen from './components/AuthScreen';
import Home from './components/Home';
import Lobby from './components/Lobby';
import GameArea from './components/GameArea';

function App() {
  const [session, setSession] = useState(null);
  const [roomId, setRoomId] = useState(null);
  
  // Room Data
  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [myParticipant, setMyParticipant] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- ROOM LISTENER ---
  useEffect(() => {
    if (!roomId || !session) return;

    fetchRoomData();

    // Listen for changes in participants
    const participantChannel = supabase.channel(`participants_${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants', filter: `room_id=eq.${roomId}` }, () => {
        fetchParticipants();
      })
      .subscribe();

    // Listen for changes in room state
    const roomChannel = supabase.channel(`room_state_${roomId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` }, (payload) => {
        setRoomData(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(participantChannel);
      supabase.removeChannel(roomChannel);
    };
    // eslint-disable-next-line
  }, [roomId, session]);

  const fetchRoomData = async () => {
    const { data: r } = await supabase.from('rooms').select('*').eq('id', roomId).single();
    if (r) setRoomData(r);
    fetchParticipants();
  };

  const fetchParticipants = async () => {
    const { data: p } = await supabase.from('participants').select('*').eq('room_id', roomId).order('joined_at', { ascending: true });
    if (p) {
      setParticipants(p);
      const me = p.find(user => user.user_id === session.user.id);
      setMyParticipant(me);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); 
    setRoomId(null);
    setRoomData(null);
  };

  const handleLeaveRoom = () => {
    setRoomId(null);
    setRoomData(null);
    setParticipants([]);
    setMyParticipant(null);
  };

  // --- ACTIONS ---
  const actions = {
    startGame: async () => {
      await supabase.from('rooms').update({ is_started: true, reveal_phase: false }).eq('id', roomId);
      showToast("Game Started!", "success");
    },
    updatePriceRule: async (val) => {
      await supabase.from('rooms').update({ price_rule: val }).eq('id', roomId);
      showToast("Budget updated!", "success");
    },
    saveWishlist: async (val) => {
      await supabase.from('participants').update({ wishlist: val }).eq('id', myParticipant.id);
    },
    pickNumber: async (num) => {
       const active = participants.find(p => p.picked_number === null);
       
       if (active?.id !== myParticipant?.id) return showToast("Wait your turn!", "warning");
       if (participants.some(p => p.picked_number === num)) return showToast("That number is already taken!", "error");
       
       await supabase.from('participants').update({ picked_number: num }).eq('id', myParticipant.id);
       showToast(`You picked #${num}!`, "success");
    },
    revealAll: async () => {
      const confirmed = await showConfirm(
        "Reveal Results?", 
        "This will show everyone who got who. There is no going back!"
      );

      if (confirmed) {
        await supabase.from('rooms').update({ reveal_phase: true }).eq('id', roomId);
      }
    },
    resetGame: async () => {
      const confirmed = await showConfirm(
        "Reset Game?", 
        "This will clear all picked numbers and restart the lobby. Are you sure?",
        "Yes, Reset Everything"
      );

      if (confirmed) {
        await supabase.from('rooms').update({ is_started: false, reveal_phase: false, price_rule: 'Open Budget' }).eq('id', roomId);
        await supabase.from('participants').update({ picked_number: null }).eq('room_id', roomId);
        showToast("Game has been reset", "info");
      }
    }
  };

  // Derived State
  const isHost = roomData?.host_id === session?.user?.id;
  const activePlayer = participants.find(p => p.picked_number === null);
  const isMyTurn = activePlayer?.id === myParticipant?.id;
  const isGameOver = participants.length > 0 && !activePlayer;
  const myBroughtGift = myParticipant ? participants.findIndex(p => p.id === myParticipant.id) + 1 : -1;

  // --- RENDER ---
  return (
    <div className="App">
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="logo-image" onError={(e) => e.target.style.display='none'} />
        
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
               <img src="/cat-gift.png" alt="Christmas Cat" className="hero-image"/>
            </div>
          </>
        ) : !roomId ? (
          /* 2. LOGGED IN, NO ROOM SELECTED */
          <>
            <div className="text-section">
              <Home session={session} onJoinRoom={setRoomId} />
            </div>
            <div className="image-section">
               <img src="/cat-gift.png" alt="Christmas Cat" className="hero-image"/>
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
               <img src="/cat-gift.png" alt="Christmas Cat" className="hero-image"/>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;