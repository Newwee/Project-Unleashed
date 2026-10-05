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
 * Fetch Studio Content from Supabase table `studio_content`
 */
export async function fetchStudioContentFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('studio_content')
      .select('data')
      .eq('id', 'main')
      .single();

    if (!error && data?.data) {
      return { data: data.data, error: null };
    }
    return { data: null, error: error?.message };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

/**
 * Save Studio Content to Supabase table `studio_content`
 */
export async function saveStudioContentToSupabase(contentData) {
  try {
    const { data, error } = await supabase
      .from('studio_content')
      .upsert({
        id: 'main',
        data: contentData,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Upload Image to Supabase Storage (bucket 'studio-assets')
 * Returns public URL or falls back to Base64 data URL
 */
export async function uploadImageToSupabase(file) {
  if (!file) return null;
  const fileName = `asset_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;

  try {
    const { data, error } = await supabase.storage
      .from('studio-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage
        .from('studio-assets')
        .getPublicUrl(fileName);
      return publicUrlData.publicUrl;
    }
  } catch (e) {
    // If bucket doesn't exist, fall back to Base64 Data URL
  }

  // Fallback to Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

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
