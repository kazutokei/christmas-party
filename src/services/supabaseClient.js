import { createClient } from '@supabase/supabase-js';

// REPLACE WITH YOUR KEYS
const SUPABASE_URL = 'https://fwlsrkvvlefzpweduvdv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bHNya3Z2bGVmenB3ZWR1dmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NjQ4ODIsImV4cCI6MjA4MTU0MDg4Mn0.D2AqWyZWoAdsEQ7LZXeq5xeCrAoWwBtRBZ_8h3mUKQY';


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