import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://fwlsrkvvlefzpweduvdv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bHNya3Z2bGVmenB3ZWR1dmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NjQ4ODIsImV4cCI6MjA4MTU0MDg4Mn0.D2AqWyZWoAdsEQ7LZXeq5xeCrAoWwBtRBZ_8h3mUKQY';
const ADMIN_EMAIL = 'chavo.kentjohn@gmail.com'; // <--- TYPE YOUR ADMIN EMAIL HERE

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function App() {
  const [session, setSession] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [myPlayer, setMyPlayer] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const isAdmin = session?.user?.email === ADMIN_EMAIL;

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
    if (status) setGameStarted(status.is_started);
    
    supabase.channel('room1')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => {
        supabase.from('players').select('*').order('id', { ascending: true }).then(({ data }) => {
          setPlayers(data);
          setMyPlayer(data.find(p => p.user_id === userId));
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state' }, (payload) => {
        if (payload.new.id === 1) setGameStarted(payload.new.is_started);
      })
      .subscribe();
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      if (!displayName) return alert("Enter a name!");
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);
      if (data.user) {
        await supabase.from('players').insert([{ name: displayName, user_id: data.user.id }]);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Login Failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); setMyPlayer(null);
  };

  const handleStartGame = async () => {
    await supabase.from('game_state').update({ is_started: true }).eq('id', 1);
  };

  const handlePickNumber = async (number) => {
    const activePlayer = players.find(p => p.picked_number === null);
    if (activePlayer?.id !== myPlayer?.id) return alert("Wait your turn!");
    if (players.some(p => p.picked_number === number)) return alert("Taken!");
    await supabase.from('players').update({ picked_number: number }).eq('id', myPlayer.id);
  };

  const activePlayer = players.find(p => p.picked_number === null);
  const isMyTurn = activePlayer?.id === myPlayer?.id;
  const myBroughtGift = myPlayer ? players.findIndex(p => p.id === myPlayer.id) + 1 : -1;

  return (
    <div className="App">
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="logo-image" />
        {session && <button className="logout" onClick={handleLogout}>Log Out</button>}
      </nav>

      <div className="main-content">
        {!session ? (
          <div className="auth-container">
            <div className="auth-card">
              <h1 className="auth-title">{isRegistering ? "Join Party 🎄" : "Welcome Back!"}</h1>
              <form onSubmit={handleAuth}>
                {isRegistering && <div className="input-group"><label>Name</label><input value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>}
                <div className="input-group"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div className="input-group"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
                <button className="btn-primary full-width">{isRegistering ? "Sign Up" : "Log In"}</button>
              </form>
              <p className="auth-toggle" onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Login instead" : "Create account"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-section">
              {!gameStarted ? (
                <>
                  <h1 className="hero-title">Welcome, {myPlayer?.name || "Guest"}!</h1>
                  <p className="hero-subtitle">Wait for everyone to arrive!</p>
                  {isAdmin ? (
                    <div className="admin-panel">
                      <div className="success-badge">👑 You are the Host</div>
                      <button className="btn-primary" onClick={handleStartGame}>Start Game &rarr;</button>
                    </div>
                  ) : <div className="success-badge">✅ You are ready!</div>}
                  <div className="player-list-container">
                    <h3>Who is here ({players.length})</h3>
                    <div className="player-chips">{players.map(p => <span key={p.id} className="chip">👤 {p.name}</span>)}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="status-bar">
                    {activePlayer ? (isMyTurn ? <h2 className="status-text turn-mine">✨ IT'S YOUR TURN! ✨</h2> : <h2 className="status-text turn-other">⏳ Waiting for {activePlayer.name}...</h2>) : <h2 className="status-text turn-done">🎉 Merry Christmas!</h2>}
                  </div>
                  <div className="grid-container">
                    {players.map((_, i) => {
                      const num = i + 1;
                      const takenBy = players.find(p => p.picked_number === num);
                      const isMine = takenBy?.id === myPlayer?.id;
                      const isMyBrought = (num === myBroughtGift);
                      const disabled = !!takenBy || isMyBrought || !isMyTurn;
                      return (
                        <button key={num} className={`gift-box-btn ${takenBy?'taken':''} ${isMine?'mine':''} ${isMyBrought?'disabled-own':''}`} onClick={() => !disabled && handlePickNumber(num)} disabled={disabled}>
                          {takenBy ? `🔒 ${takenBy.name}` : isMyBrought ? "🚫 MY GIFT" : `🎁 #${num}`}
                        </button>
                      );
                    })}
                  </div>
                </>
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