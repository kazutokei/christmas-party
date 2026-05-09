import { createClient } from '@supabase/supabase-js';

// Use environment variables for security
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;


export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// NEW: Helper to generate a random 6-character code
export const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};