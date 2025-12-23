import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

function AuthScreen() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      // Just create the account. We gather the "Name" later in the Home screen.
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);
      alert("Account created! You can now log in.");
      setIsRegistering(false);
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