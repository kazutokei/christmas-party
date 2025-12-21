import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://fwlsrkvvlefzpweduvdv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bHNya3Z2bGVmenB3ZWR1dmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NjQ4ODIsImV4cCI6MjA4MTU0MDg4Mn0.D2AqWyZWoAdsEQ7LZXeq5xeCrAoWwBtRBZ_8h3mUKQY';
const ADMIN_EMAIL = 'chavo.kentjohn@gmail.com'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function App() {
  const [session, setSession] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [myPlayer, setMyPlayer] = useState(null);
  
  // Login States
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Case-insensitive Admin Check
  const isAdmin = session?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        }
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

  const handleGlobalReveal = async () => {
    const confirm = window.confirm("Are you sure? This will show EVERYONE their results immediately!");
    if (confirm) {
      await supabase.from('game_state').update({ reveal_phase: true }).eq('id', 1);
    }
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
  const isGameOver = players.length > 0 && !activePlayer;

  // The View switches to "Results" if Game is Over OR Admin Forced Reveal
  const showResultsView = isGameOver || isRevealed;

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
              <h1 className="auth-title">{isRegistering ? "Join Party 🎄" : "Welcome Back 🎅"}</h1>
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
                // LOBBY
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
                // GAME ACTIVE OR REVEALED
                <>
                  <div className="status-bar">
                    {showResultsView ? (
                      isRevealed ? 
                      <h2 className="status-text turn-done">🎄 MERRY CHRISTMAS! 🎄</h2> :
                      <h2 className="status-text turn-done">🎉 REVEAL TIME! 🎉</h2>
                    ) : activePlayer ? (
                      isMyTurn ? <h2 className="status-text turn-mine">✨ IT'S YOUR TURN! ✨</h2> : <h2 className="status-text turn-other">⏳ Waiting for {activePlayer.name}...</h2>
                    ) : null}
                  </div>

                  {/* --- NEW: ADMIN PANEL ALWAYS VISIBLE --- */}
                  {isAdmin && (
                    <div className="admin-controls">
                       <p style={{marginTop:0, fontWeight:'bold', color:'#888'}}>HOST PANEL</p>
                       {!isRevealed ? (
                          <button className="btn-primary reveal-btn" onClick={handleGlobalReveal}>
                            🔓 FORCE REVEAL TO EVERYONE
                          </button>
                       ) : (
                          <div className="admin-banner">✅ RESULTS ARE LIVE!</div>
                       )}
                    </div>
                  )}

                  {/* --- MAIN GAME AREA --- */}
                  {showResultsView ? (
                    isAdmin ? (
                      /* 1. ADMIN VIEW (Full List) */
                      <div className="results-container">
                        {players.map((p) => {
                          const giftNumber = p.picked_number;
                          // Safety check: if admin forces reveal early, giftNumber might be null
                          const gifter = giftNumber ? players[giftNumber - 1] : null; 

                          return (
                            <div key={p.id} className="result-card festive-mode">
                              <div className="picker-header">👤 <strong>{p.name}</strong></div>
                              <div className="funny-quote">
                                {gifter ? (
                                  <>
                                    "Imong napilian kay si <span className="target-name">{gifter.name}</span>! <br/>
                                    Neeeeeverrrrr dili mu-attend!" 🤣
                                  </>
                                ) : (
                                  <span style={{color:'#999'}}>Has not picked a gift yet...</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* 2. PLAYER VIEW (Secret vs Revealed) */
                      !isRevealed ? (
                        /* PHASE A: SECRET */
                        <div className="secret-card">
                          <h1>🤫 It's a Secret!</h1>
                          <p>Wait for the Host to reveal the results...</p>
                          <img src="/neeeever.jpg" alt="Neeeeeverrrrr" className="neeeever-image" />
                          <p className="sub-text">"Neeeeeverrrrr dili mu-attend!"</p>
                        </div>
                      ) : (
                        /* PHASE B: REVEALED */
                        <div className="result-card festive-mode scale-up">
                           <h1>🎁 IMONG NAPILIAN KAY SIIII...</h1>
                           <div className="funny-quote">
                              {myPlayer?.picked_number ? (
                                <>
                                  <span className="target-name big-reveal">
                                    {players[myPlayer.picked_number - 1]?.name || "Error"}
                                  </span>
                                  <br/><br/>
                                  "Neeeeeverrrrr dili mu-attend, dili mu-attend!" 🤣
                                </>
                              ) : (
                                <p>You didn't pick a number yet! 😅</p>
                              )}
                           </div>
                        </div>
                      )
                    )
                  ) : (
                    /* GAME GRID (Only shows if NOT revealed and NOT game over) */
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
                  )}
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