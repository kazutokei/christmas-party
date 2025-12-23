import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase, isUserAdmin } from './services/supabaseClient';
import AuthScreen from './components/AuthScreen';
import Lobby from './components/Lobby';
import GameArea from './components/GameArea';

function App() {
  const [session, setSession] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [myPlayer, setMyPlayer] = useState(null);
  const [priceRule, setPriceRule] = useState(""); // NEW STATE

  const isAdmin = isUserAdmin(session?.user?.email);
  
  const activePlayer = players.find(p => p.picked_number === null);
  const isMyTurn = activePlayer?.id === myPlayer?.id;
  const isGameOver = players.length > 0 && !activePlayer;
  const myBroughtGift = myPlayer ? players.findIndex(p => p.id === myPlayer.id) + 1 : -1;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchInitialData(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchInitialData(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchInitialData = async (userId) => {
    const { data: playerList } = await supabase.from('players').select('*').order('id', { ascending: true });
    if (playerList) {
      setPlayers(playerList);
      setMyPlayer(playerList.find(p => p.user_id === userId));
    }
    const { data: status } = await supabase.from('game_state').select('*').eq('id', 1).single();
    if (status) {
      setGameStarted(status.is_started);
      setIsRevealed(status.reveal_phase);
      setPriceRule(status.price_rule || "Open Budget"); // NEW
    }
    
    supabase.channel('room1')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => {
        supabase.from('players').select('*').order('id', { ascending: true }).then(({ data }) => {
          setPlayers(data);
          setMyPlayer(data.find(p => p.user_id === userId));
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state' }, (payload) => {
        if (payload.new.id === 1) {
          setGameStarted(payload.new.is_started);
          setIsRevealed(payload.new.reveal_phase);
          setPriceRule(payload.new.price_rule); // NEW
        }
      })
      .subscribe();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); setMyPlayer(null);
  };

  const actions = {
    pickNumber: async (number) => {
      if (isAdmin) return alert("Hosts don't pick gifts!");
      if (!myPlayer) return alert("You are not a registered player.");
      if (activePlayer?.id !== myPlayer?.id) return alert("Wait your turn!");
      if (players.some(p => p.picked_number === number)) return alert("Taken!");
      await supabase.from('players').update({ picked_number: number }).eq('id', myPlayer.id);
    },
    startGame: async () => {
      await supabase.from('game_state').update({ is_started: true, reveal_phase: false }).eq('id', 1);
    },
    resetGame: async () => {
      if (window.confirm("⚠️ WARNING: This will RESET everything. Are you sure?")) {
        await supabase.from('game_state').update({ is_started: false, reveal_phase: false, price_rule: 'Open Budget' }).eq('id', 1);
        await supabase.from('players').update({ picked_number: null, wishlist: null }).gt('id', 0);
      }
    },
    revealAll: async () => {
      if (window.confirm("Are you sure? This will show EVERYONE their results!")) {
        await supabase.from('game_state').update({ reveal_phase: true }).eq('id', 1);
      }
    },
    // NEW ACTION: Update Price
    updatePriceRule: async (newRule) => {
      await supabase.from('game_state').update({ price_rule: newRule }).eq('id', 1);
    },
    // NEW ACTION: Save Wishlist
    saveWishlist: async (wishlistText) => {
      if (!myPlayer) return;
      await supabase.from('players').update({ wishlist: wishlistText }).eq('id', myPlayer.id);
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="logo-image" />
        {session && <button className="logout" onClick={handleLogout}>Log Out</button>}
      </nav>

      <div className="main-content">
        {!session ? (
          <AuthScreen />
        ) : (
          <>
            <div className="text-section">
              {!gameStarted ? (
                <Lobby 
                  players={players} 
                  myPlayer={myPlayer} 
                  isAdmin={isAdmin} 
                  actions={actions}
                  priceRule={priceRule} // NEW PROP
                />
              ) : (
                <GameArea 
                  players={players} 
                  myPlayer={myPlayer} 
                  isAdmin={isAdmin}
                  isGameOver={isGameOver}
                  isRevealed={isRevealed}
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