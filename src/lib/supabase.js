import { createClient } from '@supabase/supabase-js';

// Project Ref provided by user: buhkbqyoligheglutrlc
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://buhkbqyoligheglutrlc.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Sign in admin using Supabase Auth
 */
export async function adminSignIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

/**
 * Sign out admin
 */
export async function adminSignOut() {
  return await supabase.auth.signOut();
}
