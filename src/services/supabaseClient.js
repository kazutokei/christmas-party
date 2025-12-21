import { createClient } from '@supabase/supabase-js';

// REPLACE THESE WITH YOUR ACTUAL KEYS
const SUPABASE_URL = 'https://fwlsrkvvlefzpweduvdv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bHNya3Z2bGVmenB3ZWR1dmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NjQ4ODIsImV4cCI6MjA4MTU0MDg4Mn0.D2AqWyZWoAdsEQ7LZXeq5xeCrAoWwBtRBZ_8h3mUKQY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper to check if email is admin
export const ADMIN_EMAIL = 'admin@christmas.com';

export const isUserAdmin = (email) => {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};