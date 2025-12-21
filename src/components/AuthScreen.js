import React, { useState } from 'react';
import { supabase, ADMIN_EMAIL } from '../services/supabaseClient';

function AuthScreen() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      if (!displayName) return alert("Enter a name!");
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);
      if (data.user) {
        // Admin Logic: Only add to 'players' if NOT admin
        if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
          await supabase.from('players').insert([{ name: displayName, user_id: data.user.id }]);
        } else {
          alert("Host Account Created! You will not be listed as a player.");
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Login Failed: " + error.message);
    }
  };

  return (
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
  );
}

export default AuthScreen;