import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

function AuthScreen() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isRegistering) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Account created! You can now log in.");
      setLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Login Failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="hero-title">{isRegistering ? "Join the Party" : "Welcome Back"}</h1>
        <p className="hero-subtitle">Sign in to start swapping gifts!</p>
        
        <form onSubmit={handleAuth}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn-primary" disabled={loading}>
            {loading ? "Processing..." : (isRegistering ? "Sign Up" : "Log In")}
          </button>
        </form>
        
        <p className="auth-toggle" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already have an account? Log In" : "Need an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}

export default AuthScreen;