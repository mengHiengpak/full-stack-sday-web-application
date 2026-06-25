import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient;
try {
  supabase = createClient(
    process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_KEY || 'placeholder-key'
  );
} catch (e) {
  console.warn('⚠️ Supabase realtime not supported on Node.js 20 — uploads fallback to local/Cloudinary');
  supabase = {} as SupabaseClient;
}

export default supabase;
