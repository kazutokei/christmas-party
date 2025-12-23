import React, { useState } from 'react';
import { supabase, generateRoomCode } from '../services/supabaseClient';
import { showError, showToast } from '../services/alertService';

function Home({ session, onJoinRoom }) {
  const [joinCode, setJoinCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [joinAsPlayer, setJoinAsPlayer] = useState(true);

  // --- CREATE A NEW ROOM ---
  const handleCreateRoom = async () => {
    if (joinAsPlayer && !displayName) return showToast("Please enter your name to play!", "warning");
    
    setLoading(true);
    const newCode = generateRoomCode();
    const userId = session.user.id;

    // 1. Create Room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert([{ code: newCode, host_id: userId }])
      .select()
      .single();

    if (roomError) {
      setLoading(false);
      return showError("Error Creating Room", roomError.message);
    }

    // 2. Add Host as Participant (If checked)
    if (joinAsPlayer) {
      const { error: partError } = await supabase
        .from('participants')
        .insert([{ room_id: room.id, user_id: userId, name: displayName }]);

      if (partError) {
        setLoading(false);
        return showError("Error Joining", partError.message);
      }
    }

    setLoading(false);
    onJoinRoom(room.id); 
  };

  // --- JOIN AN EXISTING ROOM ---
  const handleJoinRoom = async () => {
    if (!displayName) return showToast("Please enter your name!", "warning");
    if (!joinCode) return showToast("Enter a room code!", "warning");
    setLoading(true);

    // 1. Find Room
    const { data: room, error: findError } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', joinCode.toUpperCase())
      .single();

    if (findError || !room) {
      setLoading(false);
      return showError("Room Not Found", "Check the code and try again.");
    }

    // 2. Add Player to Room
    // Check if already joined first to avoid duplicates
    const { data: existing } = await supabase.from('participants').select('*').eq('room_id', room.id).eq('user_id', session.user.id).single();

    if (!existing) {
      const { error: joinError } = await supabase
        .from('participants')
        .insert([{ room_id: room.id, user_id: session.user.id, name: displayName }]);

      if (joinError) {
        setLoading(false);
        return showError("Join Failed", joinError.message);
      }
    }

    setLoading(false);
    onJoinRoom(room.id);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{maxWidth: '550px'}}>
        <h1 className="hero-title">Welcome</h1>
        <p className="hero-subtitle">What would you like to do?</p>
        
        <div className="input-group">
          <label>Your Nickname</label>
          <input placeholder="e.g. Kent" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        </div>

        <hr style={{margin: '30px 0', borderTop: '1px solid #eee'}}/>

        {/* JOIN SECTION */}
        <div style={{background: '#fcfcfc', padding: '30px', borderRadius: '20px', marginBottom: '20px', border: '1px solid #f0f0f0'}}>
          <h3 style={{textAlign: 'center', marginBottom: '20px', color: '#34495e', fontSize: '1.2rem'}}>Enter a Room Code</h3>
          
          <div className="modern-input-group">
            <input 
              className="modern-input"
              placeholder="ENTER CODE" 
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
              maxLength={6}
            />
            <button className="modern-btn" onClick={handleJoinRoom} disabled={loading}>JOIN</button>
          </div>
        </div>

        <div style={{textAlign: 'center', color: '#ccc', fontWeight: 'bold', marginBottom: '20px', fontSize: '0.9rem'}}>- OR -</div>

        {/* CREATE SECTION */}
        <div style={{border: '2px dashed #4CAF50', padding: '20px', borderRadius: '16px', background: '#f1f8e9'}}>
          <h3 style={{color: '#2E7D32', marginTop:0, textAlign: 'center'}}>Create New Lobby</h3>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', justifyContent: 'center'}}>
            <input type="checkbox" id="joinCheck" style={{width:'18px', height:'18px', accentColor: '#2E7D32'}} checked={joinAsPlayer} onChange={e => setJoinAsPlayer(e.target.checked)} />
            <label htmlFor="joinCheck" style={{cursor:'pointer', color:'#555', fontWeight: '600', fontSize: '0.9rem'}}>I want to join as a player too</label>
          </div>
          <button className="btn-primary" style={{width:'100%', padding: '18px'}} onClick={handleCreateRoom} disabled={loading}>
             Create & Host
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;