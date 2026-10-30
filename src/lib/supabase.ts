import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.includes('your-project-id') || supabaseAnonKey.includes('eyJhbGciOi...')) {
    return false;
  }
  return supabaseUrl.startsWith('https://');
};

// Public client for browser & standard client queries
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin client for secure backend operations (bypassing RLS when necessary)
export const supabaseAdmin = isSupabaseConfigured() && supabaseServiceKey && !supabaseServiceKey.includes('...')
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;
