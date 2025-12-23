import React, { useState } from 'react';
import { supabase, generateRoomCode } from '../services/supabaseClient';

function Home({ session, onJoinRoom }) {
  const [joinCode, setJoinCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [joinAsPlayer, setJoinAsPlayer] = useState(true);

  // --- OPTION A: CREATE A NEW ROOM ---
  const handleCreateRoom = async () => {
    if (joinAsPlayer && !displayName) return alert("Please enter your name to play!");
    
    setLoading(true);
    const newCode = generateRoomCode();
    const userId = session.user.id;

    // 1. Create the Room in Database
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert([{ code: newCode, host_id: userId }])
      .select()
      .single();

    if (roomError) {
      setLoading(false);
      return alert(roomError.message);
    }

    // 2. Add the Host as a Participant (if checked)
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
    onJoinRoom(room.id); // Tell App.js we are now in this room
  };

  // --- OPTION B: JOIN AN EXISTING ROOM ---
  const handleJoinRoom = async () => {
    if (!displayName) return alert("Please enter your name!");
    if (!joinCode) return alert("Enter a room code!");
    setLoading(true);

    // 1. Find the Room by Code
    const { data: room, error: findError } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', joinCode.toUpperCase())
      .single();

    if (findError || !room) {
      setLoading(false);
      return alert("Room not found! Check the code.");
    }

    // 2. Check if I am already in the room
    const { data: existing } = await supabase
      .from('participants')
      .select('*')
      .eq('room_id', room.id)
      .eq('user_id', session.user.id)
      .single();

    if (!existing) {
      // 3. Add me to the list
      const { error: joinError } = await supabase
        .from('participants')
        .insert([{ room_id: room.id, user_id: session.user.id, name: displayName }]);

      if (joinError) {
        setLoading(false);
        return alert(joinError.message);
      }
    }

    setLoading(false);
    onJoinRoom(room.id); // Tell App.js we are now in this room
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{maxWidth: '500px'}}>
        <h1 className="hero-title">Welcome! 👋</h1>
        <p className="hero-subtitle">What would you like to do?</p>
        
        <div className="input-group">
          <label>Your Nickname</label>
          <input 
            placeholder="e.g. Kent" 
            value={displayName} 
            onChange={e => setDisplayName(e.target.value)} 
          />
        </div>

        <hr style={{margin: '30px 0', borderTop: '1px solid #eee'}}/>

        {/* JOIN SECTION */}
        <div style={{background: '#f9f9f9', padding: '20px', borderRadius: '12px', marginBottom: '20px'}}>
          <h3>Enter a Room Code</h3>
          <div style={{display: 'flex', gap: '10px'}}>
            <input 
              placeholder="CODE" 
              style={{textTransform: 'uppercase', fontWeight: 'bold'}}
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
            />
            <button className="btn-primary" onClick={handleJoinRoom} disabled={loading}>JOIN</button>
          </div>
        </div>

        <div style={{textAlign: 'center', color: '#888', fontWeight: 'bold', marginBottom: '20px'}}>- OR -</div>

        {/* CREATE SECTION */}
        <div style={{border: '2px solid #6B8E23', padding: '20px', borderRadius: '12px', background: '#fcfdf9'}}>
          <h3 style={{color: '#6B8E23', marginTop:0}}>Create New Lobby</h3>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
            <input 
              type="checkbox" 
              id="joinCheck" 
              style={{width:'20px', height:'20px'}}
              checked={joinAsPlayer} 
              onChange={e => setJoinAsPlayer(e.target.checked)} 
            />
            <label htmlFor="joinCheck" style={{cursor:'pointer', color:'#555'}}>
              I want to join as a player too
            </label>
          </div>
          <button className="btn-primary" style={{width:'100%'}} onClick={handleCreateRoom} disabled={loading}>
            ✨ Create & Host
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;