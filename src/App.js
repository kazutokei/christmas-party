import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './services/supabaseClient';
import AuthScreen from './components/AuthScreen';
import Home from './components/Home'; // THIS IS THE KEY IMPORT
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
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  // --- ROOM LISTENER ---
  useEffect(() => {
    // Only fetch data if we are actually INSIDE a room (roomId is set)
    if (!roomId || !session) return;

    fetchRoomData();

    const channel = supabase.channel(`room_${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants', filter: `room_id=eq.${roomId}` }, () => {
        fetchParticipants();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` }, (payload) => {
        setRoomData(payload.new);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
    // eslint-disable-next-line
  }, [roomId, session]);

  const fetchRoomData = async () => {
    const { data: r } = await supabase.from('rooms').select('*').eq('id', roomId).single();
    setRoomData(r);
    fetchParticipants();
  };

  const fetchParticipants = async () => {
    const { data: p } = await supabase.from('participants').select('*').eq('room_id', roomId).order('joined_at', { ascending: true });
    setParticipants(p);
    const me = p.find(user => user.user_id === session.user.id);
    setMyParticipant(me);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); setRoomId(null);
  };

  const handleLeaveRoom = () => {
    setRoomId(null);
    setRoomData(null);
    setParticipants([]);
  };

  // --- ACTIONS ---
  const actions = {
    startGame: async () => {
      await supabase.from('rooms').update({ is_started: true, reveal_phase: false }).eq('id', roomId);
    },
    updatePriceRule: async (val) => {
      await supabase.from('rooms').update({ price_rule: val }).eq('id', roomId);
    },
    saveWishlist: async (val) => {
      await supabase.from('participants').update({ wishlist: val }).eq('id', myParticipant.id);
    },
    pickNumber: async (num) => {
       const active = participants.find(p => p.picked_number === null);
       if (active?.id !== myParticipant?.id) return alert("Wait your turn!");
       if (participants.some(p => p.picked_number === num)) return alert("Taken!");
       await supabase.from('participants').update({ picked_number: num }).eq('id', myParticipant.id);
    },
    revealAll: async () => {
      if (window.confirm("Show results?")) {
        await supabase.from('rooms').update({ reveal_phase: true }).eq('id', roomId);
      }
    },
    resetGame: async () => {
      if (window.confirm("Reset everything?")) {
        await supabase.from('rooms').update({ is_started: false, reveal_phase: false, price_rule: 'Open Budget' }).eq('id', roomId);
        await supabase.from('participants').update({ picked_number: null }).eq('room_id', roomId);
      }
    }
  };

  // Derived State
  const isHost = roomData?.host_id === session?.user?.id;
  const activePlayer = participants.find(p => p.picked_number === null);
  const isMyTurn = activePlayer?.id === myParticipant?.id;
  const isGameOver = participants.length > 0 && !activePlayer;
  const myBroughtGift = myParticipant ? participants.findIndex(p => p.id === myParticipant.id) + 1 : -1;

  return (
    <div className="App">
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="logo-image" />
        {session && (
          <div style={{display:'flex', gap:'10px'}}>
             {roomId && <button className="logout" onClick={handleLeaveRoom}>Leave Room</button>}
             <button className="logout" onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </nav>

      <div className="main-content">
        {!session ? (
          <AuthScreen />
        ) : !roomId ? (
          /* THIS SHOWS THE HOME SCREEN IF NO ROOM IS SELECTED */
          <Home session={session} onJoinRoom={setRoomId} />
        ) : !roomData ? (
          <div>Loading Room...</div>
        ) : (
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
            <div className="image-section"><img src="/side-image.png" alt="Gift" className="hero-image"/></div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;