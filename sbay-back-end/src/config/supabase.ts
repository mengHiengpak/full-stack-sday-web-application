import { StorageClient } from '@supabase/storage-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const storageUrl = supabaseUrl
  ? supabaseUrl.replace(/\/?$/, '') + '/storage/v1'
  : 'https://placeholder.supabase.co/storage/v1';

const supabase = {
  storage: new StorageClient(storageUrl, {
    apiKey: supabaseKey || 'placeholder-key',
    Authorization: `Bearer ${supabaseKey || 'placeholder-key'}`,
  }),
};

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ SUPABASE_URL and SUPABASE_KEY not set — Supabase uploads disabled');
}

export default supabase;
