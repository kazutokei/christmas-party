import React, { useState } from 'react';
import { supabase, generateRoomCode } from '../services/supabaseClient';

function Home({ session, onJoinRoom }) {
  const [joinCode, setJoinCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Checkbox state: Do I want to play, or just host?
  const [joinAsPlayer, setJoinAsPlayer] = useState(true);

  // --- CREATE ROOM ---
  const handleCreateRoom = async () => {
    // If joining as player, name is required. If just hosting, name is optional.
    if (joinAsPlayer && !displayName) return alert("Please enter your name to play!");
    
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
      return alert(roomError.message);
    }

    // 2. Add Host as Participant (ONLY IF CHECKED)
    if (joinAsPlayer) {
      const { error: partError } = await supabase
        .from('participants')
        .insert([{ room_id: room.id, user_id: userId, name: displayName }]);

      if (partError) {
        setLoading(false);
        return alert(partError.message);
      }
    }

    setLoading(false);
    onJoinRoom(room.id); 
  };

  // --- JOIN ROOM ---
  const handleJoinRoom = async () => {
    if (!displayName) return alert("Please enter your name!");
    if (!joinCode) return alert("Enter a room code!");
    setLoading(true);

    // 1. Find Room
    const { data: room, error: findError } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', joinCode.toUpperCase())
      .single();

    if (findError || !room) {
      setLoading(false);
      return alert("Room not found! Check the code.");
    }

    // 2. Check if already joined
    const { data: existing } = await supabase
      .from('participants')
      .select('*')
      .eq('room_id', room.id)
      .eq('user_id', session.user.id)
      .single();

    if (!existing) {
      const { error: joinError } = await supabase
        .from('participants')
        .insert([{ room_id: room.id, user_id: session.user.id, name: displayName }]);

      if (joinError) {
        setLoading(false);
        return alert(joinError.message);
      }
    }

    setLoading(false);
    onJoinRoom(room.id);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{maxWidth: '500px'}}>
        <h1 className="hero-title">Welcome! 👋</h1>
        <p className="hero-subtitle">Start your gift exchange party.</p>
        
        <div className="input-group">
          <label>Your Nickname</label>
          <input 
            placeholder="e.g. Kent" 
            value={displayName} 
            onChange={e => setDisplayName(e.target.value)} 
          />
        </div>

        <hr style={{margin: '30px 0', borderTop: '1px solid #eee'}}/>

        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          {/* JOIN EXISTING */}
          <div style={{background: '#f9f9f9', padding: '20px', borderRadius: '12px'}}>
            <h3>Join a Party</h3>
            <div style={{display: 'flex', gap: '10px'}}>
              <input 
                placeholder="ENTER CODE" 
                style={{textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold'}}
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
              />
              <button className="btn-primary" onClick={handleJoinRoom} disabled={loading}>JOIN</button>
            </div>
          </div>

          <div style={{textAlign: 'center', color: '#888', fontWeight: 'bold'}}>- OR -</div>

          {/* CREATE NEW */}
          <div style={{border: '2px solid #6B8E23', padding: '20px', borderRadius: '12px', background: '#fcfdf9'}}>
            <h3 style={{color: '#6B8E23', marginTop:0}}>Create New Lobby</h3>
            
            {/* CHECKBOX FOR HOST JOINING */}
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
              <input 
                type="checkbox" 
                id="joinCheck" 
                style={{width:'20px', height:'20px'}}
                checked={joinAsPlayer} 
                onChange={e => setJoinAsPlayer(e.target.checked)} 
              />
              <label htmlFor="joinCheck" style={{cursor:'pointer', fontSize: '1rem', color:'#555'}}>
                I want to join the game as a player
              </label>
            </div>

            <button className="btn-primary" style={{width:'100%'}} onClick={handleCreateRoom} disabled={loading}>
              ✨ Create & Host
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;